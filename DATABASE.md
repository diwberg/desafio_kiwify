# 🗃️ Banco de Dados - CasaFácil

Este documento explica a configuração e uso do banco de dados SQLite com Prisma ORM no projeto CasaFácil.

## 📋 Índice

- [Configuração](#configuração)
- [Schema do Banco](#schema-do-banco)
- [APIs Disponíveis](#apis-disponíveis)
- [Serviços](#serviços)
- [Exemplos de Uso](#exemplos-de-uso)
- [Comandos Úteis](#comandos-úteis)

## ⚙️ Configuração

### Dependências Instaladas
```bash
npm install prisma @prisma/client
```

### Arquivos de Configuração
- **`.env`**: Configuração da conexão com SQLite
- **`prisma/schema.prisma`**: Schema das tabelas
- **`src/lib/prisma.ts`**: Cliente Prisma configurado
- **`src/services/database.ts`**: Serviços para operações do banco

## 🏗️ Schema do Banco

### Tabela Users (`users`)
```typescript
{
  id: string          // ID único (CUID)
  cpf: string         // CPF único (identificador principal)
  name: string        // Nome completo
  email: string       // Email
  phone: string       // Telefone
  address: string     // Endereço completo
  city: string        // Cidade
  state: string       // Estado (UF)
  zipCode: string     // CEP
  createdAt: DateTime // Data de criação
  updatedAt: DateTime // Data de atualização
  proposals: Proposal[] // Relacionamento com propostas
}
```

### Tabela Proposals (`proposals`)
```typescript
{
  id: string                    // ID único (CUID)
  number: string                // Número da proposta (único)
  propertyValue: number         // Valor do imóvel
  downPayment: number           // Valor da entrada
  financedAmount: number        // Valor financiado
  term: number                  // Prazo em anos
  monthlyPayment: number        // Parcela mensal
  totalAmount: number           // Valor total a pagar
  totalInterest: number         // Total de juros
  downPaymentPercentage: string // Percentual da entrada
  signature: string             // Assinatura em base64
  signedAt: DateTime            // Data/hora da assinatura
  createdAt: DateTime           // Data de criação
  updatedAt: DateTime           // Data de atualização
  userId: string                // ID do usuário (FK)
  user: User                    // Relacionamento com usuário
}
```

### Relacionamentos
- **1 Usuário → N Propostas**: Um usuário pode ter várias propostas
- **CPF como unificador**: Todas as propostas de um CPF ficam relacionadas
- **Cascade Delete**: Deletar usuário remove suas propostas

## 🚀 APIs Disponíveis

### POST `/api/proposals`
Criar nova proposta com usuário.

**Body:**
```json
{
  "proposal": {
    "number": "CF-20240121-0001",
    "propertyValue": 350000,
    "downPayment": 70000,
    "financedAmount": 280000,
    "term": 30,
    "monthlyPayment": 2800,
    "totalAmount": 1078000,
    "totalInterest": 798000,
    "downPaymentPercentage": "20.0"
  },
  "user": {
    "name": "João da Silva",
    "email": "joao@example.com",
    "phone": "(11) 99999-9999",
    "cpf": "123.456.789-01",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "signature": "data:image/png;base64,iVBORw0KGgo...",
  "signedAt": "2024-01-21T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clq1234567890",
    "number": "CF-20240121-0001",
    "userId": "clq0987654321",
    "userCpf": "12345678901",
    "createdAt": "2024-01-21T10:30:00.000Z"
  },
  "message": "Proposta salva com sucesso"
}
```

### GET `/api/proposals`
Listar propostas com paginação.

**Parâmetros:**
- `cpf` (opcional): Filtrar por CPF do usuário
- `page` (opcional): Página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Exemplos:**
```bash
# Listar todas as propostas
GET /api/proposals

# Listar propostas de um usuário
GET /api/proposals?cpf=12345678901

# Listar com paginação
GET /api/proposals?page=2&limit=5
```

### GET `/api/stats`
Obter estatísticas do sistema ou de um usuário.

**Parâmetros:**
- `cpf` (opcional): CPF do usuário para estatísticas específicas

**Exemplos:**
```bash
# Estatísticas gerais
GET /api/stats

# Estatísticas de um usuário
GET /api/stats?cpf=12345678901
```

## 🛠️ Serviços

### DatabaseService

Classe estática com métodos para todas as operações do banco:

#### Operações de Usuário
```typescript
// Criar usuário
await DatabaseService.createUser(userData)

// Buscar por CPF
await DatabaseService.findUserByCpf("12345678901")

// Buscar por ID
await DatabaseService.findUserById("clq123...")

// Atualizar usuário
await DatabaseService.updateUser("12345678901", updateData)

// Listar usuários
await DatabaseService.listUsers(filter, orderBy)
```

#### Operações de Proposta
```typescript
// Criar proposta (usuário já existe)
await DatabaseService.createProposal(proposalData)

// Criar proposta + usuário (transação)
await DatabaseService.createProposalWithUser(data)

// Buscar por número
await DatabaseService.findProposalByNumber("CF-20240121-0001")

// Listar propostas
await DatabaseService.listProposals(filter, orderBy)

// Listar propostas de um usuário
await DatabaseService.listProposalsByUser("12345678901")
```

#### Estatísticas
```typescript
// Estatísticas de um usuário
await DatabaseService.getUserStats("12345678901")

// Estatísticas gerais
await DatabaseService.getGeneralStats()
```

## 💡 Exemplos de Uso

### Exemplo 1: Criar Proposta com Usuário Novo
```typescript
import { DatabaseService } from '@/services/database'

const result = await DatabaseService.createProposalWithUser({
  user: {
    cpf: "12345678901",
    name: "Maria Silva",
    email: "maria@example.com",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310100"
  },
  proposal: {
    number: "CF-20240121-0002",
    propertyValue: 500000,
    downPayment: 100000,
    financedAmount: 400000,
    term: 25,
    monthlyPayment: 3200,
    totalAmount: 1060000,
    totalInterest: 660000,
    downPaymentPercentage: "20.0",
    signature: "data:image/png;base64,iVBORw0KGgo...",
    signedAt: new Date()
  }
})

console.log(`Proposta ${result.number} criada para ${result.user.name}`)
```

### Exemplo 2: Buscar Histórico de um Cliente
```typescript
const userStats = await DatabaseService.getUserStats("12345678901")

if (userStats) {
  console.log(`Cliente: ${userStats.user.name}`)
  console.log(`Total de propostas: ${userStats.stats.totalProposals}`)
  console.log(`Valor total financiado: R$ ${userStats.stats.totalFinanced}`)
  console.log(`Parcela média: R$ ${userStats.stats.averageMonthlyPayment}`)
}
```

### Exemplo 3: Relatório Geral do Sistema
```typescript
const stats = await DatabaseService.getGeneralStats()

console.log(`📊 Relatório Geral:`)
console.log(`👥 Total de usuários: ${stats.totalUsers}`)
console.log(`📄 Total de propostas: ${stats.totalProposals}`)
console.log(`💰 Valor total financiado: R$ ${stats.totalFinancedAmount}`)
console.log(`🏠 Valor médio dos imóveis: R$ ${stats.averagePropertyValue}`)
```

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema com o banco
npx prisma db push

# Executar migração
npx prisma migrate dev --name migration_name

# Reset do banco (CUIDADO!)
npx prisma migrate reset

# Visualizar dados no Prisma Studio
npx prisma studio
```

### Produção
```bash
# Deploy de migrações
npx prisma migrate deploy

# Gerar client para produção
npx prisma generate
```

## 🔒 Características de Segurança

1. **Validação Zod**: Todos os dados são validados antes de entrar no banco
2. **Transações**: Operações críticas usam transações para consistência
3. **CPF Único**: Evita duplicação de usuários
4. **Timestamps**: Auditoria com createdAt e updatedAt
5. **Relacionamentos**: Integridade referencial garantida

## 📈 Performance

1. **Índices**: CPF e número da proposta são únicos (índices automáticos)
2. **Relacionamentos**: Carregamento otimizado com include/select
3. **Paginação**: APIs suportam paginação para grandes volumes
4. **Connection Pooling**: Prisma gerencia conexões automaticamente

---

✅ **Banco configurado e pronto para uso!**

Para testar as funcionalidades, execute:
```typescript
import { testDatabaseOperations } from '@/lib/test-database'
await testDatabaseOperations()
``` 