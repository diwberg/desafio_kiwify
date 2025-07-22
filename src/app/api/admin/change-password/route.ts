import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Schema de validação
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
})

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Apenas administradores podem alterar senhas' },
        { status: 403 }
      )
    }

    // Validar dados recebidos
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Verificar se as senhas coincidem
    if (validatedData.newPassword !== validatedData.confirmPassword) {
      return NextResponse.json(
        { error: 'PASSWORD_MISMATCH', message: 'As senhas não coincidem' },
        { status: 400 }
      )
    }

    // Buscar conta do usuário
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: 'email'
      }
    })

    if (!account) {
      return NextResponse.json(
        { error: 'ACCOUNT_NOT_FOUND', message: 'Conta não encontrada' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      account.password || ''
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'INVALID_CURRENT_PASSWORD', message: 'Senha atual incorreta' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Atualizar senha
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    // Log para auditoria
    console.log(`Senha alterada para usuário admin: ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 