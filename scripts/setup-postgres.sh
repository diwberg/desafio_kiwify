#!/bin/bash

# Script para configurar PostgreSQL e atualizar .env
echo "🐘 Configurando PostgreSQL para CasaFácil..."

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Por favor, copie o .env.example para .env primeiro:"
    echo "cp .env.example .env"
    exit 1
fi

# Backup do .env original
cp .env .env.backup
echo "✅ Backup do .env criado (.env.backup)"

# Atualizar DATABASE_URL para PostgreSQL
NEW_DATABASE_URL="postgresql://casafacil_user:casafacil_password@localhost:5432/casafacil_db?schema=public"

# Usar sed para substituir a linha DATABASE_URL
if grep -q "DATABASE_URL=" .env; then
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$NEW_DATABASE_URL\"|" .env
    echo "✅ DATABASE_URL atualizada para PostgreSQL"
else
    echo "DATABASE_URL=\"$NEW_DATABASE_URL\"" >> .env
    echo "✅ DATABASE_URL adicionada ao .env"
fi

# Remover arquivo de backup do sed
rm -f .env.bak

echo ""
echo "📋 Configuração atual do .env:"
echo "================================"
grep -E "(DATABASE_URL|NEXT_PUBLIC_URL|ADMIN_)" .env
echo "================================"

echo ""
echo "🔧 Próximos passos:"
echo "1. Gerar cliente Prisma: npx prisma generate"
echo "2. Executar migrações: npx prisma migrate dev --name init"
echo "3. Verificar tabelas: npx prisma studio"
echo ""
echo "🐘 PostgreSQL configurado com sucesso!" 