import { useState } from 'react';
import { loginUser } from '../utils/storage';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, senha);
      onLoginSuccess(); // Avisa o App.jsx que o login deu certo
    } catch (err) {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Acesso TI</h2>
        <input 
          type="text" placeholder="Usuário" 
          className="w-full p-4 mb-4 bg-slate-50 rounded-xl outline-none"
          value={username} onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password" placeholder="Senha" 
          className="w-full p-4 mb-6 bg-slate-50 rounded-xl outline-none"
          value={senha} onChange={e => setSenha(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700">
          Entrar
        </button>
      </form>
    </div>
  );
}