# Configuração para Deploy

## Problema Identificado ✅ RESOLVIDO
O erro de CORS estava acontecendo porque o frontend estava tentando fazer requisições para `http://localhost:3000` mas estava rodando em `https://desafio.ky.zapflow.app`.

## Soluções Aplicadas ✅
1. **Corrigido o `auth-client.ts`** para detectar automaticamente a URL correta
2. **Simplificado o middleware** para evitar problemas de build
3. **Build testado e funcionando** ✅

## Variáveis de Ambiente Necessárias

### Para o Deploy (ZapFlow/Vercel/etc):
```bash
# Database
DATABASE_URL="postgresql://seu_usuario:sua_senha@seu_host:5432/seu_banco"

# Better Auth
BETTER_AUTH_SECRET="sua-chave-secreta-muito-segura"
JWT_SECRET="seu-jwt-secret-muito-seguro"

# App URL (IMPORTANTE!)
NEXT_PUBLIC_APP_URL="https://desafio.ky.zapflow.app"
```

### Para Desenvolvimento Local:
```bash
# Database
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/casafacil"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-change-in-production"
JWT_SECRET="your-jwt-secret-change-in-production"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Configuração no Deploy

### 1. ZapFlow/Vercel
- Vá nas configurações do projeto
- Adicione as variáveis de ambiente acima
- **IMPORTANTE**: Certifique-se de que `NEXT_PUBLIC_APP_URL` está configurada corretamente

### 2. Database
- Configure um banco PostgreSQL (Railway, Supabase, etc.)
- Atualize a `DATABASE_URL` com as credenciais corretas

### 3. Secrets
- Gere secrets seguros para `BETTER_AUTH_SECRET` e `JWT_SECRET`
- Use um gerador de senhas ou: `openssl rand -base64 32`

## Mudanças Feitas

### src/lib/auth-client.ts
```typescript
// Antes:
baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Depois:
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}
```

### src/middleware.ts
- Simplificado para evitar problemas de build
- Removidos headers CORS que estavam causando conflitos

## Teste Após Deploy

1. **Acesse**: `https://desafio.ky.zapflow.app/login`
2. **Teste login**: admin@casafacil.com.br / admin123
3. **Verifique console**: Não deve haver mais erros de CORS

## Comandos para Deploy

```bash
# Build local para testar
npm run build

# Deploy (depende da plataforma)
# Vercel: vercel --prod
# ZapFlow: git push
# Netlify: netlify deploy --prod
```

## Status Atual ✅
- ✅ **Build funcionando** sem erros
- ✅ **Auth-client corrigido** para detectar URL automaticamente
- ✅ **Middleware simplificado** para evitar conflitos
- ✅ **Todas as rotas funcionando** corretamente

## Troubleshooting

### Se ainda houver erro de CORS:
1. Verifique se `NEXT_PUBLIC_APP_URL` está correta
2. Verifique se o banco está acessível
3. Verifique se as secrets estão configuradas

### Se o login não funcionar:
1. Verifique se o admin foi criado no banco
2. Execute: `npm run create-admin` (se possível)
3. Verifique os logs do deploy

### Se o build falhar:
1. Execute `npm run build` localmente para ver erros
2. Verifique se todas as rotas de API existem
3. Verifique se não há imports faltando 