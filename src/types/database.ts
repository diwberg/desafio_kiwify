import { Prisma } from '@prisma/client'

// Tipos para criação de usuário
export type CreateUserData = Prisma.UserCreateInput

// Tipos para criação de proposta
export type CreateProposalData = Prisma.ProposalCreateInput

// Tipos para criação de proposta com usuário
export type CreateProposalWithUserData = {
  user: {
    cpf: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  proposal: {
    number: string
    propertyValue: number
    downPayment: number
    financedAmount: number
    term: number
    monthlyPayment: number
    totalAmount: number
    totalInterest: number
    downPaymentPercentage: string
    signature: string
    signedAt: Date
  }
}

// Tipos para resposta completa com relacionamentos
export type UserWithProposals = Prisma.UserGetPayload<{
  include: { proposals: true }
}>

export type ProposalWithUser = Prisma.ProposalGetPayload<{
  include: { user: true }
}>

// Tipos para filtros
export type UserFilter = Prisma.UserWhereInput
export type ProposalFilter = Prisma.ProposalWhereInput

// Tipos para ordenação
export type UserOrderBy = Prisma.UserOrderByWithRelationInput
export type ProposalOrderBy = Prisma.ProposalOrderByWithRelationInput 