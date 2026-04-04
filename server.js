require('dotenv').config()

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('API is running 🚀')
})

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ message: 'DB connected!', time: result.rows[0].now })
  } catch (err) {
    console.error('DB test error:', err)
    res.status(500).json({ error: 'Database connection failed' })
  }
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