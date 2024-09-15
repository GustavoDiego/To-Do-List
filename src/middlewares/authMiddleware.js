import pkg from 'jsonwebtoken'
const { verify } = pkg

export default (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.status(401).json({ message: 'Acesso negado' })

  try {
    
    const decoded = verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
    req.memberId = decoded.id
    next()
  } catch (err) {
    res.status(403).json({ message: 'Token inválido', token })
  }
}
