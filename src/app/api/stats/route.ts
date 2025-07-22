import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cpf = searchParams.get('cpf')

    if (cpf) {
      // Estatísticas de um usuário específico
      const user = await prisma.user.findUnique({
        where: { cpf: cpf.replace(/\D/g, '') },
        include: { proposals: true },
      })
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado',
        }, { status: 404 })
      }
      // Exemplo de estatísticas básicas
      const userStats = {
        totalProposals: user.proposals.length,
        totalPropertyValue: user.proposals.reduce((sum, p) => sum + p.propertyValue, 0),
        totalFinancedAmount: user.proposals.reduce((sum, p) => sum + p.financedAmount, 0),
      }
      return NextResponse.json({
        success: true,
        data: userStats,
      })
    } else {
      // Estatísticas gerais do sistema
      const totalUsers = await prisma.user.count()
      const totalProposals = await prisma.proposal.count()
      const proposals = await prisma.proposal.findMany()
      const totalPropertyValue = proposals.reduce((sum, p) => sum + p.propertyValue, 0)
      const totalFinancedAmount = proposals.reduce((sum, p) => sum + p.financedAmount, 0)
      const totalAmountToPay = proposals.reduce((sum, p) => sum + p.totalAmount, 0)
      const averageMonthlyPayment = proposals.length > 0 ? proposals.reduce((sum, p) => sum + p.monthlyPayment, 0) / proposals.length : 0
      const averagePropertyValue = proposals.length > 0 ? totalPropertyValue / proposals.length : 0
      const generalStats = {
        totalUsers,
        totalProposals,
        totalPropertyValue,
        totalFinancedAmount,
        totalAmountToPay,
        averageMonthlyPayment,
        averagePropertyValue,
      }
      return NextResponse.json({
        success: true,
        data: generalStats,
      })
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 })
  }
}

// Exportar rota sem proteção CORS
export const GET = handleGET 