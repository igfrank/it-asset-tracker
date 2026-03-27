// src/components/Modal.jsx

export default function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  carrinho, 
  setCarrinho, 
  nomeColaborador, 
  setNomeColaborador 
}) {
  if (!isOpen) return null;

  // Aumentar/Diminuir qtd dentro do carrinho
  const alterarQuantidade = (id, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQtd = item.quantidadeSelecionada + delta;
        // Não deixa ficar menor que 1 nem maior que o estoque real
        if (novaQtd >= 1 && novaQtd <= item.estoqueMaximo) {
          return { ...item, quantidadeSelecionada: novaQtd };
        }
      }
      return item;
    }));
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            🛒 Finalizar Saída 
            <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full ml-auto">
              {carrinho?.length || 0} item(s)
            </span>
          </h2>
        </div>
        
        <form onSubmit={onConfirm} className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Nome do Colaborador */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Entregar para (Nome do Colaborador)
            </label>
            <input 
              type="text" 
              autoFocus
              required
              placeholder="Ex: João da Silva"
              value={nomeColaborador}
              onChange={(e) => setNomeColaborador(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Lista de Itens no Carrinho */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Itens Selecionados
            </label>
            <div className="flex flex-col gap-3">
              {!carrinho || carrinho.length === 0 ? (
                <p className="text-sm text-slate-400 italic">O carrinho está vazio.</p>
              ) : (
                carrinho.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1" title={item.nome}>{item.nome}</p>
                      <p className="text-xs text-slate-400">Estoque disp: {item.estoqueMaximo}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Controles de Quantidade */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button type="button" onClick={() => alterarQuantidade(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 shadow-sm">-</button>
                        <span className="w-8 text-center font-bold text-sm text-slate-800">{item.quantidadeSelecionada}</span>
                        <button type="button" onClick={() => alterarQuantidade(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-600 shadow-sm">+</button>
                      </div>
                      
                      {/* Botão Remover */}
                      <button type="button" onClick={() => removerDoCarrinho(item.id)} className="text-rose-400 hover:text-rose-600 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={!carrinho || carrinho.length === 0}
              className="flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar & Imprimir
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}