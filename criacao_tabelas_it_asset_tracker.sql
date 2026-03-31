-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS it_asset_tracker;
USE it_asset_tracker;

-- 2. Tabela de Usuários (Membros da equipe de TI)
-- Referência: src/backend/main.py (rotas /usuarios e /login)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);

-- 3. Tabela de Equipamentos / Ativos
-- Referência: src/backend/main.py e src/pages/Inventario.jsx
CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria ENUM('Periférico', 'Computador', 'Cabo/Adaptador') NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE, -- Controle para Soft Delete
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Histórico (Movimentações/Auditoria)
-- Referência: src/backend/main.py e src/pages/Historico.jsx
CREATE TABLE IF NOT EXISTS movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Snapshots para preservar dados mesmo se o item for deletado
    item_nome_snapshot VARCHAR(150) NOT NULL, 
    usuario_nome_snapshot VARCHAR(100) NOT NULL, -- Colaborador que recebeu/entregou
    responsavel_ti_snapshot VARCHAR(100) NOT NULL, -- Técnico da TI logado
    tipo_acao ENUM('Entrada', 'Saída', 'Cadastro', 'Exclusão de Cadastro') NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inserção de dados iniciais para teste (Opcional)
-- Ajuste conforme necessário para o seu primeiro acesso
INSERT INTO usuarios (nome, username, senha) VALUES 
('Igor Franklin', 'igor.almeida', 'admin123');