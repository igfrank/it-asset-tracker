const API_URL = 'http://localhost:8000';

export const getAssets = async () => {
  const response = await fetch(`${API_URL}/equipamentos`);
  return await response.json();
};

export const getLogs = async () => {
  const response = await fetch(`${API_URL}/logs`);
  return await response.json();
};

// src/utils/storage.js
export const addLog = async (acao, itemNome, estado, usuario, responsavel) => {
  await fetch(`${API_URL}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      acao, 
      itemNome, 
      estado, // Novo campo enviado ao Python
      usuario, 
      responsavel 
    })
  });
};

// Como o banco salva individualmente, esta função agora é apenas um "placeholder" 
// para não quebrar o código antigo do Inventário
export const saveAssets = () => { return; };

// Adicione ao final do seu src/utils/storage.js

export const loginUser = async (username, senha) => {
  const response = await fetch(`http://localhost:8000/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha })
  });
  
  if (!response.ok) throw new Error('Falha no login');
  
  const user = await response.json();
  // Salva os dados do usuário para sabermos quem está usando o sistema
  localStorage.setItem('ti_user', JSON.stringify(user));
  return user;
};

export const getLoggedUser = () => {
  const user = localStorage.getItem('ti_user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('ti_user');
  window.location.href = '/';
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/usuarios`);
  return await response.json();
};

export const createUser = async (user) => {
  await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
};

export const deleteUser = async (id) => {
  await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
};

export const updateUser = async (id, user) => {
  await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
};

