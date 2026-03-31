import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../utils/storage';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  const carregar = async () => setUsuarios(await getUsers());
  useEffect(() => { carregar(); }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    await createUser({ nome, username, senha });
    setNome(''); setUsername(''); setSenha('');
    carregar();
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Remover acesso deste usuário?")) {
      await deleteUser(id);
      carregar();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Equipe de TI</h1>
      
      <section className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
        <h2 className="font-bold mb-4 text-slate-700">Novo Acesso</h2>
        <form onSubmit={handleCriar} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} className="p-3 bg-slate-50 rounded-xl outline-none" required />
          <input type="text" placeholder="usuário.ti" value={username} onChange={e => setUsername(e.target.value)} className="p-3 bg-slate-50 rounded-xl outline-none" required />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} className="p-3 bg-slate-50 rounded-xl outline-none" required />
          <button className="bg-blue-600 text-white p-3 rounded-xl font-bold md:col-span-3">Criar Usuário</button>
        </form>
      </section>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
            <tr><th className="p-4">Nome</th><th className="p-4">Usuário</th><th className="p-4 text-right">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-4 font-semibold">{u.nome}</td>
                <td className="p-4 text-slate-500">{u.username}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleExcluir(u.id)} className="text-rose-500 font-bold text-xs">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}