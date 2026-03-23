const validateNote = (req, res, next) => {
    const { title, content } = req.body

    if (!title || !content) {
        return res.status(400).json({error: 'Title and content are required'})
    }

    next()
}

const validateAuth = (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'})
    }

    next()
}

module.exports = {
    validateNote,
    validateAuth
}