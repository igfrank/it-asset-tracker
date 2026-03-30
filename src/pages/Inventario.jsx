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

  // ... (mantenha os imports e funções de lógica iguais)

  return (
    <div className="p-10 max-w-7xl mx-auto relative pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Gestão de Inventário</h1>
        <p className="text-slate-500 text-lg mt-2">Controle, organize e distribua ativos com facilidade.</p>
      </header>

      {/* Formulário Elegante */}
      <section className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          ✨ Cadastrar Novo Ativo
        </h2>
        <form onSubmit={handleCadastrar} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nome do Equipamento</label>
            <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Ex: Mouse Logitech M90" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
            <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium cursor-pointer">
              <option value="">Selecione...</option>
              <option value="Periférico">🖱️ Periférico</option>
              <option value="Computador">💻 Computador</option>
              <option value="Cabo/Adaptador">🔌 Cabo/Adaptador</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Qtd Inicial</label>
            <div className="flex gap-3">
              <input type="number" min="0" value={novaQtd} onChange={e => setNovaQtd(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium" />
              <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-blue-200">
                🚀
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Grid de Ativos */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Estoque Atual</h2>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none w-64 transition-all shadow-sm"
          />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {itensFiltrados.map(item => {
          const noCarrinho = carrinho.find(c => c.id === item.id);
          return (
            <div key={item.id} className={`bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border transition-all duration-500 relative group ${noCarrinho ? 'border-blue-200 ring-4 ring-blue-500/5' : 'border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1'}`}>
              
              <button onClick={() => handleExcluir(item.id, item.nome)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </button>

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 ${item.quantidade === 0 ? 'bg-rose-100' : 'bg-slate-100'}`}>
                {item.categoria === 'Computador' ? '💻' : item.categoria === 'Periférico' ? '🖱️' : '🔌'}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{item.nome}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{item.categoria}</p>
              
              <div className="flex items-end gap-2 mb-8">
                <span className={`text-5xl font-black leading-none ${item.quantidade === 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                  {item.quantidade}
                </span>
                <span className="text-slate-400 font-bold pb-1 underline decoration-slate-200 decoration-4 underline-offset-4">em estoque</span>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => handleEntrada(item.id, item.nome)} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-100 transition-colors flex-shrink-0">
                  +
                </button>
                
                {!noCarrinho ? (
                  <button 
                    onClick={() => adicionarAoCarrinho(item)}
                    disabled={item.quantidade === 0}
                    className="flex-1 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 disabled:opacity-30 transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200"
                  >
                    Adicionar Saída
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-blue-600 text-white rounded-2xl overflow-hidden shadow-lg shadow-blue-200">
                    <button onClick={() => alterarQuantidadeCarrinho(item.id, -1, item.quantidade)} className="w-10 h-full hover:bg-white/10 transition-colors font-bold text-xl">-</button>
                    <span className="font-bold">{noCarrinho.quantidadeSelecionada}</span>
                    <button onClick={() => alterarQuantidadeCarrinho(item.id, 1, item.quantidade)} className="w-10 h-full hover:bg-white/10 transition-colors font-bold text-xl">+</button>
                    <button onClick={() => removerDoCarrinho(item.id)} className="w-10 h-full bg-blue-700 hover:bg-rose-500 transition-colors flex items-center justify-center">×</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Botão Flutuante Pulsante */}
      {carrinho.length > 0 && (
        <div className="fixed bottom-12 right-12 z-40">
          <button 
            onClick={abrirModal}
            className="flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all group"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">🛒</span>
            <div className="text-left leading-tight">
              <p className="font-bold">Finalizar Lote</p>
              <p className="text-[10px] uppercase font-black text-blue-300 tracking-tighter">{totalItensCarrinho} Itens selecionados</p>
            </div>
          </button>
        </div>
      )}

      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)} onConfirm={confirmarSaida} carrinho={carrinho} setCarrinho={setCarrinho} nomeColaborador={nomeColaborador} setNomeColaborador={setNomeColaborador} />
    </div>
  );
}