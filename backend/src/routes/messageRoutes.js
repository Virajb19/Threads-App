import { Router } from "express";
import { createMessage } from "../controllers/messageController.js";

export const messageRouter = Router()

messageRouter.post('/create', createMessage)