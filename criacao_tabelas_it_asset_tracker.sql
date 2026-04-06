-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS it_asset_tracker;
USE it_asset_tracker;

-- 2. Tabela de Usuários (Membros da equipe de TI)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);

-- 3. Tabela de Equipamentos / Ativos
-- Adicionado o campo 'estado' para distinguir itens novos de usados
CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria ENUM('Periférico', 'Computador', 'Cabo/Adaptador') NOT NULL,
    estado ENUM('Novo', 'Usado') NOT NULL DEFAULT 'Novo',
    quantidade INT NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE, -- Controle para Soft Delete
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Garante que a combinação de nome e estado seja única para itens ativos
CREATE UNIQUE INDEX idx_nome_estado_unico ON equipamentos (nome, estado);

-- 4. Tabela de Histórico (Movimentações/Auditoria)
-- Adicionado 'item_estado_snapshot' para auditoria precisa
CREATE TABLE IF NOT EXISTS movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_nome_snapshot VARCHAR(150) NOT NULL, 
    item_estado_snapshot ENUM('Novo', 'Usado') NOT NULL,
    usuario_nome_snapshot VARCHAR(100) NOT NULL, -- Colaborador que recebeu/entregou
    responsavel_ti_snapshot VARCHAR(100) NOT NULL, -- Técnico da TI logado
    tipo_acao ENUM('Entrada', 'Saída', 'Cadastro', 'Exclusão de Cadastro') NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inserção de dados iniciais para teste
INSERT INTO usuarios (nome, username, senha) VALUES 
('Igor Franklin', 'igor.almeida', 'admin123');