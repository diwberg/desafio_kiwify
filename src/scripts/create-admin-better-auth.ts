/**
 * Script para criar usuário admin usando Better Auth
 * Execute: npx tsx src/scripts/create-admin-better-auth.ts
 */

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@casafacil.com.br'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = 'Admin CasaFácil'

async function createAdminUser() {
  console.log('🔐 Criando usuário admin com Better Auth...\n')

  try {
    // Verificar se admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin já existe!')
      console.log(`📧 Email: ${existingAdmin.email}`)
      console.log(`👤 Nome: ${existingAdmin.name}`)
      console.log(`🎭 Role: ${existingAdmin.role}`)
      return
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

    // Criar usuário admin
    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        emailVerified: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Criar conta de email/senha para o admin
    await prisma.account.create({
      data: {
        userId: adminUser.id,
        providerId: 'email',
        accountId: ADMIN_EMAIL,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ Admin criado com sucesso!')
    console.log(`📧 Email: ${ADMIN_EMAIL}`)
    console.log(`🔑 Senha: ${ADMIN_PASSWORD}`)
    console.log(`👤 Nome: ${ADMIN_NAME}`)
    console.log(`🎭 Role: admin`)
    console.log(`🆔 ID: ${adminUser.id}`)

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
    throw error
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('\n🎉 Script concluído com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Script falhou:', error)
      process.exit(1)
    })
}

export { createAdminUser } 