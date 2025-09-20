import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { authRouter } from './routes/auth.js'

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json()) // to parse incoming JSON data like user registration

app.use(express.static('public'))
app.use('/api/auth', authRouter)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
    .on('error', (err) => {
        console.error('Failed to start server:', err)
    })