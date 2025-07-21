# 🔐 Autenticação Simples - CasaFácil

Sistema de autenticação simplificado usando variáveis de ambiente para credenciais de administrador.

## 📋 Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Banco de dados
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_URL=http://localhost:3000

# Autenticação Simples
ADMIN_EMAIL=admin@casafacil.com.br
ADMIN_PASSWORD=admin123
JWT_SECRET=sua-chave-secreta-mude-em-producao
```

### Credenciais Padrão

**Email**: `admin@casafacil.com.br`  
**Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

## 🚀 Como Funciona

### 1. Login
- Usuário acessa `/login`
- Insere email e senha
- Sistema valida contra `ADMIN_EMAIL` e `ADMIN_PASSWORD`
- Se correto, cria JWT token e define cookie

### 2. Proteção de Rotas
- Página `/admin` verifica autenticação via cookie
- Hook `useSimpleAuth` gerencia estado de login
- Redirecionamento automático se não autenticado

### 3. Logout
- Remove cookie de autenticação
- Redireciona para página inicial

## 🔧 APIs Disponíveis

### POST `/api/simple-auth/login`
```typescript
// Request
{
  "email": "admin@casafacil.com.br",
  "password": "admin123"
}

// Response (Sucesso)
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "email": "admin@casafacil.com.br",
    "role": "admin"
  }
}

// Response (Erro)
{
  "success": false,
  "message": "Email ou senha incorretos"
}
```

### GET `/api/simple-auth/verify`
```typescript
// Response (Autenticado)
{
  "success": true,
  "authenticated": true,
  "user": {
    "email": "admin@casafacil.com.br",
    "role": "admin"
  }
}

// Response (Não autenticado)
{
  "success": false,
  "authenticated": false,
  "message": "Token não encontrado"
}
```

### POST `/api/simple-auth/logout`
```typescript
// Response
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## 🎯 Características

### ✅ Implementado
- ✅ Login apenas para admin (registro bloqueado)
- ✅ Validação via variáveis de ambiente
- ✅ JWT tokens com expiração (7 dias)
- ✅ Cookies HTTPOnly seguros
- ✅ Hook React para gerenciar estado
- ✅ Proteção de rotas automática
- ✅ Logout funcional

### ❌ Não Implementado (simplificado)
- ❌ Registro de novos usuários
- ❌ Recuperação de senha
- ❌ Múltiplos usuários/roles
- ❌ Banco de dados para usuários
- ❌ Verificação de email

## 🔒 Segurança

### JWT Configuration
- **Algoritmo**: HS256
- **Expiração**: 7 dias
- **Renovação**: Manual (login novamente)

### Cookies
- **HTTPOnly**: ✅ (não acessível via JavaScript)
- **Secure**: ✅ (apenas HTTPS em produção)
- **SameSite**: `lax`
- **Max Age**: 7 dias

### Validação
- **Environment Variables**: Credenciais centralizadas
- **Token Verification**: Verificação JWT em cada request
- **Auto Logout**: Token inválido = logout automático

## 🛠️ Uso no Frontend

### Hook useSimpleAuth
```typescript
import { useSimpleAuth } from '@/hooks/useSimpleAuth'

function MyComponent() {
  const { 
    user,           // Dados do usuário
    isAuthenticated, // Status de autenticação
    isLoading,      // Loading state
    login,          // Função de login
    logout          // Função de logout
  } = useSimpleAuth()

  // Login
  const handleLogin = async () => {
    const result = await login(email, password)
    if (result.success) {
      // Logado com sucesso
    } else {
      // Erro: result.message
    }
  }

  // Logout
  const handleLogout = async () => {
    await logout()
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Bem-vindo, {user?.email}</p>
      ) : (
        <p>Não autenticado</p>
      )}
    </div>
  )
}
```

### Proteção de Páginas
```typescript
function AdminPage() {
  const { isAuthenticated, isLoading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <Loading />
  if (!isAuthenticated) return null

  return <AdminDashboard />
}
```

## 🚀 Como Usar

### 1. Configurar Variáveis
Adicione as variáveis ao `.env` conforme mostrado acima.

### 2. Acessar Sistema
1. Vá para `http://localhost:3000`
2. Clique em "Dashboard" no rodapé
3. Digite as credenciais do admin
4. Acesse o painel administrativo

### 3. Alterar Credenciais
Modifique `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env` e reinicie o servidor.

## 🔧 Comandos de Desenvolvimento

### Iniciar Servidor
```bash
npm run dev
```

### Testar APIs
```bash
# Login
curl -X POST http://localhost:3000/api/simple-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@casafacil.com.br","password":"admin123"}'

# Verificar autenticação
curl -X GET http://localhost:3000/api/simple-auth/verify

# Logout
curl -X POST http://localhost:3000/api/simple-auth/logout
```

## 📋 Checklist de Implementação

- [x] ✅ APIs de autenticação criadas
- [x] ✅ Hook useSimpleAuth implementado
- [x] ✅ Página de login atualizada (sem registro)
- [x] ✅ Página de admin com proteção
- [x] ✅ Logout funcional
- [x] ✅ Variáveis de ambiente documentadas
- [x] ✅ JWT tokens seguros
- [x] ✅ Cookies HTTPOnly
- [x] ✅ Redirecionamentos automáticos

---

## 🎯 Resumo

**Sistema de autenticação simplificado** para administradores:

1. **Login único**: Apenas admin definido em variáveis de ambiente
2. **Sem registro**: Funcionalidade de criação de usuários desabilitada
3. **JWT seguro**: Tokens com expiração e cookies HTTPOnly
4. **Fácil configuração**: Credenciais via `.env`
5. **Proteção automática**: Rotas protegidas com hook React

**Credenciais padrão:**
- 📧 **Email**: `admin@casafacil.com.br`
- 🔑 **Senha**: `admin123`

🔐 **Sistema pronto para uso administrativo!** 🔐 