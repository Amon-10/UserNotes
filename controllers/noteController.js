const pool = require('../db')

const getNotes = async (req, res) => {
    try {
    const result = await pool.query(
        'SELECT * FROM notes WHERE user_id = $1',
        [req.userId]
    )

    const notes = result.rows

    res.json(notes)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
}

const createNote = async (req, res) => {
    const { title, content } = req.body

    try{
        const addNote = await pool.query(
            `INSERT INTO notes (user_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [req.userId, title, content]
        )

        res.status(201).json(addNote.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error when adding'})
    }
}

const updateNote = async (req, res) => {
    const { title, content } = req.body
    const id = Number(req.params.id)

    try {
        const updateNote = await pool.query(
            `UPDATE notes 
            SET title = $1, content = $2
            WHERE id = $3 AND user_id = $4
            RETURNING *`,
            [title, content, id, req.userId]
        )
        if (updateNote.rowCount === 0) {
            return res.status(404).json({error: 'Note not found or unauthorized'})
        }

        res.status(200).json(updateNote.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error'})
    }
}

const deleteNote = async (req, res) => {
    const id = Number(req.params.id)

    try { 
        const deleteNote = await pool.query(
            `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
            [id, req.userId]
        )
        if (deleteNote.rowCount === 0) {
            return res.status(404).json({error: 'Note not found or unauthorized'})
        }

        return res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Database error'})
    }
}

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
}