"use client";
import {
  alterarStatusUsuario,
  buscarListaUsuarios,
} from "@/app/services/usuarioService";
import { Usuario } from "@/app/types/usuarios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await buscarListaUsuarios();
      setUsuarios(dados);
    } catch (error) {
      alert("Erro ao carregar dados do usuário");
      console.error(error);
    }
  };

  const handleAlertStatus = async (usuario: Usuario) => {
    try {
      await alterarStatusUsuario(usuario);
      carregarDados();
      alert("Status do Usuário alterado com sucesso!");
    } catch (error) {
      alert("Erro ao alterar status do usuário!");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Gestão de Usuários
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Controle de acessos e permissões do sistema.
          </p>
        </div>

        <Link
          href="/usuarios/novo"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Novo Usuário
        </Link>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Código
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Nome
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  E-mail
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="hover:bg-stone-50/40 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">
                    #{usuario.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-700">
                      {usuario.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        usuario.status === "ATIVO"
                          ? "bg-teal-50 text-teal-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${usuario.status === "ATIVO" ? "bg-teal-500" : "bg-red-500"}`}
                      />
                      {usuario.status === "ATIVO" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/usuarios/${usuario.id}/editar`}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                        title="Editar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </Link>

                      <button
                        onClick={() => handleAlertStatus(usuario)}
                        className={`p-2 rounded-xl transition-all ${
                          usuario.status === "ATIVO"
                            ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                            : "text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                        }`}
                        title={
                          usuario.status === "ATIVO" ? "Inativar" : "Ativar"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-slate-400 font-medium"
                  >
                    Nenhum usuário encontrado no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
