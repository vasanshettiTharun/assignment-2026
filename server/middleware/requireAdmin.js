import jwt from 'jsonwebtoken'

export default function requireAdmin(req, res, next) {
  try {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Please log in' })
  }
}
