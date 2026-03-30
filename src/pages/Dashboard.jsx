import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssets, getLogs } from '../utils/storage';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [logs, setLogs] = useState([]);

  // Carrega os dados sempre que a página for acessada
  useEffect(() => {
    setAssets(getAssets());
    setLogs(getLogs());
  }, []);

  // --- CÁLCULOS MATEMÁTICOS PARA O DASHBOARD ---
  
  // 1. Quantos tipos diferentes de equipamentos existem?
  const totalTipos = assets.length;
  
  // 2. Qual o volume total de itens físicos guardados no armário?
  const volumeTotal = assets.reduce((acumulador, item) => acumulador + item.quantidade, 0);
  
  // 3. Quais itens estão com estoque zerado? (Filtro de Alerta)
  const itensZerados = assets.filter(item => item.quantidade === 0);
  
  // 4. Pega apenas as 5 movimentações mais recentes
  const ultimosLogs = logs.slice(0, 5);

  // 5. Conta quantas saídas totais já foram feitas (para estatística)
  const totalSaidas = logs.filter(log => log.acao === 'Saída').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Bem-vindo ao painel de controle do IT Asset Tracker.</p>
      </header>

      {/* --- CARDS DE INDICADORES (KPIs) --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            💻
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Tipos de Itens</p>
            <p className="text-3xl font-black text-slate-800">{totalTipos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            📦
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Volume em Estoque</p>
            <p className="text-3xl font-black text-slate-800">{volumeTotal}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
            🤝
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total de Empréstimos</p>
            <p className="text-3xl font-black text-slate-800">{totalSaidas}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-4 relative overflow-hidden">
          {/* Efeito de borda vermelha se houver itens zerados */}
          {itensZerados.length > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
          
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${itensZerados.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            ⚠️
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Itens em Falta</p>
            <p className={`text-3xl font-black ${itensZerados.length > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {itensZerados.length}
            </p>
          </div>
        </div>
      </section>

      {/* --- ÁREA INFERIOR: ALERTAS E ATIVIDADE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: Alertas de Estoque (Ocupa 1 coluna) */}
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
                <p className="text-slate-500 mt-3 text-sm font-medium">Estoque saudável! Nenhum item em falta no momento.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {itensZerados.map(item => (
                  <li key={item.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <div>
                      <p className="font-bold text-rose-900 text-sm">{item.nome}</p>
                      <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold mt-0.5">{item.categoria}</p>
                    </div>
                    <Link to="/inventario" className="text-xs bg-white text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 font-bold hover:bg-rose-600 hover:text-white transition-colors">
                      Repor
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: Atividade Recente (Ocupa 2 colunas) */}
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
                    
                    {/* Ícone de Ação Baseado no Tipo */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.acao === 'Saída' ? 'bg-rose-100 text-rose-600' :
                      log.acao === 'Entrada' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {log.acao === 'Saída' ? '📤' : log.acao === 'Entrada' ? '📥' : '📝'}
                    </div>

                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">
                        <span className="font-bold">{log.usuario}</span> {log.acao === 'Saída' ? 'retirou' : log.acao === 'Entrada' ? 'adicionou' : 'registrou'} <span className="font-bold text-blue-600">{log.itemNome}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{log.data}</p>
                    </div>
                    
                    <div className="hidden sm:block">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {log.acao}
                      </span>
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