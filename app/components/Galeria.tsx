"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Calendar, ArrowRight, Plus } from "lucide-react";
import { Animal } from "@/app/types/animal";
import { buscarListaAnimaisPublico } from "@/app/services/animalService";
import { useFavoritos } from "@/app/redux/useFavoritos";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";

export default function GaleriaPublica() {
  const [listaAnimais, setListaAnimais] = useState<Animal[]>([]);
  const { addFavorito, removeFavorito, isFavorito } = useFavoritos();
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const router = useRouter();

  const handleCardClick = (animalId: number | null) => {
    if (animalId === null) return;
    if (!usuario) {
      alert("Você deve fazer login para continuar. Caso não tenha uma conta, crie uma.");
      router.push(`/login?redirectTo=/galeria/${animalId}`);
    } else {
      router.push(`/galeria/${animalId}`);
    }
  };

  const carregarDados = async () => {
    try {
      const data = await buscarListaAnimaisPublico();
      setListaAnimais(data);
    } catch (error) {
      console.error("Erro ao carregar galeria:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleToggleFavorito = (e: React.MouseEvent, animal: Animal) => {
    e.preventDefault();
    e.stopPropagation();

    if (animal.id !== null) {
      if (isFavorito(animal.id)) {
        removeFavorito(animal.id);
      } else {
        addFavorito(animal);
      }
    }
  };

  const animaisOrdenados = [...listaAnimais].sort((a, b) => {
    const aFav = a.id !== null && isFavorito(a.id);
    const bFav = b.id !== null && isFavorito(b.id);

    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">
          Nossos Protegidos
        </h2>
        <p className="text-slate-500 text-lg">
          Encontre seu novo melhor amigo. Salve seus favoritos para não
          perdê-los de vista.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {animaisOrdenados.map((animal) => {
          const favoritado = animal.id !== null && isFavorito(animal.id);

          return (
            <div
              key={animal.id}
              onClick={() => handleCardClick(animal.id)}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl relative cursor-pointer"
            >
              <button
                onClick={(e) => handleToggleFavorito(e, animal)}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-2xl transition-all shadow-sm backdrop-blur-md ${
                  favoritado
                    ? "bg-red-500 text-white scale-110"
                    : "bg-white/80 text-slate-400 hover:text-red-500 hover:scale-110"
                }`}
              >
                <Heart
                  size={20}
                  fill={favoritado ? "currentColor" : "none"}
                  strokeWidth={2.5}
                />
              </button>

              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={animal.urlFoto}
                  alt={animal.nameAnimal}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#008080] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {animal.especie}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight">
                      {animal.nameAnimal}
                    </h3>
                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                      {animal.raca}
                    </p>
                  </div>
                  <button className="bg-stone-100 hover:bg-orange-100 text-orange-500 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors shadow-sm active:scale-95">
                    Quero Adotar!
                  </button>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                  <div className="flex items-center gap-1.5 text-teal-600 text-[10px] font-black uppercase">
                    <Calendar size={12} strokeWidth={3} />
                    {animal.statusAnimal}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase">
                    <MapPin size={12} strokeWidth={3} />
                    PetRescue
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {animaisOrdenados.length === 0 && (
          <div className="col-span-full py-24 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Plus className="text-stone-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              Nenhum pet cadastrado no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
