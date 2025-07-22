const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (existingAdmin) {
      console.log('Admin já existe:', existingAdmin.email)
      return
    }

    // Criar admin
    const hashedPassword = await bcrypt.hash('admin123321', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@casafacil.com.br',
        name: 'Administrador',
        role: 'admin',
        emailVerified: true
      }
    })

    // Criar conta com senha
    await prisma.account.create({
      data: {
        userId: admin.id,
        providerId: 'email',
        accountId: admin.email,
        password: hashedPassword
      }
    })

    console.log('Admin criado com sucesso!')
    console.log('Email: admin@casafacil.com.br')
    console.log('Senha: admin123321')
    
  } catch (error) {
    console.error('Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 