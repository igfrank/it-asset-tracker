import { useState, useEffect } from 'react';
import { getLogs } from '../utils/storage';

export default function Historico() {
  const [logs, setLogs] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroAcao, setFiltroAcao] = useState('Todas');

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const logsFiltrados = logs.filter(log => {
    const termo = busca.toLowerCase();
    
    // Validação de segurança extra para evitar erros se algum campo estiver vazio no localStorage
    const nome = log.itemNome ? log.itemNome.toLowerCase() : '';
    const usuario = log.usuario ? log.usuario.toLowerCase() : '';
    const acao = log.acao ? log.acao.toLowerCase() : '';
    const data = log.data ? log.data.toLowerCase() : '';

    const matchBusca = 
      nome.includes(termo) ||
      usuario.includes(termo) ||
      acao.includes(termo) ||
      data.includes(termo);
    
    const matchAcao = filtroAcao === 'Todas' || log.acao === filtroAcao;

    return matchBusca && matchAcao;
  });

  const getBadgeColor = (acao) => {
    switch (acao) {
      case 'Saída': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Entrada': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cadastro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Exclusão de Cadastro': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const opcoesFiltro = ['Todas', 'Entrada', 'Saída', 'Cadastro', 'Exclusão de Cadastro'];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Histórico de Movimentações</h1>
          <p className="text-slate-500 mt-1">Registro completo de auditoria de entradas e saídas.</p>
        </div>
        
        <div className="w-full md:w-80">
          <input 
            type="text" 
            placeholder="Buscar por item, pessoa ou data..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {opcoesFiltro.map(opcao => (
          <button
            key={opcao}
            onClick={() => setFiltroAcao(opcao)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filtroAcao === opcao 
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opcao}
          </button>
        ))}
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">📭</span>
            <p className="text-slate-500 mt-4 font-medium">Nenhuma movimentação registrada ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Data e Hora</th>
                  <th className="p-4 font-semibold">Ação</th>
                  <th className="p-4 font-semibold">Equipamento</th>
                  <th className="p-4 font-semibold">Colaborador / Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logsFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500 italic">
                      Nenhum registro encontrado para a busca "{busca}".
                    </td>
                  </tr>
                ) : (
                  // A MÁGICA ESTÁ AQUI: index foi adicionado para gerar uma chave única mesmo nos erros passados
                  logsFiltrados.map((log, index) => (
                    <tr key={`${log.id}-${index}`} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-sm text-slate-500">
                        {log.data}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeColor(log.acao)}`}>
                          {log.acao}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {log.itemNome}
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className={log.usuario === 'Sistema' ? 'text-slate-400 italic' : 'font-semibold text-slate-700'}>
                          {log.usuario}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}