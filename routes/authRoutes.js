const express = require('express')
const router = express.Router()

const { register, login, getUsers } = require('../controllers/authController')
const { validateAuth } = require('../middleware/validationMiddleware')

router.get('/users', getUsers)
router.post('/register', validateAuth, register)
router.post('/login', validateAuth, login)

module.exports = router