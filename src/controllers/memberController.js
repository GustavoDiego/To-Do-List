import prisma from '../models/prismaClient.js'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

const { hash, compare } = bcrypt

import pkg from 'jsonwebtoken'
const { sign } = pkg
const _member = prisma.member

export async function register(req, res) {
  const { name, email, password } = req.body
  const hashedPassword = await hash(password, 10)

  try {
    const existingMember = await _member.findUnique({
      where: { email }
    })
    if (existingMember) {
      return res.status(400).json({ error: 'Já existe um membro com esse e-mail.' })
    }
    const member = await _member.create({
      data: { name, email, password: hashedPassword }
    })
    

    res.status(201).json({ message: 'Membro criado com sucesso!', member })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar membro', details: err })
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    const member = await _member.findUnique({ where: { email } })
    if (!member) return res.status(404).json({ message: 'Usuário não encontrado' })

    const isValid = await compare(password, member.password);
    if (!isValid) return res.status(401).json({ message: 'Senha inválida' })

    const token = sign({ id: member.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao realizar login', details: err })
  }
}




export async function updateMember(req, res)  {
  const { memberId } = req
  const { name, email, password } = req.body

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        name: name || undefined,
        email: email || undefined,
        password: hashedPassword || undefined,
      },
    })
    res.status(200).json({ message: 'Membro atualizado com sucesso!', updatedMember })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar membro', details: err })
  }
}


export async function deleteMember(req, res) {
  const { memberId } = req

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    })

    if (!member) {
      return res.status(404).json({ error: 'Membro não encontrado.' })
    }

    await prisma.task.deleteMany({
      where: { memberId: memberId }
    })

    await prisma.member.delete({
      where: { id: memberId },
    })

    res.status(200).json({ message: 'Membro e suas tarefas excluídos com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir membro', details: err })
  }
}


export async function getMember(req, res) {
  const { memberId } = req

  
  if (!memberId) {
      return res.status(400).json({ error: 'ID do membro não fornecido.' })
  }

  
  if (isNaN(Number(memberId))) {
      return res.status(400).json({ error: 'ID do membro inválido.' })
  }

  try {
      
      const member = await prisma.member.findUnique({
          where: { id: Number(memberId) }
      })

      
      if (!member) {
          return res.status(404).json({ error: 'Membro não encontrado.' })
      }

      res.status(200).json(member)

  } catch (err) {
      
      console.error('Erro ao buscar membro:', err)
      res.status(500).json({ error: 'Erro interno do servidor ao buscar membro.', details: err.message })
      console.log(err)
  }
}