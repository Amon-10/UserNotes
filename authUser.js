const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

let users = []
let currentUser = null
let userId = 1

app.get('/', (req, res) => {
    res.send('server is running')
})


