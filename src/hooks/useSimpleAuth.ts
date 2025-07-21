"use client"

import { useState, useEffect, useCallback } from 'react'

interface User {
  email: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useSimpleAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  // Verificar autenticação ao carregar
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/simple-auth/verify')
      const data = await response.json()

      if (data.success && data.authenticated) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }, [])

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/simple-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        })
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão' }
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch('/api/simple-auth/logout', { method: 'POST' })
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }, [])

  // Verificar autenticação na inicialização
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    ...authState,
    login,
    logout,
    checkAuth
  }
} 