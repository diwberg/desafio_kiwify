"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProposalWithUser } from "@/types/database"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, FileText, CalendarDays, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProposalsTableProps {
  proposals: ProposalWithUser[]
  isLoading?: boolean
}

export function ProposalsTable({ proposals, isLoading }: ProposalsTableProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor do Imóvel</TableHead>
                <TableHead className="text-right">Entrada</TableHead>
                <TableHead className="text-right">Financiado</TableHead>
                <TableHead className="text-right">Parcela</TableHead>
                <TableHead className="text-center">Prazo</TableHead>
                <TableHead className="text-center">Data</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor do Imóvel</TableHead>
                <TableHead className="text-right">Entrada</TableHead>
                <TableHead className="text-right">Financiado</TableHead>
                <TableHead className="text-right">Parcela</TableHead>
                <TableHead className="text-center">Prazo</TableHead>
                <TableHead className="text-center">Data</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Nenhuma proposta encontrada</p>
                    <p className="text-sm text-gray-400">
                      As propostas aparecerão aqui quando forem criadas
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor do Imóvel</TableHead>
              <TableHead className="text-right">Entrada</TableHead>
              <TableHead className="text-right">Financiado</TableHead>
              <TableHead className="text-right">Parcela</TableHead>
              <TableHead className="text-center">Prazo</TableHead>
              <TableHead className="text-center">Data</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {proposal.number}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {proposal.user.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {proposal.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {formatCurrency(proposal.propertyValue)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{formatCurrency(proposal.downPayment)}</span>
                    <span className="text-xs text-gray-500">
                      {proposal.downPaymentPercentage}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(proposal.financedAmount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-blue-600">
                      {formatCurrency(proposal.monthlyPayment)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {proposal.term}x
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-medium">
                    {proposal.term} meses
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {formatDate(proposal.createdAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={proposal.signature ? "default" : "secondary"}
                    className={
                      proposal.signature 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }
                  >
                    {proposal.signature ? "Assinada" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      // TODO: Implementar visualização da proposta
                      console.log('Ver proposta:', proposal.number)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Informações da tabela */}
      <div className="flex items-center justify-between px-2 py-4 text-sm text-gray-500">
        <div>
          Mostrando {proposals.length} proposta{proposals.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-4">
          <span>
            Total financiado: {' '}
            <span className="font-medium text-gray-900">
              {formatCurrency(
                proposals.reduce((sum, p) => sum + p.financedAmount, 0)
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
} 