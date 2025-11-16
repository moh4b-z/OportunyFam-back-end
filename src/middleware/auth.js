const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const { JWT_SECRET = 'your-secret-key' } = process.env

// Rate limiting (configurável via env)
// Para testes locais/desenvolvimento, defina SKIP_RATE_LIMIT=1 ou NODE_ENV !== 'production' para desabilitar
const SKIP_RATE_LIMIT = process.env.SKIP_RATE_LIMIT === '1' || process.env.NODE_ENV !== 'production'

let limiter
if (SKIP_RATE_LIMIT) {
  // no-op limiter em dev/test
  limiter = (req, res, next) => next()
} else {
  limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutos por padrão
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // por IP por janela
    message: process.env.RATE_LIMIT_MESSAGE || 'Muitas requisições deste IP, tente novamente após 15 minutos'
  })
}

// JWT Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2) {
    return res.status(401).json({ erro: 'Erro no token' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: 'Token mal formatado' })
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: 'Token inválido' })
    }

    req.userId = decoded.id
    return next()
  })
}

// Roles middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.userId) {
      return res.status(401).json({ erro: 'Autenticação necessária' })
    }

    // Aqui você verificaria o nível do usuário no banco
    // Por enquanto apenas passa
    next()
  }
}

module.exports = {
  limiter,
  authMiddleware,
  checkRole
}

// Cria um rate limiter por rota, com whitelist de IPs e configuração via options
// Uso: const { createRouteLimiter } = require('./src/middleware/auth')
// app.get('/rota', createRouteLimiter({ max: 1000, windowMs: 1000 }), handler)
const createRouteLimiter = (options = {}) => {
  const skipAll = SKIP_RATE_LIMIT
  if (skipAll) return (req, res, next) => next()

  const whitelistEnv = process.env.RATE_LIMIT_WHITELIST || ''
  const envList = whitelistEnv.split(',').map(s => s.trim()).filter(Boolean)
  const whitelist = new Set([...(options.whitelist || []), ...envList])

  const limiterOptions = {
    windowMs: options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: options.max || parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    message: options.message || process.env.RATE_LIMIT_MESSAGE || 'Muitas requisições deste IP, tente novamente mais tarde',
    // skip function: se IP na whitelist, não conta
    skip: (req, res) => {
      const ip = req.ip || req.connection?.remoteAddress
      if (!ip) return false
      return whitelist.has(ip)
    }
  }

  return rateLimit(limiterOptions)
}

module.exports.createRouteLimiter = createRouteLimiter