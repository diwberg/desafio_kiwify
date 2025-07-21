"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Home, Calculator, CheckCircle, FileText, X } from "lucide-react";
import { SimulationForm, SimulationResult } from "@/components/simulation-form";
import { SimulationResults } from "@/components/simulation-results";

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');

  const handleSimulate = (result: SimulationResult) => {
    setSimulationResult(result);
    setCurrentStep('results');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setSimulationResult(null);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
    setCurrentStep('form');
    setSimulationResult(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentStep('form');
    setSimulationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Home className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">CasaFácil</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Realize o sonho da casa própria com nossa simulação inteligente de financiamento imobiliário
          </p>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Financiamento Imobiliário Simplificado
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Nossa plataforma oferece condições especiais para você conquistar seu imóvel dos sonhos. 
                  Com processo 100% digital e aprovação rápida, tornamos seu financiamento mais acessível.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Taxa Especial</h3>
                  <p className="text-gray-600">12% ao ano com juros amortizados</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrada Mínima</h3>
                  <p className="text-gray-600">Apenas 20% do valor do imóvel</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Digital</h3>
                  <p className="text-gray-600">Processo completo online com assinatura digital</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  onClick={openDrawer}
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Simular Meu Financiamento
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Simulação gratuita • Sem compromisso • Resultado instantâneo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Por que escolher a CasaFácil?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="bg-blue-50 rounded-lg p-3 w-fit mx-auto mb-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Simulação Precisa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Calcule suas parcelas com precisão usando nossa calculadora avançada
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="bg-green-50 rounded-lg p-3 w-fit mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Aprovação Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Processo de aprovação ágil com resposta em até 48 horas
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="bg-purple-50 rounded-lg p-3 w-fit mx-auto mb-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Documentação Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Toda documentação online com assinatura digital válida juridicamente
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="bg-orange-50 rounded-lg p-3 w-fit mx-auto mb-3">
                  <Home className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Suporte Especializado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Equipe especializada para te ajudar em todas as etapas do processo
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          {/* Links de Navegação */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              {/* Seção da Empresa */}
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Home className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">CasaFácil</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Facilitando o sonho da casa própria com financiamento inteligente e digital.
                </p>
              </div>

              {/* Seção Legal */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Legal</h4>
                <div className="space-y-2">
                  <div>
                    <a 
                      href="/termos-de-uso" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Termos de Uso
                    </a>
                  </div>
                  <div>
                    <a 
                      href="/termos-de-privacidade" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Termos de Privacidade
                    </a>
                  </div>
                </div>
              </div>

              {/* Seção Acesso */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Acesso Rápido</h4>
                <div className="space-y-2">
                  <div>
                    <a 
                      href="/login" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center md:justify-start gap-1"
                    >
                      <Calculator className="h-4 w-4" />
                      Dashboard
                    </a>
                  </div>
                  <div>
                    <button
                      onClick={openDrawer}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center md:justify-start gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Nova Simulação
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              © 2024 CasaFácil. Todos os direitos reservados. | Financiamento sujeito à aprovação de crédito.
            </p>
          </div>
        </div>
      </div>

      {/* Drawer de Simulação */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader className="text-center border-b">
            <div className="flex items-center justify-between w-full">
              <div></div> {/* Spacer */}
              <div>
                <DrawerTitle className="text-2xl font-bold">
                  {currentStep === 'form' ? 'Simulação de Financiamento' : 'Resultado da Simulação'}
                </DrawerTitle>
                <DrawerDescription>
                  {currentStep === 'form' 
                    ? 'Preencha os dados para calcular seu financiamento'
                    : 'Confira os detalhes da sua simulação'
                  }
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" onClick={closeDrawer}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              {currentStep === 'form' ? (
                <SimulationForm onSimulate={handleSimulate} />
              ) : simulationResult ? (
                <SimulationResults 
                  result={simulationResult}
                  onBack={handleBackToForm}
                />
              ) : null}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
