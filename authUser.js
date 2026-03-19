// const jwt = require('jsonwebtoken')
// const jwt_secret = 'super_secret_key'

const express = require('express')
const app = express()
const PORT = 3000
//connect to db
const pool = require('./db')

app.use(express.json())

// delete
/* const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' })
    }

    const token = authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({error: 'token is null'})
    }
    
    try {
        const payload = jwt.verify(token, jwt_secret)
        req.userId = payload.userId
        next()
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
} */

// original require auth without jwt
const requireAuth = (req, res, next) => {
    if (!currentUser) {
        return res.status(401).json({error: 'Authentication required'})
    }
    next()
}

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
// utilised in GET, PUT and DELETE by id
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

const users = []
let currentUser = null
let userId = 1

app.get('/', (req, res) => {
    res.send('server is running')
})

// get all users
app.get('/users', (req, res) => {
    res.json(users)
})

// Register new users
app.post('/register', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'})
    }

    // check if user exists
    const userExist = users.find(u => u.username === username)
    if (userExist) {
        return res.status(409).json({error: 'User already exists'})
    }

    const newUser = {
        id : userId++,
        username,
        password
    }
    users.push(newUser)

    res.status(201).json({message: 'User registered successfully'})
})

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'})
    }

    // check if another user is logged in
    /* if(currentUser != null) {
        return res.status(400).json({error:'Logout current user'})
    } */

    // verify user
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
        currentUser = user
        return res.status(200).json({mesage: 'Logged in successfully'})
    }
    else {
        return res.status(400).json({error: 'Incorrect password or username'})
    }
   // delete this code after testing

    /* const token = jwt.sign(
        { userId: user.id },
        jwt_secret,
        {expiresIn: '1h'}
    )

    res.json({ token }) */
    //delete
})

// Logout
app.post('/logout', (req, res) => {
    currentUser = null

    res.json({message: 'Logged out successfully'})
})

// GET notes belonging to current user
app.get('/notes', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
        'SELECT * FROM notes WHERE user_id = $1',
        [currentUser.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Add valid notes to table
app.post('/notes', requireAuth, requireJsonBody, validateNote, async (req, res) => {
    const { title, content } = req.body
    try{
        const addNote = await pool.query(
            `INSERT INTO notes (user_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [currentUser.id, title, content]
        )

        res.status(201).json(addNote.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error when adding'})
    }
})


// Edit existing notes
// User must be logged in
// Only allow editing of notes by creator of note
// Note must exist
// update title and content only
app.put('/notes/:id', requireAuth, validateId, validateNote, async (req, res) => {
    const { title, content } = req.body
    try {
        const updateNote = await pool.query(
            `UPDATE notes 
            SET title = $1, content = $2
            WHERE id = $3 AND user_id = $4
            RETURNING *`,
            [title, content, req.id, currentUser.id]
        )
        if (updateNote.rowCount === 0) {
            return res.status(404).json({error: 'Note not found or unauthorized'})
        }

        res.status(200).json(updateNote.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error'})
    }
})

// DELETE note by id
// return status 204 upon success
// return status 404 if failure
app.delete('/notes/:id', requireAuth, validateId, async (req, res) => {
    try { 
        const deleteNote = await pool.query(
            `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
            [req.id, currentUser.id]
        )
        if (deleteNote.rowCount === 0) {
            return res.status(404).json({error: 'Note not found or unauthorized'})
        }

        return res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error'})
    }
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

