import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const adminEmail = 'admin@casafacil.com.br'
  const adminPassword = 'admin123'
  const adminName = 'Administrador'

  try {
    // Verificar se admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe:', adminEmail)
      return
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        role: 'admin',
        emailVerified: true,
        cpf: '00000000000', // CPF fictício para admin
        phone: '(11) 99999-9999',
        address: 'Endereço do Admin',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000000',
      }
    })

    // Criar conta com senha
    await prisma.account.create({
      data: {
        userId: admin.id,
        accountId: admin.email, // Usar email como accountId
        providerId: 'email-password', // Provider correto para Better Auth
        password: hashedPassword,
      }
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Senha:', adminPassword)
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  createAdmin()
}

export { createAdmin } 