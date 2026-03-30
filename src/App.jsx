import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Historico from './pages/Historico';

function Navbar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Visão Geral', icon: 'grid_view' }, // Usando representação de ícones
    { path: '/inventario', label: 'Inventário', icon: 'inventory_2' },
    { path: '/historico', label: 'Histórico', icon: 'history' }
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
                {item.path === '/' ? '📊' : item.path === '/inventario' ? '📦' : '🕒'}
              </span>
              <span className="font-semibold">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status do Sistema</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-slate-600">Online Local</p>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto max-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/historico" element={<Historico />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}