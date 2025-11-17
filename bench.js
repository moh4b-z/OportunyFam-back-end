#!/usr/bin/env node

/**
 * Script de Benchmark - Testa throughput da API
 * 
 * Uso:
 *   node bench.js [--health] [--instituicoes] [--quick]
 * 
 * Exemplos:
 *   node bench.js --health              # Benchmark rápido em /health
 *   node bench.js --instituicoes        # Teste rotas de instituições (com cache)
 *   node bench.js --quick               # Teste rápido (10s) em /health
 * 
 * Requisitos:
 *   npm i -g autocannon
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const testHealth = args.includes('--health') || args.length === 0
const testInstituicoes = args.includes('--instituicoes')
const quickTest = args.includes('--quick')

const HOST = process.env.BENCH_HOST || 'http://localhost:8080'
const CONNECTIONS = quickTest ? 100 : parseInt(process.env.BENCH_CONNECTIONS || '1000', 10)
const DURATION = quickTest ? 10 : parseInt(process.env.BENCH_DURATION || '30', 10)
const REQUESTS = quickTest ? undefined : parseInt(process.env.BENCH_REQUESTS || '100000', 10)

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         API Performance Benchmark                             ║
╚════════════════════════════════════════════════════════════════╝

Configuração:
  Host: ${HOST}
  Conexões: ${CONNECTIONS}
  Duração: ${DURATION}s
  Requests: ${REQUESTS || 'N/A (até timeout)'}
  
Ambiente:
  NODE_ENV: ${process.env.NODE_ENV || 'development'}
  WEB_CONCURRENCY: ${process.env.WEB_CONCURRENCY || 'default'}
  DISABLE_REQUEST_LOGGING: ${process.env.DISABLE_REQUEST_LOGGING || '0'}
  REDIS_URL: ${process.env.REDIS_URL ? '✓ Configurado' : '✗ Não configurado'}
`)

async function runBenchmark(url, label) {
  return new Promise((resolve) => {
    console.log(`\n📊 Iniciando teste: ${label}`)
    console.log(`   URL: ${url}`)
    console.log(`   Aguardando ${DURATION}s...`)

    const cmd = [
      'autocannon',
      '-c', CONNECTIONS.toString(),
      '-d', DURATION.toString(),
      ...(REQUESTS ? ['-n', REQUESTS.toString()] : []),
      '--json',
      url
    ]

    const proc = spawn('npx', cmd, { stdio: ['ignore', 'pipe', 'pipe'] })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
      process.stderr.write(data)
    })

    proc.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Erro ao executar benchmark: ${stderr}`)
        resolve(null)
        return
      }

      try {
        const result = JSON.parse(stdout)
        printResults(label, result)
        resolve(result)
      } catch (e) {
        console.error('❌ Erro ao parsear JSON:', e.message)
        resolve(null)
      }
    })
  })
}

function printResults(label, result) {
  console.log(`\n✅ Resultados: ${label}`)
  console.log(`   Throughput: ${Math.round(result.requests.average).toLocaleString()} req/s`)
  console.log(`   Latency P50: ${Math.round(result.latency.p50)}ms`)
  console.log(`   Latency P99: ${Math.round(result.latency.p99)}ms`)
  console.log(`   Errors: ${result.errors || 0}`)
  console.log(`   Timeouts: ${result.timeouts || 0}`)
}

async function main() {
  const results = {}

  // Teste 1: Health (baseline simples)
  if (testHealth) {
    const healthUrl = `${HOST}/health`
    results.health = await runBenchmark(healthUrl, 'Health Check (Baseline)')
  }

  // Teste 2: Instituições (com cache)
  if (testInstituicoes) {
    const instUrl = `${HOST}/v1/oportunyfam/instituicoes`
    results.instituicoes = await runBenchmark(instUrl, 'GET /instituicoes (com cache)')
  }

  // Se nenhum teste specific, roda health por padrão
  if (!testHealth && !testInstituicoes) {
    const healthUrl = `${HOST}/health`
    results.health = await runBenchmark(healthUrl, 'Health Check (Baseline)')
  }

  // Salvar resultado em JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = path.join(__dirname, `bench_results_${timestamp}.json`)
  
  fs.writeFileSync(filename, JSON.stringify({
    timestamp: new Date().toISOString(),
    config: {
      host: HOST,
      connections: CONNECTIONS,
      duration: DURATION,
      requests: REQUESTS,
      nodeEnv: process.env.NODE_ENV,
      webConcurrency: process.env.WEB_CONCURRENCY,
      redisUrl: !!process.env.REDIS_URL
    },
    results
  }, null, 2))

  console.log(`\n📁 Resultado salvo em: ${filename}`)
  console.log(`\n📈 Resumo:`)
  
  if (results.health) {
    console.log(`   Health: ${Math.round(results.health.requests.average).toLocaleString()} req/s`)
  }
  if (results.instituicoes) {
    console.log(`   Instituições: ${Math.round(results.instituicoes.requests.average).toLocaleString()} req/s`)
  }
}

// Verificar se autocannon está disponível
spawn('which', ['autocannon'], { stdio: 'ignore' }).on('close', (code) => {
  if (code !== 0) {
    console.error('❌ autocannon não encontrado. Instale com:')
    console.error('   npm i -g autocannon')
    process.exit(1)
  }
  main().catch(console.error)
})
