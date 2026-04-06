import { useState, useEffect } from 'react';
import { getLogs } from '../utils/storage';

export default function Historico() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroAcao, setFiltroAcao] = useState('Todos');

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        setLoading(true);
        const dados = await getLogs();
        setLogs(dados);
      } finally {
        setLoading(false);
      }
    };
    carregarHistorico();
  }, []);

  // Lógica de filtragem combinada (Texto + Tipo de Ação + Estado)
  const logsFiltrados = logs.filter(log => {
    const termo = busca.toLowerCase();
    
    // Verifica se bate com o texto pesquisado em qualquer campo snapshot
    const bateTexto = (
      log.item_nome_snapshot?.toLowerCase().includes(termo) ||
      log.item_estado_snapshot?.toLowerCase().includes(termo) || // Busca por 'novo' ou 'usado'
      log.usuario_nome_snapshot?.toLowerCase().includes(termo) ||
      log.responsavel_ti_snapshot?.toLowerCase().includes(termo)
    );

    const bateTipo = filtroAcao === 'Todos' || log.tipo_acao === filtroAcao;

    return bateTexto && bateTipo;
  });

  if (loading) return <div className="p-10 text-center font-bold">Carregando histórico de auditoria...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Histórico de Auditoria</h1>
          <p className="text-slate-500">Rastreabilidade total de quem entregou, quem recebeu e o estado do ativo.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Dropdown de Filtro por Ação */}
          <select 
            value={filtroAcao}
            onChange={(e) => setFiltroAcao(e.target.value)}
            className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-600 shadow-sm"
          >
            <option value="Todos">Todas as Ações</option>
            <option value="Cadastro">✨ Cadastros</option>
            <option value="Entrada">📥 Entradas</option>
            <option value="Saída">📤 Saídas</option>
            <option value="Exclusão de Cadastro">🗑️ Exclusões</option>
          </select>

          <input 
            type="text" 
            placeholder="Pesquisar equipamento ou colaborador..." 
            className="border p-2.5 rounded-lg w-full sm:w-80 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={busca} 
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Data/Hora</th>
              <th className="p-4">Ação</th>
              <th className="p-4">Equipamento</th>
              <th className="p-4">Responsável TI (Entregou)</th>
              <th className="p-4">Destino/Colaborador (Recebeu)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logsFiltrados.length > 0 ? (
              logsFiltrados.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(log.data_movimentacao).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black border uppercase ${
                      log.tipo_acao === 'Saída' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      log.tipo_acao === 'Entrada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      log.tipo_acao === 'Cadastro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {log.tipo_acao}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-800">{log.item_nome_snapshot}</span>
                      {/* Badge de Estado do Ativo no Histórico */}
                      <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        log.item_estado_snapshot === 'Novo' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {log.item_estado_snapshot}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-700">
                    {log.responsavel_ti_snapshot}
                  </td>
                  <td className="p-4 text-sm italic text-slate-600">
                    {log.usuario_nome_snapshot}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-400 italic">
                  Nenhum registro encontrado para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}