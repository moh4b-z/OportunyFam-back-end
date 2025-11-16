const cluster = require('cluster')
const os = require('os')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { limiter } = require('./src/middleware/auth')
const logger = require('./src/utils/logger')
const helmet = require('helmet')
const compression = require('compression')

// cluster-based server: aumenta throughput usando todos os núcleos
const numCPUs = process.env.WEB_CONCURRENCY ? parseInt(process.env.WEB_CONCURRENCY, 10) : os.cpus().length

if (cluster.isMaster) {
  logger.info(`Master PID ${process.pid} iniciando. Forking ${numCPUs} workers`)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} morreu (code: ${code}, signal: ${signal}). Reiniciando...`)
    cluster.fork()
  })
} else {
  const app = express()

  // Segurança e Performance
  app.use(helmet()) // Adiciona headers de segurança
  app.use(compression()) // Comprime respostas
  // CORS: permitir credenciais se FRONTEND_ORIGIN configurado
  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || true
  app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }))
  app.use(limiter) // Rate limiting (pode ser no-op em dev via env)
  app.use(bodyParser.json({ limit: '1mb' })) // Limita tamanho do payload

  // Health check rápido e simples para benchmarks
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok', pid: process.pid }))

  // Logging de requisições
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      logger.info({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: Date.now() - start,
        pid: process.pid
      })
    })
    next()
  })

  // Rotas
  const MainRoutes = require('./src/routes/MainRoutes')
  app.use('/v1/oportunyfam', MainRoutes)

  // Error Handling (deve vir por último)
  app.use((err, req, res, next) => {
    logger.error({
      error: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path,
      pid: process.pid
    })
    res.status(500).json({ erro: 'Erro interno do servidor' })
  })

  const PORT = process.env.PORT || 8080
  const server = app.listen(PORT, function () {
    logger.info(`Worker PID ${process.pid} servindo na porta ${PORT}`)
  })

  // Ajustes de keep-alive/headers para melhorar throughput em benchmarks
  // valores seguros e ajustáveis via env
  server.keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10) || 65000
  server.headersTimeout = parseInt(process.env.HEADERS_TIMEOUT, 10) || (server.keepAliveTimeout + 1000)
}
