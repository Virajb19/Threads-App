import jwt from 'jsonwebtoken'

export function verifyToken(req,res,next) {
    try {
        // console.log(req.cookies.jwt)
        const token = req.cookies.jwt || req.headers.authorization.split(' ')[1] // Authorization Header
        if(!token) return res.status(400).json({success: false, error: 'Unauthorized - no token provided'})
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return res.status(403).json({success: false, error: 'You are not logged in - invalid token'})

        req.userId = decoded.user.id
        next()
    } catch(e) {
        console.error(e)
        return res.status(500).json({success: false, error: 'Error while authorizing'})
    }
}