"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  DollarSign, 
  Calculator, 
  Calendar, 
  TrendingUp,
  FileText,
  ArrowLeft 
} from "lucide-react";
import { SimulationResult } from "./simulation-form";

interface SimulationResultsProps {
  result: SimulationResult;
  onBack: () => void;
  onAcceptProposal?: () => void;
}

export function SimulationResults({ result, onBack, onAcceptProposal }: SimulationResultsProps) {
  const router = useRouter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const downPaymentPercentage = ((result.downPayment / result.propertyValue) * 100).toFixed(1);

  const handleAcceptProposal = () => {
    // Serializar os dados da simulação para passar via URL
    const proposalData = {
      propertyValue: result.propertyValue,
      downPayment: result.downPayment,
      financedAmount: result.financedAmount,
      term: result.term,
      monthlyPayment: result.monthlyPayment,
      totalAmount: result.totalAmount,
      totalInterest: result.totalInterest,
      downPaymentPercentage: downPaymentPercentage,
    };

    // Encode dos dados para a URL
    const encodedData = encodeURIComponent(JSON.stringify(proposalData));
    
    // Navegar para a página de proposta
    router.push(`/proposta?data=${encodedData}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Simulação Concluída!
          </h2>
        </div>
        <p className="text-gray-600">
          Confira os detalhes do seu financiamento
        </p>
      </div>

      {/* Resultado Principal */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-center text-blue-900">
            Valor da Parcela Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {formatCurrency(result.monthlyPayment)}
            </div>
            <p className="text-gray-600">por {result.term} anos</p>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes da Simulação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Valores do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Valor do imóvel:</span>
              <span className="font-semibold">{formatCurrency(result.propertyValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Entrada ({downPaymentPercentage}%):</span>
              <span className="font-semibold text-green-600">{formatCurrency(result.downPayment)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Valor financiado:</span>
              <span className="font-semibold text-blue-600">{formatCurrency(result.financedAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              Condições
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de juros:</span>
              <span className="font-semibold">12% ao ano</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prazo:</span>
              <span className="font-semibold">{result.term} anos</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total de parcelas:</span>
              <span className="font-semibold">{result.term * 12}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Valor total a ser pago:</span>
            <span className="font-semibold text-lg">{formatCurrency(result.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total de juros:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(result.totalInterest)}</span>
          </div>
          <div className="text-xs text-gray-600 mt-3 p-3 bg-white rounded-lg">
            <strong>Observação:</strong> Valores calculados com base na Tabela Price. 
            Os valores finais podem sofrer pequenas variações após análise de crédito.
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="space-y-3">
        <Button
          onClick={handleAcceptProposal}
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
        >
          <FileText className="mr-2 h-5 w-5" />
          Aceitar Proposta
        </Button>
        
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="w-full py-3"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Fazer Nova Simulação
        </Button>
      </div>

      {/* Informações Adicionais */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-900">Próximos Passos</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ Análise de crédito em até 48 horas</p>
              <p>✓ Documentação 100% digital</p>
              <p>✓ Assinatura eletrônica válida juridicamente</p>
              <p>✓ Suporte especializado durante todo o processo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 