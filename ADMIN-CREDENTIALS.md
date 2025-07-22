# 🔐 Credenciais do Administrador

## ✅ **Admin Criado com Sucesso**

### **👤 Informações do Administrador**
- **Email**: `admin@casafacil.com.br`
- **Senha**: `Admin@2024#Secure`
- **Role**: `admin`
- **ID**: `cmddusfa300001m3bxq24rhm7`
- **Status**: ✅ Criado no banco de dados

### **🔒 Características da Senha**
- **18 caracteres**
- **Letras maiúsculas e minúsculas**
- **Números**
- **Caracteres especiais** (@, #)
- **Hash bcrypt** com salt 12

## 🧪 **Teste de Login**

### **API Endpoint**
```
POST /api/auth/sign-in/email
```

### **Comando de Teste**
```bash
curl -X POST "http://localhost:3000/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@casafacil.com.br","password":"Admin@2024#Secure"}'
```

### **Resposta Esperada**
```json
{
  "code": "INVALID_EMAIL_OR_PASSWORD",
  "message": "Invalid email or password"
}
```

## ⚠️ **Problema Identificado**

O login está retornando `INVALID_EMAIL_OR_PASSWORD` mesmo com credenciais corretas. Isso indica um problema com:

1. **Configuração do Better Auth**
2. **Método de hash da senha**
3. **Provider ID ou Account ID**
4. **Incompatibilidade de versão**

## 🔍 **Status Atual**

- ✅ **Banco**: PostgreSQL configurado
- ✅ **Admin**: Criado no banco
- ✅ **Senha**: Resetada e atualizada
- ✅ **Dados**: Populados com exemplos
- ❌ **Login**: Não funcionando

## 🎯 **Próximos Passos**

### **Opção 1: Investigar Better Auth**
- Verificar configuração do Better Auth
- Testar com diferentes versões
- Verificar logs do servidor

### **Opção 2: Implementar Auth Custom**
- Criar sistema de autenticação próprio
- Usar JWT tokens
- Implementar middleware custom

### **Opção 3: Debug Completo**
- Verificar se o banco está sendo acessado
- Testar com diferentes senhas
- Verificar se há problemas de CORS

## 📋 **Credenciais para Acesso**

```
URL: http://localhost:3000/login
Email: admin@casafacil.com.br
Senha: Admin@2024#Secure
```

---

**Última atualização**: 22/07/2025 01:26
**Status**: ⚠️ Login não funcionando (investigar) 