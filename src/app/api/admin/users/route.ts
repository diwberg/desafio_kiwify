import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // TODO: Implementar autenticação e lógica de listagem de usuários com NextAuth
  return NextResponse.json({ error: 'NOT_IMPLEMENTED', message: 'Endpoint não implementado. Migrar para NextAuth.' }, { status: 501 })
}