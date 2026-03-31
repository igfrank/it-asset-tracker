import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getLogs } from '../utils/storage';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega os dados da API Python sempre que a página for acessada
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        // Agora buscamos os dados de forma assíncrona da API
        const assetsData = await getAssets();
        const logsData = await getLogs();
        setAssets(assetsData);
        setLogs(logsData);
      } catch (error) {
        console.error("Erro ao carregar dados do servidor:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // --- CÁLCULOS PARA O DASHBOARD (Usando os campos do MySQL) ---
  
  const totalTipos = assets.length;
  const volumeTotal = assets.reduce((acc, item) => acc + item.quantidade, 0);
  const itensZerados = assets.filter(item => item.quantidade === 0);
  const ultimosLogs = logs.slice(0, 5);

  // No banco, o campo chama-se 'tipo_acao'
  const totalSaidas = logs.filter(log => log.tipo_acao === 'Saída').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600 font-medium">Conectando ao banco...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Dados em tempo real do banco MySQL.</p>
      </header>

      {/* --- CARDS DE INDICADORES (KPIs) --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">💻</div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Tipos de Itens</p>
            <p className="text-3xl font-black text-slate-800">{totalTipos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">📦</div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Volume em Estoque</p>
            <p className="text-3xl font-black text-slate-800">{volumeTotal}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">🤝</div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total de Saídas</p>
            <p className="text-3xl font-black text-slate-800">{totalSaidas}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-4 relative overflow-hidden">
          {itensZerados.length > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${itensZerados.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>⚠️</div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Itens em Falta</p>
            <p className={`text-3xl font-black ${itensZerados.length > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{itensZerados.length}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA ESQUERDA: Alertas */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-rose-500">🔥</span> Itens Esgotados
            </h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {itensZerados.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl">✅</span>
                <p className="text-slate-500 mt-3 text-sm font-medium">Estoque saudável!</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {itensZerados.map(item => (
                  <li key={item.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <div>
                      <p className="font-bold text-rose-900 text-sm">{item.nome}</p>
                      <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold">{item.categoria}</p>
                    </div>
                    <Link to="/inventario" className="text-xs bg-white text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 font-bold">Repor</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: Atividade Recente */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-blue-500">⚡</span> Atividade Recente
            </h2>
            <Link to="/historico" className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver tudo &rarr;</Link>
          </div>
          <div className="p-0 flex-1">
            {ultimosLogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {ultimosLogs.map(log => (
                  <li key={log.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.tipo_acao === 'Saída' ? 'bg-rose-100 text-rose-600' :
                      log.tipo_acao === 'Entrada' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {log.tipo_acao === 'Saída' ? '📤' : log.tipo_acao === 'Entrada' ? '📥' : '📝'}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">
                        <span className="font-bold">{log.usuario_nome_snapshot}</span> {log.tipo_acao === 'Saída' ? 'retirou' : log.tipo_acao === 'Entrada' ? 'adicionou' : 'registrou'} <span className="font-bold text-blue-600">{log.item_nome_snapshot}</span>
                      </p>
                      {/* Formatando a data que vem do banco */}
                      <p className="text-xs text-slate-400 mt-1">{new Date(log.data_movimentacao).toLocaleString('pt-BR')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}