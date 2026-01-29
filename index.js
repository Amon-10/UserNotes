const express = require('express')

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})

const users = []
let nextId = 1

// get all users
app.get('/users', (req, res) => {
    res.json(users)
})

// GET users by id
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id)

    const user = users.find(u => u.id === id)

    if(!user) {
        return res.status(404).json({error: "User not found"})
    }
    
    res.json(user)
})

// DELETE user by id via postman
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id)

    const userIndex = users.findIndex(u => u.id === id)
    
    if(userIndex === -1){
        return res.status(404).json({error: 'user not found'})
    }
    users.splice(userIndex, 1)

    res.status(204).send()
})

// UPDATE user by id
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const { name } = req.body

    const user = users.find(u => u.id === id)

    if (!user) {
        return res.status(404).json({error: 'User not found'})
    }
    
    if (!name) {
        return res.status(400).json({error: 'Name is required'})
    }

    user.name = name
    res.json(user)
})

// add users via postman
app.post('/users', (req, res) => {
  const { name } = req.body

  if(!name){
    return res.status(400).json({error: 'Name is required'})
  }

  const newUser = {
    id: nextId++,
    name
  }

  users.push(newUser)

  res.status(201).json(newUser)
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})