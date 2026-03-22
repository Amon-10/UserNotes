const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET


const getUsers = async (req, res) => {
    try {
        const getUsers = await pool.query(
            `SELECT id, username, created_at FROM users`
        )
        return res.json(getUsers.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error'})
    }
}

// REGISTER
const register = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (username, password)
             VALUES ($1, $2)
             RETURNING id, username`,
            [username, hashedPassword]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username already exists' })
        }
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
}

// LOGIN
const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        )

        if (result.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const user = result.rows[0]

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({ token })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
}

module.exports = {
    getUsers,
    register,
    login
}