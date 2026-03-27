// src/utils/storage.js

const ASSETS_KEY = 'ti_assets';
const LOGS_KEY = 'ti_logs';

// --- Funções para Equipamentos ---
export const getAssets = () => {
  const data = localStorage.getItem(ASSETS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAssets = (assets) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
};

// --- Funções para o Histórico (Logs) ---
export const getLogs = () => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addLog = (acao, itemNome, usuario) => {
  const logs = getLogs();
  const novoLog = {
    id: Date.now(), // Gera um ID único baseado na data
    data: new Date().toLocaleString(),
    acao, // "Emprestou", "Devolveu", "Cadastrou"
    itemNome,
    usuario: usuario || 'Sistema'
  };
  
  logs.unshift(novoLog); // Adiciona no começo da lista
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};