const express = require('express')
const router = express.Router()

const { register, login, getUsers } = require('../controllers/authController')

router.get('/users', getUsers)
router.post('/register', register)
router.post('/login', login)

module.exports = router