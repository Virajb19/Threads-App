import jwt from 'jsonwebtoken'

export function generateToken(user, res) { 
    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '15d'})
    res.cookie("jwt", token, {httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000, sameSite: 'strict'})
    return token
}