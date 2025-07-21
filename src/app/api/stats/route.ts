import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cpf = searchParams.get('cpf')

    if (cpf) {
      // Estatísticas de um usuário específico
      const userStats = await DatabaseService.getUserStats(cpf.replace(/\D/g, ''))
      
      if (!userStats) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado',
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: userStats,
      })
    } else {
      // Estatísticas gerais do sistema
      const generalStats = await DatabaseService.getGeneralStats()
      
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