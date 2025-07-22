-- Script de inicialização do PostgreSQL para CasaFácil
-- Este script é executado automaticamente quando o container é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Criar usuário adicional se necessário (opcional)
-- CREATE USER casafacil_app WITH ENCRYPTED PASSWORD 'app_password';
-- GRANT ALL PRIVILEGES ON DATABASE casafacil_db TO casafacil_app; 