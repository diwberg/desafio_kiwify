# 🔐 Sistema de Autenticação - CasaFácil

Este documento explica a implementação do sistema de autenticação usando Better Auth no projeto CasaFácil.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Estrutura](#estrutura)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Proteção de Rotas](#proteção-de-rotas)
- [Usuário Administrador](#usuário-administrador)
- [Como Usar](#como-usar)

## 🎯 Visão Geral

O sistema de autenticação implementa:
- ✅ **Login/Registro** por email e senha
- ✅ **Plugin Admin** para diferenciação de papéis
- ✅ **Proteção de rotas** baseada em roles
- ✅ **Sessões seguras** com expiração automática
- ✅ **Dashboard administrativo** completo

## ⚙️ Configuração

### Arquivo `.env`
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_URL=http://localhost:3000
BETTER_AUTH_SECRET=sua-chave-secreta-aqui-que-deve-ser-alterada-em-producao
BETTER_AUTH_URL=http://localhost:3000
```

### Better Auth (`src/lib/auth.ts`)
```typescript
export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  
  plugins: [
    admin({
      defaultRole: "user",
      adminRole: "admin",
    })
  ],
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualizar a cada 24h
  },
})
```

### Cliente Frontend (`src/lib/auth-client.ts`)
```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  plugins: [adminClient()],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient
```

## 🏗️ Estrutura

### Páginas
- **`/login`**: Página de login/registro
- **`/admin`**: Dashboard administrativo (apenas admins)
- **API `/api/auth/[...all]`**: Endpoints do Better Auth

### Banco de Dados (Prisma)
```typescript
// Usuários
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  role          String   @default("user") // "user" ou "admin"
  emailVerified Boolean  @default(false)
  
  // Dados pessoais (para propostas)
  cpf       String?
  phone     String?
  address   String?
  city      String?
  state     String?
  zipCode   String?
  
  // Relacionamentos
  sessions  Session[]
  accounts  Account[]
  proposals Proposal[]
}

// Sessões ativas
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
}

// Contas e senhas
model Account {
  id         String  @id @default(cuid())
  userId     String
  accountId  String
  providerId String
  password   String? // Hash da senha
}
```

## 🔄 Fluxo de Autenticação

### 1. Registro de Usuário
```typescript
const result = await signUp.email({
  email: "usuario@exemplo.com",
  password: "senha123",
  name: "João da Silva",
})

// Usuário criado com role: "user" (padrão)
```

### 2. Login
```typescript
const result = await signIn.email({
  email: "usuario@exemplo.com", 
  password: "senha123",
})

// Sessão criada, redirecionamento baseado no role
if (result.data?.user?.role === "admin") {
  router.push("/admin")
} else {
  router.push("/")
}
```

### 3. Verificação de Sessão
```typescript
const { data: session } = useSession()

if (session) {
  console.log("Usuário logado:", session.user.name)
  console.log("Role:", session.user.role)
} else {
  console.log("Usuário não logado")
}
```

### 4. Logout
```typescript
await signOut()
router.push("/")
```

## 🛡️ Proteção de Rotas

### Página de Admin (`/admin/page.tsx`)
```typescript
const { data: session } = useSession()

useEffect(() => {
  if (!session) {
    router.push("/login") // Não logado
  } else if (session.user.role !== "admin") {
    router.push("/") // Não é admin
  }
}, [session])
```

### Verificação Manual
```typescript
// Verificar se usuário está logado
if (!session) {
  return <LoginPage />
}

// Verificar se é admin
if (session.user.role !== "admin") {
  return <AccessDenied />
}
```

## 👑 Usuário Administrador

### Criação Automática
```bash
# Executar script para criar admin padrão
npx tsx src/scripts/create-admin.ts
```

**Credenciais Padrão:**
- 📧 **Email**: `admin@casafacil.com.br`
- 🔑 **Senha**: `admin123`
- ⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

### Criar Admin Manual
```typescript
// Via script ou diretamente no banco
await prisma.user.create({
  data: {
    email: "novo-admin@exemplo.com",
    name: "Nome do Admin",
    role: "admin", // ← Campo importante
    emailVerified: true,
    cpf: "12345678901",
    // ... outros campos
  }
})

// Criar conta com senha
await prisma.account.create({
  data: {
    userId: user.id,
    accountId: user.id,
    providerId: "credential",
    password: await bcrypt.hash("senha123", 10),
  }
})
```

## 📊 Dashboard Administrativo

### Funcionalidades
- ✅ **Estatísticas** gerais do sistema
- ✅ **Lista de propostas** recentes
- ✅ **Dados dos usuários** e CPFs
- ✅ **Valores financeiros** formatados
- ✅ **Logout** seguro

### APIs Utilizadas
```typescript
// Carregar propostas
const response = await fetch('/api/proposals')
const proposals = await response.json()

// Carregar estatísticas  
const response = await fetch('/api/stats')
const stats = await response.json()
```

## 🚀 Como Usar

### 1. Login como Usuário Comum
1. Acesse `/login`
2. Clique em "Criar conta"
3. Preencha email, senha e nome
4. Após registro, será redirecionado para `/`

### 2. Login como Administrador
1. Acesse `/login`
2. Use credenciais do admin:
   - Email: `admin@casafacil.com.br`
   - Senha: `admin123`
3. Será redirecionado para `/admin`

### 3. Acessar Dashboard
- **Usuário comum**: Clica em "Dashboard" → redirecionado para login
- **Admin logado**: Clica em "Dashboard" → vai direto para `/admin`

### 4. Navegação
- **Página inicial**: Botão "Dashboard" no rodapé
- **Login**: Link "Voltar ao Início"
- **Admin**: Botões "Início" e "Sair" no header

## 🔧 Comandos Úteis

### Criar Admin
```bash
npx tsx src/scripts/create-admin.ts
```

### Migração do Banco
```bash
npx prisma migrate dev --name add-auth-tables
npx prisma generate
```

### Reset de Sessões
```bash
# Via Prisma Studio
npx prisma studio
# Deletar registros da tabela "sessions"
```

## 🔒 Segurança

### Senhas
- ✅ Hash com **bcryptjs** (salt: 10)
- ✅ Comprimento mínimo: **6 caracteres**
- ✅ Stored na tabela `accounts`

### Sessões
- ✅ Expiração: **7 dias**
- ✅ Renovação: **24 horas**
- ✅ Token único por sessão
- ✅ IP e User-Agent registrados

### Proteção CORS
- ✅ Integrado com middleware CORS existente
- ✅ Apenas origens autorizadas
- ✅ Headers seguros

### Validação
- ✅ Email único no banco
- ✅ Verificação de role em tempo real
- ✅ Redirecionamento automático

## 🐛 Troubleshooting

### Problema: "Não consegue fazer login"
**Possíveis causas:**
1. Email/senha incorretos
2. Usuário não existe
3. Erro na configuração do Better Auth

**Solução:**
```bash
# Verificar usuário no banco
npx prisma studio
# Ver tabelas: users, accounts
```

### Problema: "Redirecionamento incorreto"
**Causa**: Role não configurado corretamente
**Solução:**
```sql
-- Atualizar role do usuário
UPDATE users SET role = 'admin' WHERE email = 'usuario@exemplo.com';
```

### Problema: "Admin não consegue acessar"
**Solução**: Re-executar script de criação
```bash
npx tsx src/scripts/create-admin.ts
```

## 📋 Checklist de Implementação

- [x] ✅ Better Auth instalado e configurado
- [x] ✅ Plugin admin implementado
- [x] ✅ Páginas de login/registro criadas
- [x] ✅ Dashboard administrativo funcional
- [x] ✅ Proteção de rotas implementada
- [x] ✅ Usuário admin padrão criado
- [x] ✅ Integração com banco Prisma
- [x] ✅ Botão do rodapé redirecionando
- [x] ✅ Sessões seguras configuradas
- [x] ✅ Logout funcional
- [x] ✅ Documentação completa

---

## 🎯 Resumo

**Sistema de autenticação completo** implementado com:

1. **Better Auth** para gerenciamento de sessões
2. **Plugin Admin** para controle de acesso
3. **Proteção de rotas** baseada em roles
4. **Dashboard administrativo** com estatísticas
5. **Integração total** com sistema existente

**Credenciais de teste:**
- 👤 **Admin**: `admin@casafacil.com.br` / `admin123`
- 🔗 **Acesso**: Clique em "Dashboard" no rodapé da página inicial

🔐 **Sistema pronto para produção!** 🔐 