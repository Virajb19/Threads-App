import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
   const client = new PrismaClient({
       log: ['query', 'info', 'warn', 'error'],
   })
   console.log("Prisma client created and connected to the database")
   return client
}

export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}
