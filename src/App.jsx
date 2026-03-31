import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Historico from './pages/Historico';
import Usuarios from './pages/Usuarios'; // Importação da nova página de gestão
import Login from './pages/Login'; 
import { getLoggedUser, logout } from './utils/storage';

function Navbar() {
  const location = useLocation();
  const user = getLoggedUser(); // Pega os dados de quem está logado
  
  const menuItems = [
    { path: '/', label: 'Visão Geral', icon: '📊' },
    { path: '/inventario', label: 'Inventário', icon: '📦' },
    { path: '/historico', label: 'Histórico', icon: '🕒' },
    { path: '/usuarios', label: 'Usuários', icon: '👤' } // Novo item adicionado ao menu
  ];

  return (
    <nav className="w-72 bg-white border-r border-slate-200 min-h-screen p-8 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <span className="text-white font-bold text-xl">IT</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">AssetTracker</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                active 
                ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-semibold">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-4">
        {/* Mostra quem está logado e botão de Sair */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Usuário Logado</p>
          <p className="text-sm font-semibold text-slate-600 mb-2">{user?.nome}</p>
          <button 
            onClick={logout}
            className="text-xs text-rose-500 font-bold hover:text-rose-700 flex items-center gap-1"
          >
            🚪 Encerrar Sessão
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  // Estado que controla se o usuário está logado
  const [user, setUser] = useState(getLoggedUser());

  // Se NÃO houver usuário, renderiza apenas o componente de Login
  if (!user) {
    return <Login onLoginSuccess={() => setUser(getLoggedUser())} />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto max-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/usuarios" element={<Usuarios />} /> {/* Nova rota registrada */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}