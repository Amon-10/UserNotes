require('dotenv').config()

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('API is running 🚀')
})

const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')
const errorHandler = require('./middleware/errorMiddleware')

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/notes', noteRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})