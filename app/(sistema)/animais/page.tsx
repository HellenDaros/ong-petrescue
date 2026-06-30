"use client";

import {
  alterarStatusAnimal,
  buscarListaAnimais,
} from "@/app/services/animalService";
import { Animal } from "@/app/types/animal";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Animais() {
  const [animais, setAnimais] = useState<Animal[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dados = await buscarListaAnimais();
    setAnimais(dados);
  };

  const handleStatus = async (animal: Animal) => {
    const sucesso = await alterarStatusAnimal(animal);
    if (sucesso) {
      alert("Status do animal alterado com sucesso!");
      carregarDados();
    } else {
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Gestão de Animais
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Controle de pets cadastrados e status de adoção.
          </p>
        </div>

        <Link
          href="/animais/novo"
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
          Novo Animal
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Foto
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Nome
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Espécie / Raça
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
              {animais.map((animal) => (
                <tr
                  key={animal.id}
                  className="hover:bg-stone-50/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-stone-100">
                      <img
                        src={animal.urlFoto}
                        alt={animal.nameAnimal}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-700">
                      {animal.nameAnimal}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold">
                      ID: #{animal.id}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600">
                        {animal.especie}
                      </span>
                      <span className="text-xs text-slate-400">
                        {animal.raca}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        animal.statusAnimal === "DISPONIVEL"
                          ? "bg-teal-50 text-teal-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${animal.statusAnimal === "DISPONIVEL" ? "bg-teal-500" : "bg-red-500"}`}
                      />
                      {animal.statusAnimal}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/animais/${animal.id}/editar`}
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
                        onClick={() => handleStatus(animal)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Alterar Status"
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

              {animais.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-slate-400 font-medium"
                  >
                    Nenhum animal cadastrado no sistema.
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
