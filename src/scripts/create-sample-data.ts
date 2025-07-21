/**
 * Script para criar dados de exemplo para desenvolvimento e demonstração
 * Execute: npx tsx src/scripts/create-sample-data.ts
 */

import { DatabaseService } from '@/services/database'

const sampleProposals = [
  {
    user: {
      cpf: '123.456.789-01',
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '(11) 99999-1111',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    proposal: {
      number: 'PROP-001',
      propertyValue: 450000,
      downPayment: 90000,
      financedAmount: 360000,
      term: 240,
      monthlyPayment: 2850.50,
      totalAmount: 684120,
      totalInterest: 324120,
      downPaymentPercentage: '20%',
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      signedAt: new Date()
    }
  },
  {
    user: {
      cpf: '987.654.321-09',
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
      phone: '(11) 88888-2222',
      address: 'Av. Central, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000'
    },
    proposal: {
      number: 'PROP-002',
      propertyValue: 320000,
      downPayment: 64000,
      financedAmount: 256000,
      term: 180,
      monthlyPayment: 2100.75,
      totalAmount: 378135,
      totalInterest: 122135,
      downPaymentPercentage: '20%',
      signature: '',
      signedAt: new Date()
    }
  }
]

async function createSampleData() {
  console.log('🌱 Criando dados de exemplo...\n')

  try {
    for (const data of sampleProposals) {
      try {
        const result = await DatabaseService.createProposalWithUser(data)
        console.log(`✅ ${data.proposal.number}: ${data.user.name}`)
      } catch (error) {
        console.log(`⚠️  ${data.proposal.number}: Já existe`)
      }
    }

    const stats = await DatabaseService.getGeneralStats()
    console.log(`\n📊 Total: ${stats.totalProposals} propostas`)
    console.log('✨ Dados prontos para uso!')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createSampleData().then(() => process.exit(0))
}

export { createSampleData } 