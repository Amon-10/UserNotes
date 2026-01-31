// TODO API
// GET POST DELETE
// title, completed

const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

const todos = []
let nextId = 1

app.get('/', (req, res) => {
    res.send('server is walking')
})

app.get('/todo', (req, res) => {
    res.json(todos)
})

app.post('/todo', (req, res) => {
    const { title, completed } = req.body

    if(!title) {
        return res.status(400).json({error: 'title is required'})
    }
    if(!completed) {
        return res.status(400).json({error: 'completed is required'})
    }

    let newTodo = {
        id: nextId++,
        title,
        completed
    }

    todos.push(newTodo)
    res.status(201).json(newTodo)
    
})

app.get('/todo/:id', (req, res) => {
    const id = Number(req.params.id)

    const todo = todos.find(u => u.id === id)

    if(!todo) {
        return res.status(404).json({error: 'todo not found'})
    }

    res.json(todo)
})

app.delete('/todo/:id', (req, res) => {
    const id = Number(req.params.id)

    const todoIndex = todos.findIndex( n => n.id === id )

    if(todoIndex === -1) {
        return res.status(404).json({error: 'todo not found'})
    }
    todos.splice(todoIndex, 1)
    
    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})