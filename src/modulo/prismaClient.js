const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    mysql: {
      url: process.env.DATABASE_URL_MYSQL,
      poolConfig: {
        max: 20,
        min: 5,
        idleTimeoutMillis: 30000
      }
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

module.exports = prisma