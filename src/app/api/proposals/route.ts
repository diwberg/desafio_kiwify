import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para a proposta
const proposalSchema = z.object({
  proposal: z.object({
    number: z.string(),
    propertyValue: z.number(),
    downPayment: z.number(),
    financedAmount: z.number(),
    term: z.number(),
    monthlyPayment: z.number(),
    totalAmount: z.number(),
    totalInterest: z.number(),
    downPaymentPercentage: z.string(),
  }),
  user: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    cpf: z.string().min(11),
    address: z.string().min(10),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().min(8),
  }),
  signature: z.string().min(1),
  signedAt: z.string().datetime(),
})

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados recebidos
    const validatedData = proposalSchema.parse(body)
    
    // Preparar dados para o banco
    const proposalData = {
      user: {
        cpf: validatedData.user.cpf.replace(/\D/g, ''), // Remover formatação do CPF
        name: validatedData.user.name,
        email: validatedData.user.email,
        phone: validatedData.user.phone,
        address: validatedData.user.address,
        city: validatedData.user.city,
        state: validatedData.user.state,
        zipCode: validatedData.user.zipCode.replace(/\D/g, ''), // Remover formatação do CEP
      },
      proposal: {
        number: validatedData.proposal.number,
        propertyValue: validatedData.proposal.propertyValue,
        downPayment: validatedData.proposal.downPayment,
        financedAmount: validatedData.proposal.financedAmount,
        term: validatedData.proposal.term,
        monthlyPayment: validatedData.proposal.monthlyPayment,
        totalAmount: validatedData.proposal.totalAmount,
        totalInterest: validatedData.proposal.totalInterest,
        downPaymentPercentage: validatedData.proposal.downPaymentPercentage,
        signature: validatedData.signature,
        signedAt: new Date(validatedData.signedAt),
      },
    }

    // Salvar no banco de dados
    // const savedProposal = await DatabaseService.createProposalWithUser(proposalData)
    // Nova lógica Prisma:
    // 1. Verifica se o usuário existe pelo CPF, senão cria
    let user = await prisma.user.findUnique({ where: { cpf: proposalData.user.cpf } })
    if (!user) {
      user = await prisma.user.create({ data: { ...proposalData.user, password: 'dummy' } })
    }
    // 2. Cria a proposta vinculada ao usuário
    const savedProposal = await prisma.proposal.create({
      data: {
        ...proposalData.proposal,
        userId: user.id,
      },
      include: { user: true },
    })

    // Log para auditoria
    console.log(`Proposta ${savedProposal.number} criada para usuário ${savedProposal.user.cpf}`)

    return NextResponse.json({
      success: true,
      data: {
        id: savedProposal.id,
        number: savedProposal.number,
        userId: savedProposal.user.id,
        userCpf: savedProposal.user.cpf,
        createdAt: savedProposal.createdAt,
      },
      message: 'Proposta salva com sucesso',
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao processar proposta:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Dados inválidos',
        details: error.issues,
      }, { status: 400 })
    }

    if (error instanceof Error) {
      // Verificar se é erro de duplicação
      if (error.message.includes('unique constraint')) {
        return NextResponse.json({
          success: false,
          error: 'Proposta com este número já existe',
        }, { status: 409 })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 })
  }
}

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cpf = searchParams.get('cpf')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (cpf) {
      // Buscar propostas de um usuário específico
      // const proposals = await DatabaseService.listProposalsByUser(cpf)
      const user = await prisma.user.findUnique({ where: { cpf: cpf.replace(/\D/g, '') }, include: { proposals: true } })
      const proposals = user?.proposals || []
      return NextResponse.json({
        success: true,
        data: proposals,
        total: proposals.length,
      })
    } else {
      // Listar todas as propostas com paginação
      const skip = (page - 1) * limit
      // const proposals = await DatabaseService.listProposals({}, { createdAt: 'desc' })
      const proposals = await prisma.proposal.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true },
        skip,
        take: limit,
      })
      // const paginatedProposals = proposals.slice(skip, skip + limit)
      return NextResponse.json({
        success: true,
        data: proposals,
        pagination: {
          page,
          limit,
          total: await prisma.proposal.count(),
          totalPages: Math.ceil((await prisma.proposal.count()) / limit),
        },
      })
    }
  } catch (error) {
    console.error('Erro ao buscar propostas:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 })
  }
}

// Exportar rotas sem proteção CORS
export const POST = handlePOST
export const GET = handleGET 