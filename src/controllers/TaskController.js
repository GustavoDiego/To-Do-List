import prisma from '../models/prismaClient.js'
import { Prisma } from '@prisma/client'
const _task = prisma.task

export async function createTask(req, res) {
  const { memberId } = req
  const { name, description, priority } = req.body

  try {
    const task = await _task.create({
      data: { name, description, priority, memberId }
    });
    res.status(201).json({ message: 'Tarefa criada com sucesso!', task })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa', details: err })
  }
}

export async function updateTaskStatus(req, res) {
  const { taskId } = req.params
  const { finalizada } = req.body

  try {
    console.log(finalizada)
    console.log(taskId)
    
    const parsedTaskId = parseInt(taskId)
    if (isNaN(parsedTaskId)) {
      return res.status(400).json({ error: 'ID da tarefa inválido.' })
    }

    
    if (typeof finalizada !== 'boolean') {
      return res.status(400).json({ error: "'finalizada' deve ser um valor booleano (true ou false)." })
    }

   
    const existingTask = await _task.findUnique({
      where: { id: parsedTaskId }
    })

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' })
    }

   
    const task = await _task.update({
      where: { id: parsedTaskId },
      data: {
        finalizada,
        dataTermino: finalizada ? new Date() : null 
      }
    })

    res.status(200).json({ message: 'Status da tarefa atualizado com sucesso.', task })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      
      return res.status(400).json({ error: 'Erro de banco de dados.', details: err })
    }
    res.status(500).json({ error: 'Erro ao atualizar tarefa.', details: err })
  }
}




export async function listTasks(req, res) {
  try {
    const tasks = await _task.findMany()

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ message: 'Nenhuma tarefa registrada ainda' })
    }

    res.status(200).json(tasks)
  } catch (err) {
    console.error('Erro ao listar as tarefas:', err)
    
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: 'Erro conhecido ao acessar o banco de dados', details: err.message })
    }

    res.status(500).json({ error: 'Erro ao listar as tarefas', details: err.message || err })
  }
}



export async function listUserTasks(req, res) {
    const { memberId } = req
  
    try {
      const tasks = await _task.findMany({
        where: { memberId },
      })
  
      res.status(200).json(tasks)
    } catch (err) {
      
      res.status(500).json({ error: 'Erro ao listar as tarefas do usuário', details: err })
      
    }
  }
  
  export async function deleteTask(req, res) {
    const { taskId } = req.params
    const { memberId } = req
  
    try {
      const task = await prisma.task.findUnique({ where: { id: parseInt(taskId) } })
  
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' })
      }
  
      if (task.finalizada) {
        return res.status(400).json({ message: 'Tarefa finalizada não pode ser excluída' })
      }
  
      if (task.memberId !== memberId) {
        return res.status(403).json({ message: 'Você não tem permissão para excluir esta tarefa' });
      }
  
      await prisma.task.delete({
        where: { id: parseInt(taskId) },
      })
  
      res.status(200).json({ message: 'Tarefa excluída com sucesso!' })
    } catch (err) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'Tarefa já foi excluída ou não existe' })
      } else if (err.code === 'P2003') {
        res.status(400).json({ error: 'Erro de integridade referencial, a tarefa está vinculada a outro registro' })
      } else {
        res.status(500).json({ error: 'Erro ao excluir tarefa', details: err })
      }
    }
  }
  
  
  
  export async function updateTask(req, res) {
    const { taskId } = req.params
    const { name, description, priority } = req.body
    const { memberId } = req
  
    try {
      const task = await prisma.task.findUnique({ where: { id: parseInt(taskId) } })
  
      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' })
      }
  
      if (task.memberId !== memberId) {
        return res.status(403).json({ message: 'Você não tem permissão para editar esta tarefa' })
      }
  
      if (task.finalizada) {
        return res.status(400).json({ message: 'Tarefa finalizada não pode ser editada' })
      }
  
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskId) },
        data: {
          name: name || undefined,
          description: description || undefined,
          priority: priority || undefined,
        },
      })
  
      res.status(200).json({ message: 'Tarefa atualizada com sucesso!', updatedTask })
    } catch (err) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'Tarefa já foi excluída ou não existe' })
      } else if (err.code === 'P2002') {
        res.status(400).json({ error: 'Erro de integridade única, possível conflito com dados existentes' })
      } else if (err.code === 'P2003') {
        res.status(400).json({ error: 'Erro de integridade referencial, dados inconsistentes com registros relacionados' })
      } else if (err.code === 'P2026') {
        res.status(400).json({ error: 'Erro de validação de dados, verifique os dados fornecidos' })
      } else {
        res.status(500).json({ error: 'Erro ao atualizar tarefa', details: err })
      }
    }
  }
export async function getTask(req, res) {
  const { taskId } = req.params

  
  if (!taskId) {
      return res.status(400).json({ error: 'ID do membro não fornecido.' })
  }

  
  if (isNaN(Number(taskId))) {
      return res.status(400).json({ error: 'ID do membro inválido.' })
  }

  try {
      
      const task = await prisma.task.findUnique({
          where: { id: Number(taskId) }
      })

      
      if (!task) {
          return res.status(404).json({ error: 'Membro não encontrado.' })
      }

      res.status(200).json(task)

  } catch (err) {
      
      console.error('Erro ao buscar membro:', err)
      res.status(500).json({ error: 'Erro interno do servidor ao buscar membro.', details: err.message })
      console.log(err)
  }
}
