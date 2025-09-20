import { registerUser } from '../controllers/authcontroller.js'
import express from 'express'

export const authRouter = express.Router()

authRouter.post('/register', registerUser)