"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react";

interface SimulationFormProps {
  onSimulate: (result: SimulationResult) => void;
}

export interface SimulationResult {
  propertyValue: number;
  downPayment: number;
  financedAmount: number;
  term: number;
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
}

// Utilitários de formatação
const formatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(numericValue) / 100);
  return formattedValue;
};

const parseCurrency = (value: string): number => {
  return Number(value.replace(/\D/g, "")) / 100;
};

// Schema de validação com Zod
const formSchema = z.object({
  propertyValue: z
    .string()
    .min(1, "Valor do imóvel é obrigatório")
    .refine((val) => {
      const numericValue = parseCurrency(val);
      return numericValue >= 50000;
    }, "Valor mínimo do imóvel: R$ 50.000"),
  
  downPayment: z
    .string()
    .min(1, "Valor da entrada é obrigatório"),
  
  term: z
    .number()
    .min(5, "Prazo mínimo: 5 anos")
    .max(35, "Prazo máximo: 35 anos"),
}).refine((data) => {
  const propertyValue = parseCurrency(data.propertyValue);
  const downPayment = parseCurrency(data.downPayment);
  
  // Validação: entrada mínima 20%
  if (downPayment < propertyValue * 0.2) {
    return false;
  }
  
  // Validação: entrada deve ser menor que o valor total
  if (downPayment >= propertyValue) {
    return false;
  }
  
  return true;
}, {
  message: "Entrada deve ser entre 20% e 99% do valor do imóvel",
  path: ["downPayment"],
});

type FormValues = z.infer<typeof formSchema>;

export function SimulationForm({ onSimulate }: SimulationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyValue: "",
      downPayment: "",
      term: 25,
    },
  });

  // Cálculo da simulação
  const calculateSimulation = (values: FormValues): SimulationResult => {
    const propertyValueNum = parseCurrency(values.propertyValue);
    const downPaymentNum = parseCurrency(values.downPayment);
    const financedAmount = propertyValueNum - downPaymentNum;
    const termNum = values.term;
    const annualRate = 0.12; // 12% ao ano
    const monthlyRate = annualRate / 12;
    const totalMonths = termNum * 12;

    // Fórmula de amortização (Tabela Price)
    const monthlyPayment =
      (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalAmount = monthlyPayment * totalMonths;
    const totalInterest = totalAmount - financedAmount;

    return {
      propertyValue: propertyValueNum,
      downPayment: downPaymentNum,
      financedAmount,
      term: termNum,
      monthlyPayment,
      totalAmount: totalAmount + downPaymentNum,
      totalInterest,
    };
  };

  const onSubmit = (values: FormValues) => {
    const result = calculateSimulation(values);
    onSimulate(result);
  };

  // Auto-calcular entrada mínima quando valor do imóvel mudar
  const handlePropertyValueChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatCurrency(value);
    onChange(formatted);
    
    // Auto-calcular entrada mínima (20%)
    const numericValue = parseCurrency(formatted);
    if (numericValue > 0) {
      const minDownPayment = numericValue * 0.2;
      const formattedDownPayment = formatCurrency((minDownPayment * 100).toString());
      form.setValue("downPayment", formattedDownPayment);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Simulação de Financiamento
        </h2>
        <p className="text-gray-600">
          Preencha os dados abaixo para calcular suas parcelas
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Valor do Imóvel */}
          <FormField
            control={form.control}
            name="propertyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Valor do Imóvel
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => handlePropertyValueChange(e.target.value, field.onChange)}
                  />
                </FormControl>
                <FormDescription>
                  Valor mínimo: R$ 50.000
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor da Entrada */}
          <FormField
            control={form.control}
            name="downPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  Valor da Entrada
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Mínimo 20% do valor do imóvel
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prazo */}
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Prazo (anos)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
                    min="5"
                    max="35"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Entre 5 e 35 anos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Informações da Taxa */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Condições do Financiamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Juros:</span>
                  <span className="font-semibold text-blue-600">12% ao ano</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sistema:</span>
                  <span className="font-semibold">Tabela Price</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entrada mínima:</span>
                  <span className="font-semibold">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Simular */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            disabled={form.formState.isSubmitting}
          >
            <Calculator className="mr-2 h-5 w-5" />
            {form.formState.isSubmitting ? "Calculando..." : "Calcular Simulação"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 