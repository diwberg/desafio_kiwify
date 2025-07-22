/**
 * Script para popular banco com dados de exemplo
 * Execute: npm run seed-data
 */

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function seedData() {
  console.log('🌱 Populando banco com dados de exemplo...\n')

  try {
    // Criar usuários de exemplo
    const users = [
      {
        email: 'joao.silva@example.com',
        name: 'João Silva',
        role: 'user' as const,
        cpf: '12345678901',
        phone: '(11) 99999-1111',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      {
        email: 'maria.santos@example.com',
        name: 'Maria Santos',
        role: 'user' as const,
        cpf: '98765432109',
        phone: '(11) 88888-2222',
        address: 'Av. Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      {
        email: 'pedro.oliveira@example.com',
        name: 'Pedro Oliveira',
        role: 'user' as const,
        cpf: '45678912345',
        phone: '(11) 77777-3333',
        address: 'Rua Augusta, 789',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01412-000'
      }
    ]

    console.log('👥 Criando usuários de exemplo...')

    for (const userData of users) {
      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`⚠️  Usuário já existe: ${userData.email}`)
        continue
      }

      // Hash da senha (senha padrão para todos)
      const hashedPassword = await bcrypt.hash('123456', 12)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          emailVerified: true,
          cpf: userData.cpf,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zipCode: userData.zipCode,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Criar conta
      await prisma.account.create({
        data: {
          userId: user.id,
          providerId: 'email',
          accountId: userData.email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      console.log(`✅ Usuário criado: ${userData.email}`)
    }

    // Criar propostas de exemplo
    console.log('\n📋 Criando propostas de exemplo...')

    const proposals = [
      {
        number: 'PROP-001',
        propertyValue: 450000,
        downPayment: 90000,
        financedAmount: 360000,
        term: 360,
        monthlyPayment: 2500,
        totalAmount: 900000,
        totalInterest: 540000,
        downPaymentPercentage: '20%',
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        signedAt: new Date(),
        userId: '' // Será preenchido com o ID do primeiro usuário
      },
      {
        number: 'PROP-002',
        propertyValue: 280000,
        downPayment: 56000,
        financedAmount: 224000,
        term: 240,
        monthlyPayment: 1800,
        totalAmount: 432000,
        totalInterest: 208000,
        downPaymentPercentage: '20%',
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        signedAt: new Date(),
        userId: '' // Será preenchido com o ID do segundo usuário
      },
      {
        number: 'PROP-003',
        propertyValue: 850000,
        downPayment: 170000,
        financedAmount: 680000,
        term: 360,
        monthlyPayment: 4700,
        totalAmount: 1692000,
        totalInterest: 1012000,
        downPaymentPercentage: '20%',
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        signedAt: new Date(),
        userId: '' // Será preenchido com o ID do terceiro usuário
      }
    ]

    // Pegar IDs dos usuários criados
    const createdUsers = await prisma.user.findMany({
      where: {
        email: {
          in: users.map(u => u.email)
        }
      }
    })

    for (let i = 0; i < proposals.length; i++) {
      const proposalData = proposals[i]
      const user = createdUsers[i]
      
      if (!user) {
        console.log(`⚠️  Usuário não encontrado para proposta ${proposalData.number}`)
        continue
      }

      const proposal = await prisma.proposal.create({
        data: {
          number: proposalData.number,
          propertyValue: proposalData.propertyValue,
          downPayment: proposalData.downPayment,
          financedAmount: proposalData.financedAmount,
          term: proposalData.term,
          monthlyPayment: proposalData.monthlyPayment,
          totalAmount: proposalData.totalAmount,
          totalInterest: proposalData.totalInterest,
          downPaymentPercentage: proposalData.downPaymentPercentage,
          signature: proposalData.signature,
          signedAt: proposalData.signedAt,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      console.log(`✅ Proposta criada: ${proposalData.number} para ${user.name}`)
    }

    console.log('\n🎉 Dados de exemplo criados com sucesso!')
    console.log('\n📋 Resumo:')
    console.log('- 3 usuários de exemplo criados')
    console.log('- 3 propostas de exemplo criadas')
    console.log('- Senha padrão para todos os usuários: 123456')

  } catch (error) {
    console.error('❌ Erro ao popular dados:', error)
    throw error
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('\n🎉 Script concluído com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Script falhou:', error)
      process.exit(1)
    })
}

export { seedData } 