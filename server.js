import express from 'express'
import cors from 'cors'

const PORT = 8000

const app = express()

app.use(cors())
app.use(express.json()) // to parse incoming JSON data like user registration

app.use(express.static('public'))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))