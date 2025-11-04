const Redis = require('redis')
const logger = require('../utils/logger')

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.on('error', (error) => {
  logger.error('Redis error:', error)
})

redisClient.on('connect', () => {
  logger.info('Redis connected')
})

// Conecta ao Redis
redisClient.connect().catch(console.error)

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`

    try {
      const cachedResponse = await redisClient.get(key)
      
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse))
      }

      // Modifica o res.json para interceptar e cachear a resposta
      const originalJson = res.json
      res.json = async (body) => {
        await redisClient.setEx(key, duration, JSON.stringify(body))
        return originalJson.call(res, body)
      }

      next()
    } catch (error) {
      logger.error('Redis cache error:', error)
      next()
    }
  }
}

// Função para invalidar cache por padrão
const invalidatePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length) {
      await redisClient.del(keys)
      logger.info(`Cache invalidado para padrão: ${pattern}`)
    }
  } catch (error) {
    logger.error('Erro ao invalidar cache:', error)
  }
}

module.exports = {
  cache,
  invalidatePattern
}