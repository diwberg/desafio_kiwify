import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bloquear apenas rotas específicas de sign-up
  if (pathname === '/api/auth/sign-up/email' || pathname.startsWith('/api/auth/sign-up/')) {
    return NextResponse.json(
      { 
        error: 'SIGN_UP_DISABLED',
        message: 'Cadastro de novas contas está desabilitado. Apenas administradores podem acessar o sistema.' 
      },
      { status: 403 }
    )
  }

  // Bloquear rotas de sign-up alternativas
  if (pathname.startsWith('/api/auth/register')) {
    return NextResponse.json(
      { 
        error: 'SIGN_UP_DISABLED',
        message: 'Cadastro de novas contas está desabilitado. Apenas administradores podem acessar o sistema.' 
      },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth/sign-up/:path*',
    '/api/auth/register/:path*'
  ]
} 