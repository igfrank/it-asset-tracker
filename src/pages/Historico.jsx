import { useState, useEffect } from 'react';
import { getLogs } from '../utils/storage';

export default function Historico() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

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

  const logsFiltrados = logs.filter(log => {
    const termo = busca.toLowerCase();
    return (
      log.item_nome_snapshot?.toLowerCase().includes(termo) ||
      log.usuario_nome_snapshot?.toLowerCase().includes(termo) ||
      log.responsavel_ti_snapshot?.toLowerCase().includes(termo)
    );
  });

  if (loading) return <div className="p-10 text-center font-bold">Carregando...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Histórico de Auditoria</h1>
          <p className="text-slate-500">Rastreabilidade total de quem entregou e quem recebeu.</p>
        </div>
        <input 
          type="text" placeholder="Pesquisar..." 
          className="border p-2.5 rounded-lg w-80 outline-none focus:ring-2 focus:ring-blue-500"
          value={busca} onChange={e => setBusca(e.target.value)}
        />
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Data/Hora</th>
              <th className="p-4">Ação</th>
              <th className="p-4">Equipamento</th>
              <th className="p-4">Responsável TI (Entregou)</th>
              <th className="p-4">Destino/Colaborador (Recebeu)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logsFiltrados.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-500">
                  {new Date(log.data_movimentacao).toLocaleString('pt-BR')}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {log.tipo_acao}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-800">{log.item_nome_snapshot}</td>
                <td className="p-4 text-sm font-bold text-blue-700">{log.responsavel_ti_snapshot}</td>
                <td className="p-4 text-sm italic text-slate-600">{log.usuario_nome_snapshot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}