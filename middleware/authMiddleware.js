const jwt = require('jsonwebtoken')

const jwt_secret = process.env.JWT_SECRET

// require auth with jwt
const requireAuth = (req, res, next) => {
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
}

module.exports = requireAuth