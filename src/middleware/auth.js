const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const { JWT_SECRET = 'your-secret-key' } = process.env

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por windowMs
  message: 'Muitas requisições deste IP, tente novamente após 15 minutos'
})

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