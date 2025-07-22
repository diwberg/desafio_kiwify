#!/bin/bash

# Script para configurar Better Auth e atualizar .env
echo "🔐 Configurando Better Auth para CasaFácil..."

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Por favor, execute primeiro: ./scripts/setup-postgres.sh"
    exit 1
fi

# Backup do .env atual
cp .env .env.backup.auth
echo "✅ Backup do .env criado (.env.backup.auth)"

# Adicionar/atualizar BETTER_AUTH_SECRET
if grep -q "BETTER_AUTH_SECRET=" .env; then
    echo "ℹ️  BETTER_AUTH_SECRET já existe no .env"
else
    echo "" >> .env
    echo "# Better Auth" >> .env
    echo "BETTER_AUTH_SECRET=sua-chave-secreta-mude-em-producao" >> .env
    echo "✅ BETTER_AUTH_SECRET adicionada ao .env"
fi

# Remover variáveis da autenticação simples se existirem
if grep -q "JWT_SECRET=" .env; then
    sed -i.bak '/^JWT_SECRET=/d' .env && rm -f .env.bak
    echo "🗑️  JWT_SECRET removida (não mais necessária)"
fi

echo ""
echo "📋 Configuração atual do .env:"
echo "================================"
grep -E "(DATABASE_URL|NEXT_PUBLIC_URL|ADMIN_|BETTER_AUTH_)" .env || echo "Nenhuma configuração encontrada"
echo "================================"

echo ""
echo "🔧 Próximos passos:"
echo "1. Executar migrações (se necessário): npx prisma migrate dev"
echo "2. Criar usuário admin: npx tsx src/scripts/create-admin-better-auth.ts"
echo "3. Testar login: http://localhost:3000/login"
echo ""
echo "🔐 Better Auth configurado com sucesso!" 