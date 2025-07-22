import { createAuthClient } from "better-auth/client"

// Detectar se está em produção ou desenvolvimento
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // No cliente, usar a URL atual
    return window.location.origin
  }
  
  // No servidor, usar a variável de ambiente ou fallback
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})