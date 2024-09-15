import { Router } from 'express'
import {
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    listUserTasks,
    listTasks,
    getTask

} from '../controllers/TaskController.js'
import auth from '../middlewares/authMiddleware.js'
const router = Router()


router.post('/tasks', auth, createTask)


router.put('/tasks/:taskId/status', auth, updateTaskStatus)
router.put('/tasks/:taskId', auth, updateTask)


router.delete('/tasks/:taskId', auth, deleteTask)


router.get('/tasks/user', auth, listUserTasks)

router.get('/tasks', auth, listTasks)
router.get('/tasks/:taskId', auth, getTask)

export default router