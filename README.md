# 💻 IT Asset Tracker - Gestão de Ativos TI

## 📌 Sobre o Projeto
O **IT Asset Tracker** é uma aplicação Full Stack desenvolvida para centralizar e organizar o controle de equipamentos de TI. Este projeto nasceu de uma necessidade real de gestão de ativos em pequenos escritórios, unindo a prática profissional ao aprimoramento de habilidades em desenvolvimento de software.

A aplicação permite o controle básico de entradas e saídas de periféricos, computadores e cabos, garantindo que cada movimentação seja auditada com o registro do responsável técnico e do colaborador recebedor.

---

## 🚀 Funcionalidades Principais

* **Painel de Controle (Dashboard):** Visão geral em tempo real do volume de itens em estoque, tipos de ativos cadastrados e alertas críticos para itens esgotados.
* **Gestão de Inventário:** Cadastro, edição e exclusão (*soft delete*) de equipamentos com interface intuitiva e responsiva.
* **Carrinho de Saída & Termos:** Sistema de lote para retirada de múltiplos itens, com geração automática de Termo de Responsabilidade para impressão.
* **Histórico de Auditoria Detalhado:** Rastreabilidade total. Cada ação registra quem entregou (membro da TI logado) e quem recebeu o equipamento.
* **Controle de Acesso:** Área restrita para membros da equipe de TI com sistema de login e gerenciamento de usuários integrado ao banco de dados.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React + Vite:** Estrutura rápida e moderna para a interface.
* **Tailwind CSS:** Estilização utilitária para um design limpo e elegante.
* **React Router:** Navegação entre páginas sem recarregamento.

### Backend
* **FastAPI (Python):** API de alta performance para processamento dos dados.
* **MySQL:** Banco de dados relacional para persistência segura das informações.
* **Uvicorn:** Servidor ASGI para rodar a aplicação Python.

---

## 📂 Estrutura do Banco de Dados
O sistema utiliza três tabelas principais no MySQL:

1.  **`equipamentos`**: Armazena os nomes, categorias e quantidades atuais.
2.  **`usuarios`**: Gerencia as credenciais dos técnicos de TI da Muito Mais.
3.  **`movimentacoes`**: O "coração" da auditoria, salvando *snapshots* de cada transação para histórico permanente.

---