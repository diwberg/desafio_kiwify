"use client"

import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  plugins: [adminClient()],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

// Funções específicas do plugin admin
export const { admin } = authClient 