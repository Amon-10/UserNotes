// counter api
// GET count
// POST increment, decrement

const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

let count = 1

// Validate body inputs for amount and operation
const validateCounter = (req, res, next) => {
    const { operation, amount } = req.body

    if (!operation) {
        return res.status(400).json({error: 'operation is required'})
    }
    if (!amount) {
        return res.status(400).json({error: 'amount is required'})
    }

    next()
}

app.get('/', (req, res) => {
    res.send('server is running')
})

// Get Count
app.get('/counter', (req, res) => {
    res.send(count)
})

app.post('/counter', validateCounter, (req, res) => {
    const { operation, amount } = req.body
    const number = Number(amount)

    if (isNaN(number)) {
        return res.status(400).json({error: 'Decrement number required'})
    }

    // Increment operation
    if (operation === "increment") {
        count = count + number
    }

    // Decrement operation
    else if (operation === "decrement") {
        count = count - number
    }

    // Any other operation throws error
    else {
        return res.status(400).json({error: 'Invalid operation'})
    }

    res.status(200).json(count)
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})