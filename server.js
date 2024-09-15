import dotenv from 'dotenv'
import express, { json } from 'express'
import memberRoutes from './src/routes/memberRoute.js'
import taskRoutes from './src/routes/taskRoute.js'
import prisma from './src/models/prismaClient.js'

import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
app.use(json())
app.use(express.static(path.join(__dirname, 'src/view/public')))
app.use(express.static(path.join(__dirname, 'src/view/private')))


app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/public/views/registro.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/public/views/login.html'))
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/private/views/home.html'))
})

app.get('/newtask', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/private/views/cadastrar_task.html'))
})
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/private/views/perfil.html'))
})
app.get('/editprofile', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/private/views/editar_perfil.html'))
})
app.get('/tasks', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/private/views/tasks.html'))
})
app.get('/edittask', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/view/private/views/editar_task.html'))
})


app.use('/api', memberRoutes)
app.use('/api', taskRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
