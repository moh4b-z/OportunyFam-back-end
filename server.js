const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const { limiter } = require('./src/middleware/auth')
const logger = require('./src/utils/logger')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

// Segurança e Performance
app.use(helmet())  // Adiciona headers de segurança
app.use(compression())  // Comprime respostas
// CORS: permitir credenciais se FRONTEND_ORIGIN configurado
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || true
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }))
app.use(limiter)  // Rate limiting
app.use(bodyParser.json({ limit: '1mb' }))  // Limita tamanho do payload

// Logging de requisições
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Date.now() - start
    })
  })
  next()
})

// Error Handling
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path
  })
  res.status(500).json({ erro: 'Erro interno do servidor' })
})

// Rotas
const MainRoutes = require("./src/routes/MainRoutes")
app.use("/v1/oportunyfam", MainRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
  logger.info(`Servidor rodando na porta ${PORT}`)
})
