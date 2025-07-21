# 🛡️ Proteção CORS - CasaFácil

Este documento explica a implementação da proteção CORS (Cross-Origin Resource Sharing) para as APIs do projeto CasaFácil.

## 📋 Índice

- [O que é CORS](#o-que-é-cors)
- [Implementação](#implementação)
- [Configuração](#configuração)
- [Testes](#testes)
- [Ambientes](#ambientes)
- [Troubleshooting](#troubleshooting)

## 🤔 O que é CORS?

CORS é um mecanismo de segurança implementado pelos navegadores que **bloqueia requisições HTTP** de uma origem (domínio) para outra, a menos que o servidor de destino permita explicitamente.

### Exemplo Prático:
- ✅ **Permitido**: `https://casafacil.com.br` → `https://casafacil.com.br/api/proposals`
- ❌ **Bloqueado**: `https://malicious-site.com` → `https://casafacil.com.br/api/proposals`

## 🏗️ Implementação

### 1. Middleware Global (`middleware.ts`)
Intercepta **todas** as requisições para `/api/*` e aplica as regras CORS:

```typescript
// Origens permitidas (configurável via NEXT_PUBLIC_URL)
const corsOptions = {
  allowedOrigins: [
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}
```

### 2. Proteção por Rota (`src/lib/cors.ts`)
Middleware adicional para proteção específica por rota:

```typescript
// Aplicado nas rotas existentes
export const POST = withCors(handlePOST, getCorsConfig())
export const GET = withCors(handleGET, getCorsConfig())
```

### 3. Validação de Origem
```typescript
function isOriginAllowed(origin: string | null): boolean {
  // Permitir origem exata
  if (origin === allowedOrigin) return true
  
  // Para desenvolvimento, permitir localhost em qualquer porta
  if (process.env.NODE_ENV === 'development') {
    // localhost:3000, localhost:3001, etc.
  }
}
```

## ⚙️ Configuração

### Arquivo `.env`
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_URL=http://localhost:3000
```

### Para Produção:
```env
NEXT_PUBLIC_URL=https://casafacil.com.br
```

### Para Múltiplas Origens:
Modificar `middleware.ts`:
```typescript
const corsOptions = {
  allowedOrigins: [
    'https://casafacil.com.br',
    'https://app.casafacil.com.br',
    'https://admin.casafacil.com.br',
  ],
}
```

## 🧪 Testes

### Teste Automático:
```typescript
import { testCorsProtection } from '@/lib/test-cors'
await testCorsProtection()
```

### Teste Manual (Browser DevTools):
```javascript
// ✅ Requisição válida
fetch('/api/stats')
  .then(r => r.json())
  .then(console.log)

// ❌ Requisição bloqueada
fetch('https://other-domain.com/api/stats')
  .catch(console.error) // CORS error
```

### Teste com cURL:
```bash
# ✅ Origem permitida
curl -H "Origin: http://localhost:3000" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/stats

# ❌ Origem não permitida
curl -H "Origin: https://malicious-site.com" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/stats
```

## 🌍 Ambientes

### Desenvolvimento (`NODE_ENV=development`)
- ✅ Qualquer porta do localhost é permitida
- ✅ Logs detalhados no console
- ✅ Configuração mais permissiva

### Produção (`NODE_ENV=production`)
- 🔒 Apenas origens específicas permitidas
- 🔇 Logs reduzidos
- 🛡️ Configuração restritiva

### Teste (`NODE_ENV=test`)
- 🧪 Configuração mínima para testes
- ❌ Credentials desabilitados

## 📊 Headers CORS Retornados

### Requisição Válida:
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
Access-Control-Max-Age: 86400
```

### Preflight Request (OPTIONS):
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Requisição Bloqueada:
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "success": false,
  "error": "CORS: Origin not allowed",
  "allowedOrigins": ["http://localhost:3000"]
}
```

## 🛠️ Troubleshooting

### Problema: "CORS error" no navegador
**Causa**: Origem não permitida
**Solução**: 
1. Verificar `NEXT_PUBLIC_URL` no `.env`
2. Adicionar origem no `corsOptions.allowedOrigins`

### Problema: API funciona no Postman mas não no browser
**Causa**: Postman não aplica CORS, browsers sim
**Solução**: Configurar CORS corretamente (browsers fazem preflight)

### Problema: "Origin not allowed" em produção
**Causa**: URL de produção não configurada
**Solução**: 
```env
NEXT_PUBLIC_URL=https://sua-url-de-producao.com
```

### Problema: Preflight requests falhando
**Causa**: Método ou header não permitido
**Solução**: Adicionar em `corsOptions`:
```typescript
allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
```

## 🔍 Logs e Debugging

### Desenvolvimento:
```log
🌐 CORS Middleware - GET /api/stats from http://localhost:3000
✅ Origin allowed: http://localhost:3000
```

### Bloqueio:
```log
🌐 CORS Middleware - POST /api/proposals from https://malicious-site.com
❌ CORS Blocked - Origin not allowed: https://malicious-site.com
```

## 📋 Checklist de Segurança

- [x] ✅ Middleware global aplicado em `/api/*`
- [x] ✅ Validação de origem implementada
- [x] ✅ Preflight requests (OPTIONS) suportados
- [x] ✅ Headers CORS corretos retornados
- [x] ✅ Logs para auditoria e debugging
- [x] ✅ Configuração por ambiente
- [x] ✅ Testes automatizados implementados
- [x] ✅ Documentação completa

## 🚀 Comandos Úteis

### Verificar configuração:
```typescript
import { checkCorsConfig } from '@/lib/test-cors'
checkCorsConfig()
```

### Testar proteção:
```typescript
import { testCorsProtection } from '@/lib/test-cors'
await testCorsProtection()
```

### Validar em runtime:
```typescript
import { validateCorsConfig } from '@/lib/cors'
validateCorsConfig()
```

---

## 🎯 Resumo

A proteção CORS está implementada em **duas camadas**:

1. **Middleware Global**: Intercepta todas as APIs (`middleware.ts`)
2. **Middleware por Rota**: Proteção adicional específica (`src/lib/cors.ts`)

**Configuração principal**: `NEXT_PUBLIC_URL` no arquivo `.env`

**Segurança**: ✅ Apenas origens autorizadas podem acessar as APIs
**Flexibilidade**: ✅ Configuração diferente por ambiente (dev/prod)
**Monitoramento**: ✅ Logs detalhados para auditoria

🛡️ **APIs protegidas e prontas para produção!** 🛡️ 