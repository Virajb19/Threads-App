import { createMessageSchema } from "../types/messageTypes.js"
import { prisma } from "../utils/db.js"


export async function createMessage(req,res) {
     try {
          const parsedData = createMessageSchema.safeParse(req.body)
          if(!parsedData.success) return res.status(400).json({success: false, msg: 'Invalid inputs'})
          const { content } = parsedData.data
 
        const message = await prisma.message.create({data: {content, user: {connect: {id: req.userId} }}})


     } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while creating a message'})
     }
}