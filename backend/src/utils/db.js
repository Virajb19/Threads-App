import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
   const client = new PrismaClient()
   console.log("Prisma client created and connected to the database")
   return client
}

export const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}
