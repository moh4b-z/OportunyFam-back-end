const redis = require('redis')

const REDIS_URL = process.env.REDIS_URL || null
let redisClient = null
let redisAvailable = false

if (REDIS_URL) {
  try {
    redisClient = redis.createClient({ url: REDIS_URL })
    redisClient.connect().then(() => {
      redisAvailable = true
      console.log('Redis conectado para cache')
    }).catch(err => {
      console.error('Erro conectando Redis, fallback para memória:', err.message)
      redisClient = null
      redisAvailable = false
    })
  } catch (err) {
    console.error('Redis init failed, fallback to memory cache', err.message)
    redisClient = null
    redisAvailable = false
  }
}

// Simple in-memory cache as fallback
const memoryCache = new Map()
// cleanup interval
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of memoryCache) {
    if (v.expiresAt <= now) memoryCache.delete(k)
  }
}, 5000)

function buildCacheKey(req) {
  return `cache:${req.method}:${req.originalUrl}`
}

function cacheMiddleware(ttlSeconds = 60) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next()

    const key = buildCacheKey(req)

    // Try Redis
    if (redisAvailable && redisClient) {
      try {
        const cached = await redisClient.get(key)
        if (cached) {
          res.set('X-Cache', 'HIT')
          res.set('Content-Type', 'application/json')
          return res.status(200).send(cached)
        }
      } catch (err) {
        // failover para memória
        console.error('Redis GET erro:', err.message)
      }
    }

    // Try memory
    const mem = memoryCache.get(key)
    if (mem && mem.expiresAt > Date.now()) {
      res.set('X-Cache', 'HIT')
      res.set('Content-Type', 'application/json')
      return res.status(200).send(mem.value)
    }

    // intercept send to cache response
    const originalSend = res.send.bind(res)
    res.send = async (body) => {
      try {
        let bodyStr = body
        if (typeof body !== 'string') {
          try { bodyStr = JSON.stringify(body) } catch (e) { bodyStr = String(body) }
        }

        if (redisAvailable && redisClient) {
          try {
            await redisClient.set(key, bodyStr, { EX: ttlSeconds })
          } catch (err) {
            console.error('Redis SET erro:', err.message)
          }
        } else {
          memoryCache.set(key, { value: bodyStr, expiresAt: Date.now() + ttlSeconds * 1000 })
        }
      } catch (err) {
        console.error('Erro ao salvar cache:', err.message)
      }
      res.set('X-Cache', 'MISS')
      return originalSend(body)
    }

    return next()
  }
}

function clearMemoryCache() {
  memoryCache.clear()
}

module.exports = {
  cacheMiddleware,
  clearMemoryCache,
  _memoryCache: memoryCache
}
