import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        message: 'Token não encontrado'
      }, { status: 401 })
    }

    // Verificar e decodificar JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        email: payload.email,
        role: payload.role
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      authenticated: false,
      message: 'Token inválido'
    }, { status: 401 })
  }
} 