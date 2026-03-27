import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Historico from './pages/Historico';

// O Menu Lateral (Sidebar) ou Superior (Navbar)
function Navbar() {
  return (
    <nav className="bg-slate-900 text-white w-64 min-h-screen p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-blue-400 mb-8">IT Asset Tracker</h2>
      
      <Link to="/" className="hover:bg-slate-800 p-3 rounded-lg transition-colors">📊 Dashboard</Link>
      <Link to="/inventario" className="hover:bg-slate-800 p-3 rounded-lg transition-colors">💻 Inventário</Link>
      <Link to="/historico" className="hover:bg-slate-800 p-3 rounded-lg transition-colors">🕒 Histórico</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Layout Principal: Menu na esquerda, Conteúdo na direita */}
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Navbar />
        
        {/* A área onde as páginas vão aparecer */}
        <main className="flex-1 overflow-y-auto">
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