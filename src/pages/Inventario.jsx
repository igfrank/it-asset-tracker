import { useState, useEffect } from 'react';
import { getAssets, addLog, getLoggedUser } from '../utils/storage'; 
import Modal from '../components/Modal'; 

export default function Inventario() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuarioTI = getLoggedUser();

  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novaQtd, setNovaQtd] = useState('');
  const [busca, setBusca] = useState('');

  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeColaborador, setNomeColaborador] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await getAssets();
      setItens(dados);
    } catch (error) {
      console.error("Erro ao carregar inventário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    if (!novoNome || !novaCategoria || !novaQtd) return alert("Preencha todos os campos!");
    
    const novoItem = { 
      nome: novoNome, 
      categoria: novaCategoria, 
      quantidade: parseInt(novaQtd) 
    };

    try {
      await fetch('http://localhost:8000/equipamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem)
      });

      // REGISTRO DE AUDITORIA: Substituído "Sistema" pelo seu nome
      await addLog("Cadastro", novoNome, usuarioTI.nome, usuarioTI.nome);
      
      setNovoNome(''); setNovaCategoria(''); setNovaQtd('');
      await carregarDados();
    } catch (error) {
      alert("Erro ao cadastrar no banco de dados.");
    }
  };

  const handleEntrada = async (id, nomeAtual, qtdAtual) => {
    const qtdAdd = parseInt(prompt(`Quantos(as) "${nomeAtual}" chegaram?`));
    if (!qtdAdd || qtdAdd <= 0) return;

    try {
      await fetch(`http://localhost:8000/equipamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: qtdAtual + qtdAdd })
      });

      // REGISTRO DE AUDITORIA: Substituído "Sistema" pelo seu nome
      await addLog("Entrada", `${qtdAdd}x ${nomeAtual}`, usuarioTI.nome, usuarioTI.nome);
      await carregarDados();
    } catch (error) {
      alert("Erro ao atualizar estoque.");
    }
  };

  const handleExcluir = async (id, nomeAtual) => {
    const confirmacao = window.confirm(`Deseja excluir "${nomeAtual}" do sistema?`);
    if (!confirmacao) return;

    try {
      await fetch(`http://localhost:8000/equipamentos/${id}`, {
        method: 'DELETE'
      });

      // REGISTRO DE AUDITORIA: Substituído "Sistema" pelo seu nome
      await addLog("Exclusão de Cadastro", nomeAtual, usuarioTI.nome, usuarioTI.nome);
      setCarrinho(carrinho.filter(c => c.id !== id));
      await carregarDados();
    } catch (error) {
      alert("Erro ao excluir item.");
    }
  };

  const confirmarSaida = async (e) => {
    e.preventDefault();
    if (!nomeColaborador || carrinho.length === 0) return alert("Verifique os dados.");

    try {
      for (const item of carrinho) {
        await fetch(`http://localhost:8000/equipamentos/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantidade: item.estoqueMaximo - item.quantidadeSelecionada })
        });
        
        // No log de saída: Registra quem recebeu e quem entregou (Responsável TI)
        await addLog("Saída", `${item.quantidadeSelecionada}x ${item.nome}`, nomeColaborador, usuarioTI.nome);
      }

      gerarTermo(carrinho, nomeColaborador); 
      setCarrinho([]); 
      setModalAberto(false);
      await carregarDados();
    } catch (error) {
      alert("Erro ao processar saída.");
    }
  };

  // Funções de suporte (Carrinho e Interface)
  const adicionarAoCarrinho = (item) => {
    const itemExistente = carrinho.find(c => c.id === item.id);
    if (itemExistente) {
      if (itemExistente.quantidadeSelecionada < item.quantidade) {
        setCarrinho(carrinho.map(c => c.id === item.id ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada + 1 } : c));
      } else { alert("Estoque máximo atingido!"); }
    } else {
      setCarrinho([...carrinho, { ...item, quantidadeSelecionada: 1, estoqueMaximo: item.quantidade }]);
    }
  };

  const alterarQuantidadeCarrinho = (id, delta, quantidadeMax) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQtd = item.quantidadeSelecionada + delta;
        if (novaQtd >= 1 && novaQtd <= quantidadeMax) return { ...item, quantidadeSelecionada: novaQtd };
      }
      return item;
    }));
  };

  const removerDoCarrinho = (id) => setCarrinho(carrinho.filter(c => c.id !== id));
  const abrirModal = () => { setNomeColaborador(''); setModalAberto(true); };
  const gerarTermo = (itensDoCarrinho, usuario) => {
    const janela = window.open('', '', 'width=800,height=600');
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const listaHTML = itensDoCarrinho.map(item => `<li><strong>${item.nome}</strong> - ${item.quantidadeSelecionada} unid.</li>`).join('');
    janela.document.write(`<      <html><head><title>Termo de Entrega</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6}h2{text-align:center;border-bottom:2px solid #000;padding-bottom:10px}.signature{margin-top:80px;text-align:center}ul{margin-top:20px;margin-bottom:20px;padding-left:20px;}</style></head>
      <body>
        <h2>TERMO DE RESPONSABILIDADE E ENTREGA</h2>
        <p>Eu, <strong>${usuario}</strong>, recebi do departamento de TI os seguintes equipamentos em perfeitas condições de uso:</p>
        
        <ul>
          ${listaHTML}
        </ul>
        
        <p>Comprometo-me a zelar pela conservação dos equipamentos listados acima e a devolvê-los quando solicitado ou no momento de meu desligamento da empresa.</p>
        <p>Data: <strong>${dataHoje}</strong></p>
        <div class="signature">_______________________________________<br>Assinatura (${usuario})</div>
      </body></html>`);
    janela.document.close(); 
    setTimeout(() => { janela.focus(); janela.print(); }, 250);
  };
  const itensFiltrados = itens.filter(item => {
    const termo = busca.toLowerCase();
    return item.nome.toLowerCase().includes(termo) || item.categoria.toLowerCase().includes(termo);
  });
  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidadeSelecionada, 0);

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Carregando estoque...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto relative pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Gestão de Inventário</h1>
        <p className="text-slate-500 text-lg mt-2">Bem-vindo, <b>{usuarioTI.nome}</b>. Seus registros serão auditados.</p>
      </header>

      {/* Cadastro */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-12">
        <h2 className="text-xl font-bold mb-6 text-slate-800">✨ Cadastrar Novo Ativo</h2>
        <form onSubmit={handleCadastrar} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nome</label>
            <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Categoria</label>
            <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl outline-none">
              <option value="">Selecione...</option>
              <option value="Periférico">🖱️ Periférico</option>
              <option value="Computador">💻 Computador</option>
              <option value="Cabo/Adaptador">🔌 Cabo/Adaptador</option>
            </select>
          </div>
          <div className="flex gap-3">
            <input type="number" value={novaQtd} onChange={e => setNovaQtd(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
            <button type="submit" className="bg-slate-900 text-white p-4 rounded-2xl">🚀</button>
          </div>
        </form>
      </section>

      {/* Busca e Lista */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Estoque Atual</h2>
        <input type="text" placeholder="Pesquisar..." value={busca} onChange={e => setBusca(e.target.value)} className="p-3 border border-slate-200 rounded-2xl outline-none w-64" />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {itensFiltrados.map(item => {
          const noCarrinho = carrinho.find(c => c.id === item.id);
          return (
            <div key={item.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all ${noCarrinho ? 'border-blue-200 ring-4 ring-blue-50/5' : 'border-transparent'}`}>
              <button onClick={() => handleExcluir(item.id, item.nome)} className="float-right text-slate-300 hover:text-rose-500">🗑️</button>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl mb-6">
                {item.categoria === 'Computador' ? '💻' : item.categoria === 'Periférico' ? '🖱️' : '🔌'}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{item.nome}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase mb-6">{item.categoria}</p>
              <div className="flex items-end gap-2 mb-8">
                <span className={`text-5xl font-black ${item.quantidade === 0 ? 'text-rose-500' : 'text-slate-800'}`}>{item.quantidade}</span>
                <span className="text-slate-400 font-bold">em estoque</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEntrada(item.id, item.nome, item.quantidade)} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold">+</button>
                {!noCarrinho ? (
                  <button onClick={() => adicionarAoCarrinho(item)} disabled={item.quantidade === 0} className="flex-1 bg-slate-900 text-white rounded-2xl font-bold">Adicionar Saída</button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-blue-600 text-white rounded-2xl overflow-hidden">
                    <button onClick={() => alterarQuantidadeCarrinho(item.id, -1, item.quantidade)} className="w-10 h-full font-bold">-</button>
                    <span className="font-bold">{noCarrinho.quantidadeSelecionada}</span>
                    <button onClick={() => alterarQuantidadeCarrinho(item.id, 1, item.quantidade)} className="w-10 h-full font-bold">+</button>
                    <button onClick={() => removerDoCarrinho(item.id)} className="w-10 h-full bg-blue-700">×</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {carrinho.length > 0 && (
        <div className="fixed bottom-12 right-12">
          <button onClick={abrirModal} className="flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-xl hover:bg-blue-600 transition-all">
            <span>🛒</span>
            <div className="text-left">
              <p className="font-bold">Finalizar Lote</p>
              <p className="text-[10px] uppercase font-black text-blue-300">{totalItensCarrinho} Itens</p>
            </div>
          </button>
        </div>
      )}

      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)} onConfirm={confirmarSaida} carrinho={carrinho} setCarrinho={setCarrinho} nomeColaborador={nomeColaborador} setNomeColaborador={setNomeColaborador} />
    </div>
  );
}