"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignatureModal } from "@/components/signature-modal";
import { 
  FileText, 
  DollarSign, 
  Calculator, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Shield,
  Building,
  Percent,
  PenTool
} from "lucide-react";

interface ProposalData {
  propertyValue: number;
  downPayment: number;
  financedAmount: number;
  term: number;
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  downPaymentPercentage: string;
}

function PropostaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setProposalData(decoded);
      } catch (error) {
        console.error('Erro ao decodificar dados:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleOpenSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };

  const handleCloseSignatureModal = () => {
    setIsSignatureModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Proposta não encontrada</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  const proposalNumber = `CF-${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-10 w-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Proposta de Financiamento</h1>
            </div>
            <p className="text-gray-600">
              Proposta Nº {proposalNumber} • Gerada em {formatDate(currentDate)}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status da Proposta */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Proposta Aprovada Preliminarmente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Sua simulação foi aprovada! Para finalizar o processo, revise todos os detalhes 
                abaixo e assine digitalmente a proposta.
              </p>
            </CardContent>
          </Card>

          {/* Resumo do Financiamento */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-center text-blue-900">
                Resumo do Financiamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(proposalData.monthlyPayment)}
                  </div>
                  <p className="text-sm text-gray-600">Parcela Mensal</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {proposalData.downPaymentPercentage}%
                  </div>
                  <p className="text-sm text-gray-600">Entrada</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {proposalData.term} anos
                  </div>
                  <p className="text-sm text-gray-600">Prazo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes Financeiros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valores do Imóvel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Valores do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Valor do imóvel:</span>
                  <span className="font-semibold">{formatCurrency(proposalData.propertyValue)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Entrada ({proposalData.downPaymentPercentage}%):</span>
                  <span className="font-semibold text-green-600">{formatCurrency(proposalData.downPayment)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Valor a financiar:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(proposalData.financedAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Condições do Financiamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-green-600" />
                  Condições do Financiamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Taxa de juros:</span>
                  <span className="font-semibold">12% ao ano</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Sistema:</span>
                  <span className="font-semibold">Tabela Price</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total de parcelas:</span>
                  <span className="font-semibold">{proposalData.term * 12}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo Total */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Resumo Total do Investimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Valor total a ser pago:</span>
                <span className="font-bold text-xl">{formatCurrency(proposalData.totalAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Total de juros:</span>
                <span className="font-semibold text-orange-600">{formatCurrency(proposalData.totalInterest)}</span>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Observações Importantes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Valores calculados com base na Tabela Price</li>
                  <li>• Proposta válida por 30 dias</li>
                  <li>• Sujeito à aprovação final de crédito</li>
                  <li>• Documentação será solicitada após assinatura</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termos e Condições */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Termos e Condições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>1. Validade:</strong> Esta proposta é válida por 30 dias a partir da data de emissão.
                </p>
                <p>
                  <strong>2. Documentação:</strong> A aprovação final está condicionada à apresentação e análise da documentação completa.
                </p>
                <p>
                  <strong>3. Taxa de Juros:</strong> A taxa de 12% ao ano é fixa durante todo o período do financiamento.
                </p>
                <p>
                  <strong>4. Garantias:</strong> O imóvel financiado servirá como garantia da operação através de hipoteca.
                </p>
                <p>
                  <strong>5. Seguro:</strong> É obrigatória a contratação de seguro de danos físicos do imóvel e MIP (Morte e Invalidez Permanente).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Assinatura */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Pronto para assinar?
                </h3>
                <p className="text-gray-600">
                  Ao assinar esta proposta, você concorda com todos os termos e condições apresentados.
                  O processo de assinatura é 100% digital e juridicamente válido.
                </p>
                <Button
                  onClick={handleOpenSignatureModal}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold"
                >
                  <PenTool className="mr-2 h-5 w-5" />
                  Assinar Proposta Digitalmente
                </Button>
                <p className="text-xs text-gray-500">
                  Assinatura digital certificada • Processo seguro • Download imediato do PDF
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Assinatura */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={handleCloseSignatureModal}
        proposalData={proposalData}
        proposalNumber={proposalNumber}
      />
    </div>
  );
}

// Loading component
function PropostaLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Calculator className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Carregando proposta...</p>
      </div>
    </div>
  );
}

export default function PropostaPage() {
  return (
    <Suspense fallback={<PropostaLoading />}>
      <PropostaContent />
    </Suspense>
  );
} 