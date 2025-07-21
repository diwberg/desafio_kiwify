import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Aplicar CORS permissivo para todas as rotas da API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const method = request.method
    
    // Headers CORS permissivos - permitir qualquer origem
    const response = NextResponse.next()
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    // Responder a preflight requests (OPTIONS)
    if (method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      })
    }
    
    return response
  }
  
  // Para outras rotas, continuar normalmente
  return NextResponse.next()
}

// Configurar em quais rotas aplicar o middleware
export const config = {
  matcher: [
    '/api/:path*',
  ],
} 