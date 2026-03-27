import { useState, useEffect } from 'react';
import { getAssets, saveAssets, addLog } from '../utils/storage'; 
import Modal from '../components/Modal'; 

export default function Inventario() {
  const [itens, setItens] = useState(getAssets());
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novaQtd, setNovaQtd] = useState('');
  const [busca, setBusca] = useState('');

  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeColaborador, setNomeColaborador] = useState('');

  useEffect(() => { saveAssets(itens); }, [itens]);

  const handleCadastrar = (e) => {
    e.preventDefault();
    if (!novoNome || !novaCategoria || !novaQtd) return alert("Preencha todos os campos!");
    const novoItem = { id: Date.now(), nome: novoNome, categoria: novaCategoria, quantidade: parseInt(novaQtd) };
    setItens([...itens, novoItem]);
    addLog("Cadastro", novoNome, "Sistema");
    setNovoNome(''); setNovaCategoria(''); setNovaQtd('');
  };

  const handleEntrada = (id, nomeAtual) => {
    const qtdAdd = parseInt(prompt(`Quantos(as) "${nomeAtual}" chegaram?`));
    if (!qtdAdd || qtdAdd <= 0) return;
    setItens(itens.map(item => item.id === id ? { ...item, quantidade: item.quantidade + qtdAdd } : item));
    addLog("Entrada", `${qtdAdd}x ${nomeAtual}`, "Sistema");
  };

  const handleExcluir = (id, nomeAtual) => {
    const confirmacao = window.confirm(`ATENÇÃO: Tem certeza que deseja excluir o cadastro de "${nomeAtual}" do sistema?`);
    if (confirmacao) {
      setItens(itens.filter(item => item.id !== id));
      addLog("Exclusão de Cadastro", nomeAtual, "Sistema");
      setCarrinho(carrinho.filter(c => c.id !== id));
    }
  };

  // --- LÓGICAS DO CARRINHO NA TELA PRINCIPAL ---
  const adicionarAoCarrinho = (item) => {
    const itemExistente = carrinho.find(c => c.id === item.id);
    
    if (itemExistente) {
      if (itemExistente.quantidadeSelecionada < item.quantidade) {
        setCarrinho(carrinho.map(c => 
          c.id === item.id ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada + 1 } : c
        ));
      } else {
        alert("Estoque máximo atingido para este item!");
      }
    } else {
      setCarrinho([...carrinho, { ...item, quantidadeSelecionada: 1, estoqueMaximo: item.quantidade }]);
    }
  };

  // NOVA FUNÇÃO: Aumenta/Diminui a quantidade direto no card
  const alterarQuantidadeCarrinho = (id, delta, quantidadeMax) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQtd = item.quantidadeSelecionada + delta;
        // Garante que não fique menor que 1 nem maior que o estoque disponível
        if (novaQtd >= 1 && novaQtd <= quantidadeMax) {
          return { ...item, quantidadeSelecionada: novaQtd };
        }
      }
      return item;
    }));
  };

  // NOVA FUNÇÃO: Tira o item do carrinho se clicar no X
  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(c => c.id !== id));
  };

  // --- LÓGICAS DE FINALIZAÇÃO ---
  const abrirModal = () => {
    setNomeColaborador('');
    setModalAberto(true);
  };

  const confirmarSaida = (e) => {
    e.preventDefault();
    if (!nomeColaborador) return alert("Por favor, digite o nome do colaborador.");
    if (carrinho.length === 0) return alert("O carrinho está vazio.");

    let novosItens = [...itens];

    carrinho.forEach(itemCarrinho => {
      novosItens = novosItens.map(i => 
        i.id === itemCarrinho.id ? { ...i, quantidade: i.quantidade - itemCarrinho.quantidadeSelecionada } : i
      );
      addLog("Saída", `${itemCarrinho.quantidadeSelecionada}x ${itemCarrinho.nome}`, nomeColaborador);
    });

    setItens(novosItens); 
    gerarTermo(carrinho, nomeColaborador); 
    
    setCarrinho([]); 
    setModalAberto(false);
  };

  const gerarTermo = (itensDoCarrinho, usuario) => {
    const janela = window.open('', '', 'width=800,height=600');
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    
    const listaHTML = itensDoCarrinho.map(item => 
      `<li><strong>${item.nome}</strong> - ${item.quantidadeSelecionada} unidade(s)</li>`
    ).join('');

    janela.document.write(`
      <html><head><title>Termo de Entrega</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6}h2{text-align:center;border-bottom:2px solid #000;padding-bottom:10px}.signature{margin-top:80px;text-align:center}ul{margin-top:20px;margin-bottom:20px;padding-left:20px;}</style></head>
      <body>
        <h2>TERMO DE RESPONSABILIDADE E ENTREGA</h2>
        <p>Eu, <strong>${usuario}</strong>, recebi do departamento de TI os seguintes equipamentos em perfeitas condições de uso:</p>
        
        <ul>
          ${listaHTML}
        </ul>
        
        <p>Comprometo-me a zelar pela conservação dos equipamentos listados acima e a devolvê-los quando solicitado ou no momento de meu desligamento da empresa.</p>
        <p>Data: <strong>${dataHoje}</strong></p>
        <div class="signature">_______________________________________<br>Assinatura (${usuario})</div>
      </body></html>
    `);
    janela.document.close(); 
    setTimeout(() => { janela.focus(); janela.print(); }, 250);
  };

  const itensFiltrados = itens.filter(item => {
    const termoBusca = busca.toLowerCase();
    return item.nome.toLowerCase().includes(termoBusca) || item.categoria.toLowerCase().includes(termoBusca);
  });

  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidadeSelecionada, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto relative pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Inventário</h1>
        <p className="text-slate-500 mt-1">Gerencie os equipamentos disponíveis no setor de TI.</p>
      </header>

      {/* Formulário de Cadastro */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-10">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Novo Equipamento</h2>
        <form onSubmit={handleCadastrar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Item</label>
            <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Mouse Logitech G203" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
            <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all">
              <option value="">Selecione...</option>
              <option value="Periférico">Periférico</option>
              <option value="Computador">Computador</option>
              <option value="Cabo/Adaptador">Cabo/Adaptador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Quantidade</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={novaQtd} onChange={e => setNovaQtd(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 rounded-lg transition-colors">
                +
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Barra de Busca e Título */}
      <section className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-700">Estoque Atual</h2>
        <div className="w-full md:w-72">
          <input 
            type="text" 
            placeholder="Pesquisar item ou categoria..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </section>

      {/* Grid de Equipamentos */}
      <section>
        {itensFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-slate-100 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhum item encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {itensFiltrados.map(item => {
              const noCarrinho = carrinho.find(c => c.id === item.id);
              
              return (
                <div key={item.id} className={`bg-white p-5 rounded-xl shadow-sm border transition-shadow relative group ${noCarrinho ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200 hover:shadow-md'}`}>
                  
                  <button onClick={() => handleExcluir(item.id, item.nome)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors" title="Excluir Cadastro">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>

                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded text-uppercase">{item.categoria}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 pr-6" title={item.nome}>{item.nome}</h3>
                  
                  <div className="flex items-center gap-2 mt-3 mb-5">
                    <span className="text-3xl font-black text-slate-700">{item.quantidade}</span>
                    <span className="text-sm text-slate-400">em estoque</span>
                  </div>
                  
                  {/* --- A MÁGICA DOS BOTÕES ACONTECE AQUI --- */}
                  <div className="flex gap-2 h-10">
                    <button onClick={() => handleEntrada(item.id, item.nome)} className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium rounded-lg hover:bg-emerald-100 transition-colors text-sm">
                      + Entrada
                    </button>
                    
                    {!noCarrinho ? (
                      // Botão Padrão (+ Carrinho)
                      <button 
                        onClick={() => adicionarAoCarrinho(item)}
                        disabled={item.quantidade === 0}
                        className="flex-1 bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-lg hover:bg-slate-100 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + Carrinho
                      </button>
                    ) : (
                      // Controles Rápidos do Carrinho (Aparecem quando o item está selecionado)
                      <div className="flex-1 flex items-center justify-between bg-blue-50 border border-blue-300 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => alterarQuantidadeCarrinho(item.id, -1, item.quantidade)} 
                          className="w-8 h-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors font-bold text-lg"
                        >
                          -
                        </button>
                        
                        <span className="text-blue-800 font-bold text-sm">
                          {noCarrinho.quantidadeSelecionada}
                        </span>
                        
                        <button 
                          onClick={() => alterarQuantidadeCarrinho(item.id, 1, item.quantidade)} 
                          className="w-8 h-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors font-bold text-lg"
                        >
                          +
                        </button>
                        
                        <button 
                          onClick={() => removerDoCarrinho(item.id)} 
                          className="w-8 h-full flex items-center justify-center text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors border-l border-blue-200"
                          title="Remover do Carrinho"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {carrinho.length > 0 && (
        <div className="fixed bottom-8 right-8 animate-in slide-in-from-bottom-5 z-40">
          <button 
            onClick={abrirModal}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl">🛒</span>
            <span className="font-bold">Finalizar Lote</span>
            <span className="bg-white text-blue-700 font-black text-xs px-2.5 py-1 rounded-full ml-1">
              {totalItensCarrinho}
            </span>
          </button>
        </div>
      )}

      <Modal 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        onConfirm={confirmarSaida} 
        carrinho={carrinho}
        setCarrinho={setCarrinho}
        nomeColaborador={nomeColaborador}
        setNomeColaborador={setNomeColaborador}
      />

    </div>
  );
}