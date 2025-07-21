import { DatabaseService } from '@/services/database'

// Exemplo de uso do banco de dados
export async function testDatabaseOperations() {
  try {
    console.log('🔗 Testando operações do banco de dados...\n')

    // 1. Criar uma proposta com usuário
    const proposalData = {
      user: {
        cpf: '12345678901',
        name: 'João da Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123, Apto 45',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234567',
      },
      proposal: {
        number: 'CF-20240121-0001',
        propertyValue: 350000,
        downPayment: 70000,
        financedAmount: 280000,
        term: 30,
        monthlyPayment: 2800,
        totalAmount: 1078000,
        totalInterest: 798000,
        downPaymentPercentage: '20.0',
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        signedAt: new Date(),
      },
    }

    console.log('📝 Criando proposta com usuário...')
    const savedProposal = await DatabaseService.createProposalWithUser(proposalData)
    console.log(`✅ Proposta criada: ${savedProposal.number}`)
    console.log(`👤 Usuário: ${savedProposal.user.name} (${savedProposal.user.cpf})`)

    // 2. Buscar usuário por CPF
    console.log('\n🔍 Buscando usuário por CPF...')
    const userFound = await DatabaseService.findUserByCpf('12345678901')
    if (userFound) {
      console.log(`✅ Usuário encontrado: ${userFound.name}`)
      console.log(`📊 Total de propostas: ${userFound.proposals.length}`)
    }

    // 3. Listar todas as propostas
    console.log('\n📋 Listando todas as propostas...')
    const allProposals = await DatabaseService.listProposals()
    console.log(`✅ Total de propostas no sistema: ${allProposals.length}`)

    // 4. Buscar estatísticas do usuário
    console.log('\n📈 Buscando estatísticas do usuário...')
    const userStats = await DatabaseService.getUserStats('12345678901')
    if (userStats) {
      console.log(`✅ Estatísticas do usuário ${userStats.user.name}:`)
      console.log(`   💰 Total financiado: R$ ${userStats.stats.totalFinanced.toLocaleString('pt-BR')}`)
      console.log(`   🏠 Valor total dos imóveis: R$ ${userStats.stats.totalProperty.toLocaleString('pt-BR')}`)
      console.log(`   📊 Parcela média: R$ ${userStats.stats.averageMonthlyPayment.toLocaleString('pt-BR')}`)
    }

    // 5. Estatísticas gerais
    console.log('\n🌍 Buscando estatísticas gerais...')
    const generalStats = await DatabaseService.getGeneralStats()
    console.log('✅ Estatísticas gerais do sistema:')
    console.log(`   👥 Total de usuários: ${generalStats.totalUsers}`)
    console.log(`   📄 Total de propostas: ${generalStats.totalProposals}`)
    console.log(`   💵 Valor total financiado: R$ ${generalStats.totalFinancedAmount.toLocaleString('pt-BR')}`)
    console.log(`   🏘️ Valor médio dos imóveis: R$ ${generalStats.averagePropertyValue.toLocaleString('pt-BR')}`)

    console.log('\n✅ Todos os testes concluídos com sucesso!')
    return true

  } catch (error) {
    console.error('❌ Erro durante os testes:', error)
    return false
  }
}

// Exemplo de como usar na API
export const exampleApiUsage = `
// Em uma API route (src/app/api/example/route.ts):

import { DatabaseService } from '@/services/database'

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    // Criar proposta com usuário
    const proposal = await DatabaseService.createProposalWithUser({
      user: {
        cpf: data.user.cpf,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city,
        state: data.user.state,
        zipCode: data.user.zipCode,
      },
      proposal: {
        number: data.proposal.number,
        propertyValue: data.proposal.propertyValue,
        downPayment: data.proposal.downPayment,
        financedAmount: data.proposal.financedAmount,
        term: data.proposal.term,
        monthlyPayment: data.proposal.monthlyPayment,
        totalAmount: data.proposal.totalAmount,
        totalInterest: data.proposal.totalInterest,
        downPaymentPercentage: data.proposal.downPaymentPercentage,
        signature: data.signature,
        signedAt: new Date(data.signedAt),
      },
    })
    
    return Response.json({ success: true, data: proposal })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
` 