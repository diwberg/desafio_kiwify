import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Para simplificar durante desenvolvimento
    minPasswordLength: 6,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualizar sessão a cada 24 horas
    },
  
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  
  plugins: [
    admin({
      defaultRole: "user",
      adminRole: "admin",
    })
  ],
  
  advanced: {
    generateId: () => {
      // Usar CUID para compatibilidade com Prisma
      return Math.random().toString(36).substring(2) + Date.now().toString(36)
    },
  },
})

export type Session = typeof auth.$Infer.Session 