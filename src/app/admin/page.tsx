"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSimpleAuth } from "@/hooks/useSimpleAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProposalsTable } from "@/components/proposals-table"
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
  Phone
} from "lucide-react"
import Link from "next/link"

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

interface StatsData {
  totalUsers: number
  totalProposals: number
  totalFinancedAmount: number
  averagePropertyValue: number
}

export default function AdminPage() {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useSimpleAuth()

  // Verificar se usuário é admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return

      try {
        // Carregar propostas
        const proposalsResponse = await fetch('/api/proposals')
        //console.log(proposals)
        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json()
          setProposals(proposalsData.data || [])
        }

        // Carregar estatísticas
        const statsResponse = await fetch('/api/stats')
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

    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const handleSignOut = async () => {
    await logout()
    router.push("/")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo, {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Propostas
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProposals}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Financiado
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalFinancedAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Médio
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.averagePropertyValue)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabela de Propostas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Todas as Propostas
            </CardTitle>
            <CardDescription>
              Visualização completa de todas as propostas do sistema
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
    </div>
  )
} 