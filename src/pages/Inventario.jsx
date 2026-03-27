import { useState, useEffect } from 'react';
import { getAssets, saveAssets, addLog } from '../utils/storage'; // Importando nosso "banco de dados"

export default function Inventario() {
  // Estado que carrega os itens salvos no LocalStorage
  const [itens, setItens] = useState(getAssets());

  // Estados para o formulário de NOVO item
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novaQtd, setNovaQtd] = useState('');

  // Sempre que a lista 'itens' mudar, salva no LocalStorage automaticamente
  useEffect(() => {
    saveAssets(itens);
  }, [itens]);

  // --- Função 1: CADASTRAR NOVO ITEM ---
  const handleCadastrar = (e) => {
    e.preventDefault(); // Evita que a página recarregue
    if (!novoNome || !novaCategoria || !novaQtd) return alert("Preencha todos os campos!");

    const novoItem = {
      id: Date.now(),
      nome: novoNome,
      categoria: novaCategoria,
      quantidade: parseInt(novaQtd) // Garante que é um número e não um texto
    };

    setItens([...itens, novoItem]); // Adiciona na lista
    addLog("Cadastro", novoNome, "Sistema"); // Salva no Histórico

    // Limpa os campos
    setNovoNome(''); setNovaCategoria(''); setNovaQtd('');
  };

  // --- Função 2: ENTRADA (Aumentar Estoque) ---
  const handleEntrada = (id, nomeAtual) => {
    const qtdAdd = parseInt(prompt(`Quantos(as) "${nomeAtual}" chegaram?`));
    if (!qtdAdd || qtdAdd <= 0) return;

    setItens(itens.map(item => 
      item.id === id ? { ...item, quantidade: item.quantidade + qtdAdd } : item
    ));
    addLog("Entrada", `${qtdAdd}x ${nomeAtual}`, "Sistema");
  };

  // --- Função 3: SAÍDA (Com geração de documento) ---
  const handleSaida = (id, nomeAtual, qtdAtual) => {
    const usuario = prompt(`Para quem você está entregando "${nomeAtual}"?`);
    if (!usuario) return; // Se cancelar ou deixar em branco, para por aqui

    const qtdSaida = parseInt(prompt(`Qual a quantidade de "${nomeAtual}" para ${usuario}?`));
    if (!qtdSaida || qtdSaida <= 0) return;
    if (qtdSaida > qtdAtual) return alert("Erro: Quantidade solicitada é maior que o estoque!");

    // Atualiza o estoque diminuindo a quantidade
    setItens(itens.map(item => 
      item.id === id ? { ...item, quantidade: item.quantidade - qtdSaida } : item
    ));
    addLog("Saída", `${qtdSaida}x ${nomeAtual}`, usuario);

    // GERA O DOCUMENTO PARA ASSINATURA
    gerarTermo(nomeAtual, qtdSaida, usuario);
  };

  // --- Função Mágica: GERAR TERMO PARA IMPRESSÃO ---
  const gerarTermo = (itemNome, qtd, usuario) => {
    // Abre uma nova aba em branco
    const janela = window.open('', '', 'width=800,height=600');
    
    // Escreve um HTML simples e formal dentro dessa nova aba
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    janela.document.write(`
      <html>
        <head>
          <title>Termo de Entrega - ${usuario}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            h2 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .content { margin-top: 30px; }
            .signature { margin-top: 80px; text-align: center; }
          </style>
        </head>
        <body>
          <h2>TERMO DE RESPONSABILIDADE E ENTREGA DE EQUIPAMENTO</h2>
          <div class="content">
            <p>Eu, <strong>${usuario}</strong>, declaro ter recebido do departamento de TI da empresa, em perfeitas condições de uso, o(s) seguinte(s) equipamento(s):</p>
            <ul>
              <li><strong>Descrição do Item:</strong> ${itemNome}</li>
              <li><strong>Quantidade Entregue:</strong> ${qtd} unidade(s)</li>
            </ul>
            <p>Comprometo-me a zelar pela conservação do(s) equipamento(s) e a devolvê-lo(s) quando solicitado ou no momento de meu desligamento da empresa.</p>
            <p>Data de entrega: <strong>${dataHoje}</strong></p>
          </div>
          <div class="signature">
            ___________________________________________________________<br>
            Assinatura do Colaborador (${usuario})
          </div>
        </body>
      </html>
    `);
    janela.document.close(); // Termina de escrever o HTML
    janela.focus();
    janela.print(); // Chama a tela de impressão do Windows automaticamente
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Gestão de Inventário</h1>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Cadastrar Novo Item</h2>
        <form onSubmit={handleCadastrar} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Equipamento</label>
            <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Ex: Teclado sem fio" />
          </div>
          <div className="w-1/4">
            <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
            <select value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
              <option value="">Selecione...</option>
              <option value="Periférico">Periférico</option>
              <option value="Computador">Computador</option>
              <option value="Cabo/Adaptador">Cabo/Adaptador</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-slate-600 mb-1">Qtd Inicial</label>
            <input type="number" min="0" value={novaQtd} onChange={e => setNovaQtd(e.target.value)} className="w-full border p-2 rounded-lg" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors h-[42px]">
            Cadastrar
          </button>
        </form>
      </div>

      {/* --- LISTA DE ITENS (GRID) --- */}
      <h2 className="text-xl font-bold mb-4 text-slate-700">Estoque Atual</h2>
      {itens.length === 0 ? (
        <p className="text-slate-500 italic">Nenhum item cadastrado ainda. Use o formulário acima.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itens.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">{item.categoria}</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2 mb-1">{item.nome}</h3>
                <p className="text-3xl font-black text-blue-600 mb-4">{item.quantidade} <span className="text-sm text-slate-400 font-normal">em estoque</span></p>
              </div>
              
              <div className="flex gap-2 border-t pt-4">
                <button 
                  onClick={() => handleEntrada(item.id, item.nome)}
                  className="flex-1 bg-green-50 text-green-700 font-bold py-2 rounded border border-green-200 hover:bg-green-100 transition"
                >
                  + Entrada
                </button>
                <button 
                  onClick={() => handleSaida(item.id, item.nome, item.quantidade)}
                  disabled={item.quantidade === 0} // Desabilita se não tiver estoque
                  className="flex-1 bg-amber-50 text-amber-700 font-bold py-2 rounded border border-amber-200 hover:bg-amber-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  - Saída (Gerar Termo)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}