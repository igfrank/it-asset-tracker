// src/utils/storage.js

const ASSETS_KEY = 'ti_assets';
const LOGS_KEY = 'ti_logs';

export const getAssets = () => {
  const data = localStorage.getItem(ASSETS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAssets = (assets) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
};

export const getLogs = () => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

// --- FUNÇÃO CORRIGIDA COM ID ÚNICO ---
export const addLog = (acao, itemNome, usuario) => {
  const logs = getLogs();
  const novoLog = {
    id: crypto.randomUUID(), // <--- MÁGICA AQUI: Gera um código 100% único (Ex: "550e8400-e29b-41d4-a716-446655440000")
    data: new Date().toLocaleString('pt-BR'),
    acao, 
    itemNome,
    usuario: usuario || 'Sistema'
  };
  
  logs.unshift(novoLog); 
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};