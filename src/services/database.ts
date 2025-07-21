import { prisma } from '@/lib/prisma'
import { 
  CreateProposalWithUserData,
  UserWithProposals,
  ProposalWithUser,
  UserFilter,
  ProposalFilter,
  UserOrderBy,
  ProposalOrderBy
} from '@/types/database'

export class DatabaseService {
  // Operações de Usuário
  static async createUser(data: {
    cpf: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }) {
    return await prisma.user.create({
      data,
    })
  }

  static async findUserByCpf(cpf: string): Promise<UserWithProposals | null> {
    return await prisma.user.findUnique({
      where: { cpf },
      include: { proposals: true },
    })
  }

  static async findUserById(id: string): Promise<UserWithProposals | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { proposals: true },
    })
  }

  static async updateUser(cpf: string, data: Partial<{
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }>) {
    return await prisma.user.update({
      where: { cpf },
      data,
    })
  }

  static async listUsers(filter?: UserFilter, orderBy?: UserOrderBy) {
    return await prisma.user.findMany({
      where: filter,
      orderBy,
      include: { proposals: true },
    })
  }

  // Operações de Proposta
  static async createProposal(data: {
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
    userId: string
  }) {
    return await prisma.proposal.create({
      data,
      include: { user: true },
    })
  }

  static async createProposalWithUser(data: CreateProposalWithUserData) {
    return await prisma.$transaction(async (tx) => {
      // Verificar se usuário já existe pelo CPF
      let user = await tx.user.findUnique({
        where: { cpf: data.user.cpf },
      })

      // Se não existe, criar novo usuário
      if (!user) {
        user = await tx.user.create({
          data: data.user,
        })
      } else {
        // Se existe, atualizar dados do usuário
        user = await tx.user.update({
          where: { cpf: data.user.cpf },
          data: data.user,
        })
      }

      // Criar a proposta
      const proposal = await tx.proposal.create({
        data: {
          ...data.proposal,
          userId: user.id,
        },
        include: { user: true },
      })

      return proposal
    })
  }

  static async findProposalByNumber(number: string): Promise<ProposalWithUser | null> {
    return await prisma.proposal.findUnique({
      where: { number },
      include: { user: true },
    })
  }

  static async findProposalById(id: string): Promise<ProposalWithUser | null> {
    return await prisma.proposal.findUnique({
      where: { id },
      include: { user: true },
    })
  }

  static async listProposals(filter?: ProposalFilter, orderBy?: ProposalOrderBy) {
    return await prisma.proposal.findMany({
      where: filter,
      orderBy: orderBy || { createdAt: 'desc' },
      include: { user: true },
    })
  }

  static async listProposalsByUser(cpf: string) {
    return await prisma.proposal.findMany({
      where: {
        user: { cpf },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })
  }

  // Operações de análise e relatórios
  static async getUserStats(cpf: string) {
    const user = await prisma.user.findUnique({
      where: { cpf },
      include: {
        proposals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return null
    }

    const totalProposals = user.proposals.length
    const totalFinanced = user.proposals.reduce((sum, p) => sum + p.financedAmount, 0)
    const totalProperty = user.proposals.reduce((sum, p) => sum + p.propertyValue, 0)
    const averageMonthlyPayment = totalProposals > 0 
      ? user.proposals.reduce((sum, p) => sum + p.monthlyPayment, 0) / totalProposals 
      : 0

    return {
      user,
      stats: {
        totalProposals,
        totalFinanced,
        totalProperty,
        averageMonthlyPayment,
        latestProposal: user.proposals[0] || null,
      },
    }
  }

  static async getGeneralStats() {
    const totalUsers = await prisma.user.count()
    const totalProposals = await prisma.proposal.count()
    
    const proposalStats = await prisma.proposal.aggregate({
      _sum: {
        propertyValue: true,
        financedAmount: true,
        totalAmount: true,
      },
      _avg: {
        monthlyPayment: true,
        propertyValue: true,
      },
    })

    return {
      totalUsers,
      totalProposals,
      totalPropertyValue: proposalStats._sum.propertyValue || 0,
      totalFinancedAmount: proposalStats._sum.financedAmount || 0,
      totalAmountToPay: proposalStats._sum.totalAmount || 0,
      averageMonthlyPayment: proposalStats._avg.monthlyPayment || 0,
      averagePropertyValue: proposalStats._avg.propertyValue || 0,
    }
  }

  // Operações de limpeza e manutenção
  static async deleteUser(cpf: string) {
    return await prisma.user.delete({
      where: { cpf },
    })
  }

  static async deleteProposal(id: string) {
    return await prisma.proposal.delete({
      where: { id },
    })
  }
} 