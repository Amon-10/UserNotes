// Contacts API
// {id, name, phone, email}
// duplicate email check
// GET by id
// DELETE by id

const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

// valid contact check
const validateContact = (req, res, next) => {
    const { name, email, phone } = req.body

    if (!name) {
        return res.status(400).json({error: 'name is required'})
    }
    if (!email) {
        return res.status(400).json({error: 'email is required'})
    }
    if (!phone) {
        return res.status(400).json({error: 'phone is required'})
    }

    next()
}

// Validate id check
const validateId = (req, res, next) => {
    const contactId = Number(req.params.id)
    
    if (isNaN(contactId)) {
        res.status(400).json({error: 'Invalid ID'})
    }

    req.id = contactId
    next()
}

// check for dupes
const checkDupes = (req, res, next) => {
    const { email, phone } = req.body

    const dupeEmail = contacts.find(u => u.email === email)
    const dupePhone = contacts.find(l => l.phone === phone)

    if (dupeEmail) {
        return res.status(401).json({error: 'Email already exists'})
    }
    if (dupePhone) {
        return res.status(401).json({error: 'phone already exists'})
    }
    
    next()
}

const contacts = []
let nextId = 1

app.get('/', (req, res) => {
    res.send('server is running')
})

// get all contacts
app.get('/contacts', (req, res) => {
    res.json(contacts)
})

// POST contacts
app.post('/contacts', validateContact, checkDupes, (req, res) => {
    const { name, phone, email } = req.body

    const newContact = {
        id: nextId++,
        name,
        phone,
        email
    }
    contacts.push(newContact)
    
    res.status(201).json(newContact)
})

// GET by id
app.get('/contacts/:id', validateId, (req, res) => {
    const contact = contacts.find(n => n.id === req.id)

    if (!contact) {
        return res.status(404).json({error: 'contact not found'})
    }

    res.status(200).json(contact)
})

// DELETE by id
app.delete('/contacts/:id', validateId, (req, res) => {
    const contactIndex = contacts.findIndex(i => i.id === req.id)

    if (!contactIndex) {
        return res.status(404).json({error: 'contact not found'})
    }
    contacts.splice(contactIndex, 1)

    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})



