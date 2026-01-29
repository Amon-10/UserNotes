const express = require('express')

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running')
})

const notes = []
let nextId = 1

// GET all notes with status 200
app.get('/notes', (req, res) => {
    res.json(notes)
})

// Add valid notes to array and return note with status 201
app.post('/notes', (req, res) => {
    const { title, content } = req.body

    if(!title) {
        return res.status(404).json({error: 'title is required'})
    }
    if (!content) {
        return res.status(404).json({error: 'content is required'})
    }

    const newNote = {
        id: nextId++,
        title,
        content
    }
    notes.push(newNote)

    res.status(201).json(newNote)

})

// GET note by id
// return status 404 if not found
// return note if found with status 201
app.get('/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    let note = notes.find(u => u.id === id)

    if(!note) {
        return res.status(404).json({error: 'Note not found'})
    }

    res.json(note)

})

// DELETE by index if exists
// return status 204 upon success
// return status 404 if failure
app.delete('/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    const noteIndex = notes.findIndex(u => u.id === id)

    if(noteIndex === -1) {
        return res.status(404).json({error: 'Note not found'})
    }
    notes.splice(noteIndex, 1)

    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})