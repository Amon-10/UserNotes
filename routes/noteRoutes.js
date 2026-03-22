const express = require('express')
const router = express.Router()

const requireAuth = require('../middleware/authMiddleware')
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController')

// Get note
router.get('/', requireAuth, getNotes)

// Add note
router.post('/', requireAuth, createNote)

// Update note
router.put('/:id', requireAuth, updateNote)

// Delete note
router.delete('/:id', requireAuth, deleteNote)

module.exports = router