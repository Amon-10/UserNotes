// This program is the same as notesAPI except it has middleware

const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

// warm up logger
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`)

    next()
}

app.use(logger)

// validate note middleware
// used in POST
const validateNote = (req, res, next) => {
    const { title, content } = req.body

    if(!title) {
        return res.status(400).json({error: 'title is required'})
    }
    if(!content) {
        return res.status(400).json({error: 'content is required'})
    }

    next()
}

// validate id
// utilised in GET and DELETE by id
const validateId = (req, res, next) => {
    const id = Number(req.params.id)

    if(isNaN(id)) {
        return res.status(400).json({error: 'Invalid ID'})
    }

    req.id = id
    next()
}

const requireJsonBody = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({error: 'Body is empty'})
    }

    next()
}

// GET server running message
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
app.post('/notes', logger, requireJsonBody, validateNote, (req, res) => {
    const { title, content } = req.body

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
app.get('/notes/:id', validateId, (req, res) => {
    let note = notes.find(n => n.id === req.id)

    if(!note) {
        return res.status(404).json({error: 'Note not found'})
    }

    res.json(note)

})

// DELETE note by id
// return status 204 upon success
// return status 404 if failure
app.delete('/notes/:id', validateId, (req, res) => {
    const noteIndex = notes.findIndex(u => u.id === req.id)

    if(noteIndex === -1) {
        return res.status(404).json({error: 'Note not found'})
    }
    notes.splice(noteIndex, 1)

    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})