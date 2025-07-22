"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProposalsTable } from "@/components/proposals-table"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  LogOut,
  Home,
  Shield,
  Calendar,
  Mail,
  Phone,
  Lock
} from "lucide-react"
import Link from "next/link"

interface StatsData {
  totalUsers: number
  totalProposals: number
  totalPropertyValue: number
  totalFinancedAmount: number
  totalAmountToPay: number
  averageMonthlyPayment: number
  averagePropertyValue: number
}

interface ProposalData {
  id: string
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
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    id: string
    name: string
    email: string
    cpf: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    emailVerified: boolean
    image: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
  }
}

export default function AdminPage() {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showChangePassword, setShowChangePassword] = useState(false)

  const router = useRouter()
  const { data: session, status } = useSession()

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Carregar dados
  useEffect(() => {
    if (status !== "authenticated") return;
    const loadData = async () => {
      try {
        setIsLoading(true)

        const [proposalsResponse, statsResponse] = await Promise.all([
          fetch('/api/proposals'),
          fetch('/api/stats')
        ])

        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json()
          setProposals(proposalsData.data || [])
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.data)
        }
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [status])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  // Estados de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo ao sistema de administração
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Alterar Senha
            </Button>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Voltar ao Site
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informações do Administrador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Email:</span> admin@casafacil.com.br
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  ADMIN
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Online desde {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProposals}</div>
                <p className="text-xs text-muted-foreground">Propostas criadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.averagePropertyValue)}
                </div>
                <p className="text-xs text-muted-foreground">Valor médio das propriedades</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Financiado</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.totalFinancedAmount)}
                </div>
                <p className="text-xs text-muted-foreground">Valor total financiado</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Proposals Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Propostas de Financiamento
            </CardTitle>
            <CardDescription>
              Lista completa de propostas cadastradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ProposalsTable
              proposals={proposals}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  )
}