require('dotenv').config()

const express = require('express')
const app = express()

const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/notes', noteRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})