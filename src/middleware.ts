import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Nenhum bloqueio de sign-up
  return NextResponse.next()
}

export const config = {
  matcher: []
} 