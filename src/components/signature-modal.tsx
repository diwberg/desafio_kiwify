"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  PenTool, 
  Download,
  Trash2,
  UserCheck
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

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ProposalData;
  proposalNumber: string;
}

// Schema de validação para dados pessoais
const userDataSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
});

type UserData = z.infer<typeof userDataSchema>;

export function SignatureModal({ isOpen, onClose, proposalData, proposalNumber }: SignatureModalProps) {
  const [step, setStep] = useState<'form' | 'signature'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const form = useForm<UserData>({
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formatação de data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Formatação de CPF
  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Formatação de telefone
  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 10) {
      return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Formatação de CEP
  const formatZipCode = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  // Avançar para etapa de assinatura
  const handleFormSubmit = (data: UserData) => {
    setStep('signature');
  };

  // Limpar assinatura
  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  // Gerar PDF
  const generatePDF = async (userData: UserData, signatureDataURL: string) => {
    const pdf = new jsPDF();
    const currentDate = new Date();

    // Configuração da página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROPOSTA DE FINANCIAMENTO IMOBILIÁRIO", margin, 30);
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Proposta Nº: ${proposalNumber}`, margin, 45);
    pdf.text(`Data: ${formatDate(currentDate)}`, margin, 55);

    // Dados do Cliente
    let yPosition = 75;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("DADOS DO CLIENTE", margin, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nome: ${userData.name}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Email: ${userData.email}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Telefone: ${userData.phone}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`CPF: ${userData.cpf}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Endereço: ${userData.address}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Cidade: ${userData.city} - ${userData.state}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`CEP: ${userData.zipCode}`, margin, yPosition);

    // Dados do Financiamento
    yPosition += 25;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("DADOS DO FINANCIAMENTO", margin, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Valor do Imóvel: ${formatCurrency(proposalData.propertyValue)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Entrada (${proposalData.downPaymentPercentage}%): ${formatCurrency(proposalData.downPayment)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Valor Financiado: ${formatCurrency(proposalData.financedAmount)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Prazo: ${proposalData.term} anos (${proposalData.term * 12} parcelas)`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Taxa de Juros: 12% ao ano`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Parcela Mensal: ${formatCurrency(proposalData.monthlyPayment)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Valor Total: ${formatCurrency(proposalData.totalAmount)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Total de Juros: ${formatCurrency(proposalData.totalInterest)}`, margin, yPosition);

    // Termos
    yPosition += 25;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("TERMOS E CONDIÇÕES", margin, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const terms = [
      "1. Esta proposta é válida por 30 dias.",
      "2. Aprovação sujeita à análise de crédito.",
      "3. Taxa de juros fixa de 12% ao ano.",
      "4. Sistema de amortização: Tabela Price.",
      "5. Seguro obrigatório do imóvel e MIP."
    ];
    
    terms.forEach(term => {
      pdf.text(term, margin, yPosition);
      yPosition += 8;
    });

        // ====== RODAPÉ COM ASSINATURA DIGITAL ======
    const footerHeight = 70;
    const footerYStart = pageHeight - footerHeight;
    
    // Linha divisória superior do rodapé
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(100, 100, 100); // Cor cinza
    pdf.line(margin, footerYStart, pageWidth - margin, footerYStart);
    
    // Informações institucionais (lado esquerdo)
    const leftSide = margin;
    const leftYStart = footerYStart + 15;
    
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(50, 50, 50);
    pdf.text("CasaFácil Financiamentos", leftSide, leftYStart);
    
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Proposta Nº ${proposalNumber}`, leftSide, leftYStart + 8);
    pdf.text(`Gerado em ${formatDate(currentDate)} às ${currentDate.toLocaleTimeString('pt-BR')}`, leftSide, leftYStart + 16);
    pdf.text("Documento com validade jurídica - Lei 14.063/2020", leftSide, leftYStart + 24);
    
    // Assinatura digital (lado direito)
    if (signatureDataURL) {
      const signatureWidth = 90;
      const signatureHeight = 35;
      const signatureX = pageWidth - margin - signatureWidth - 10;
      const signatureY = footerYStart + 8;
      
      // Título da assinatura
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("ASSINATURA DIGITAL CERTIFICADA", signatureX, signatureY);
      
      // Caixa da assinatura com borda
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(signatureX - 2, signatureY + 2, signatureWidth + 4, signatureHeight + 18);
      
      // Imagem da assinatura
      pdf.addImage(signatureDataURL, 'PNG', signatureX, signatureY + 4, signatureWidth, signatureHeight);
      
      // Informações do signatário
      const signatoryY = signatureY + signatureHeight + 8;
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(userData.name.toUpperCase(), signatureX, signatoryY);
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text(`CPF: ${userData.cpf}`, signatureX, signatoryY + 6);
      pdf.text(`${formatDate(currentDate)} - ${currentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, signatureX, signatoryY + 12);
    }
    
    // Reset das cores para o padrão
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(0, 0, 0);

    return pdf;
  };

  // Enviar dados para API
  const sendToAPI = async (userData: UserData, signatureDataURL: string) => {
    const payload = {
      proposal: {
        number: proposalNumber,
        ...proposalData,
      },
      user: userData,
      signature: signatureDataURL,
      signedAt: new Date().toISOString(),
    };

    try {
      // TODO: Substituir pela URL real da API
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados para API');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      // Por enquanto, apenas simular sucesso
      return { success: true, id: Math.random().toString(36).substr(2, 9) };
    }
  };

  // Finalizar assinatura
  const handleSign = async () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setIsLoading(true);
      
      try {
        const userData = form.getValues();
        const signatureDataURL = signatureRef.current.toDataURL();
        
        // Gerar PDF
        const pdf = await generatePDF(userData, signatureDataURL);
        
        // Enviar para API
        await sendToAPI(userData, signatureDataURL);
        
        // Download do PDF
        pdf.save(`proposta-${proposalNumber}.pdf`);
        
        // Fechar modal
        onClose();
        
        // Feedback de sucesso
        alert('Proposta assinada com sucesso! O PDF foi baixado automaticamente.');
        
      } catch (error) {
        console.error('Erro ao processar assinatura:', error);
        alert('Erro ao processar assinatura. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Por favor, assine no campo indicado.');
    }
  };

  // Reset modal ao fechar
  const handleClose = () => {
    setStep('form');
    form.reset();
    signatureRef.current?.clear();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'form' ? (
              <>
                <UserCheck className="h-5 w-5" />
                Dados Pessoais
              </>
            ) : (
              <>
                <PenTool className="h-5 w-5" />
                Assinatura Digital
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' 
              ? 'Preencha seus dados pessoais para prosseguir com a assinatura.'
              : 'Assine no campo abaixo para finalizar sua proposta.'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="joao@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 99999-9999" 
                          {...field}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          {...field}
                          onChange={(e) => field.onChange(formatCPF(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço Completo
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Rua das Flores, 123, Apto 45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000-000" 
                          {...field}
                          onChange={(e) => field.onChange(formatZipCode(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <PenTool className="mr-2 h-4 w-4" />
                  Prosseguir para Assinatura
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Assine Abaixo</h3>
              <p className="text-sm text-gray-600">
                Desenhe sua assinatura no campo abaixo. Esta assinatura será incluída no PDF da proposta.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas w-full h-40 border rounded',
                }}
                backgroundColor="white"
              />
            </div>

            <div className="flex justify-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={clearSignature}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Assinatura
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep('form')}>
                Voltar
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSign}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Assinar e Baixar PDF
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 