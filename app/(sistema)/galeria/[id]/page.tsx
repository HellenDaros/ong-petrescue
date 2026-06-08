"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Heart, Share2 } from "lucide-react";
import { Animal } from "@/app/types/animal";
import { buscarAnimalPorId } from "@/app/services/animalService";
import { useFavoritos } from "@/app/redux/useFavoritos";

export default function DetalhesAnimalPage() {
  const params = useParams();
  const router = useRouter();
  const { addFavorito, removeFavorito, isFavorito } = useFavoritos();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        if (params.id) {
          const data = await buscarAnimalPorId(Number(params.id));
          if (data) {
            setAnimal(data);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar pet:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [params.id]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#008080] border-t-transparent"></div>
      </div>
    );
  }

  if (!animal) return null;

  const favoritado = animal.id !== null && isFavorito(animal.id);
  const isDisponivel = animal.statusAnimal === "DISPONIVEL";

  return (
    <main className="min-h-screen bg-stone-50/40 py-8 md:py-16 px-4 font-[family-name:var(--font-poppins)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-10 px-2">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#008080] font-black text-xs uppercase tracking-widest transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={3} />
            Voltar para galeria
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (animal.id)
                  favoritado ? removeFavorito(animal.id) : addFavorito(animal);
              }}
              className={`p-3 rounded-2xl transition-all shadow-sm border ${
                favoritado
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-300 border-stone-100 hover:text-red-400"
              }`}
            >
              <Heart
                size={20}
                fill={favoritado ? "currentColor" : "none"}
                strokeWidth={2.5}
              />
            </button>
            <button className="p-3 bg-white rounded-2xl shadow-sm text-slate-300 border border-stone-100 hover:text-[#008080] transition-all">
              <Share2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-stone-200/50 border border-stone-50 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-[45%] h-[350px] md:h-auto relative">
            <img
              src={animal.urlFoto}
              alt={animal.nameAnimal}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-white/95 backdrop-blur-sm text-[#008080] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-md">
                {animal.especie}
              </span>
            </div>
          </div>

          <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-1 mb-6">
                <div
                  className={`w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 ${
                    isDisponivel
                      ? "bg-teal-50 text-teal-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {animal.statusAnimal}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter leading-none">
                  {animal.nameAnimal}
                </h1>
                <p className="text-[#008080] font-black text-xs uppercase tracking-widest mt-2">
                  Raça: <span className="text-slate-400">{animal.raca}</span>
                </p>
              </div>

              <div className="h-px bg-stone-100 w-full mb-8" />

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                  Conheça o amigo
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg italic">
                  "{animal.nameAnimal} é um(a) {animal.especie} que está
                  aguardando por um lar cheio de amor."
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-3">
              <button
                disabled={!isDisponivel}
                className={`flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                  isDisponivel
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                }`}
              >
                {isDisponivel ? "Tenho Interesse" : "Pet não disponível"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
