import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './utils/db.js'
import rateLimit from 'express-rate-limit'
import { userRouter } from './routes/userRoutes.js'

dotenv.config({})

const port = process.env.PORT || 3000
const app = express()

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
})

//MIDDLEWARES
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use(generalLimiter)

// ROUTES
app.use('/api/user/v1', userRouter)


app.get("/", (_, res) => res.send("<h1>Hello world</h1>"))

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing Prisma client...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing Prisma client...')
  await prisma.$disconnect()
  process.exit(0);
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
  }
)
