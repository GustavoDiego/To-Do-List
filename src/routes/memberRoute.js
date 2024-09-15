import { Router } from 'express'
import { register, login, updateMember, deleteMember, getMember } from '../controllers/memberController.js'
import auth from '../middlewares/authMiddleware.js'
const router = Router()

router.get('/member', auth, getMember)
router.post('/register', register)
router.post('/login', login)
router.put('/member', auth, updateMember)
router.delete('/member', auth, deleteMember)

export default router
