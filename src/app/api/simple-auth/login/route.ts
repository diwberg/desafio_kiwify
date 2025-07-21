import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@casafacil.com.br'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar credenciais
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Criar JWT token
      const token = await new SignJWT({ 
        email: ADMIN_EMAIL,
        role: 'admin',
        isAuthenticated: true 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(JWT_SECRET))

      // Definir cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          email: ADMIN_EMAIL,
          role: 'admin'
        }
      })

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })

      return response
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email ou senha incorretos'
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
} 