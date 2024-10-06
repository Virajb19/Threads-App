import jwt from 'jsonwebtoken'

export function verifyToken(req,res,next) {
    try {
        const token = req.cookies.jwt || req.headers.authorization.split(' ')[1]
        if(!token) return res.status(400).json({success: false, error: 'Unauthorized - no token provided'})
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return res.status(403).json({success: false, error: 'You are not logged in - invalid token'})

        req.userId = decoded.userId
        next()
    } catch(e) {
        console.error(e)
        return res.status(500).json({success: false, error: 'Error while authorizing'})
    }
}