import { NextRequest, NextResponse } from 'next/server'
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
  // TODO: Implementar autenticação e lógica de troca de senha com NextAuth
  return NextResponse.json({ error: 'NOT_IMPLEMENTED', message: 'Endpoint não implementado. Migrar para NextAuth.' }, { status: 501 })
} 