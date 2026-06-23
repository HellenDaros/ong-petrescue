"use client";

import Link from "next/link";
import { Heart, MapPin, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { useFavoritos } from "@/app/redux/useFavoritos";

export default function FavoritosPage() {
  const { favoritos, removeFavorito } = useFavoritos();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 sm:p-8 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#008080] tracking-tight">
            Meus Favoritos
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Os pets que ganharam seu coração.
          </p>
        </div>

        {/* <Link href="/galeria">
          <button className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-slate-600 px-6 py-3 rounded-2xl font-black transition-all active:scale-95">
            Explorar mais pets
          </button>
        </Link> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favoritos.map((animal) => (
          <div
            key={animal.id}
            className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl relative"
          >
            <button
              onClick={() => animal.id && removeFavorito(animal.id)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-red-500 text-white rounded-2xl transition-all shadow-lg hover:bg-red-600 active:scale-90"
              title="Remover dos favoritos"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>

            <Link href={`/galeria/${animal.id}`}>
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
                  <div className="bg-stone-50 w-9 h-9 rounded-2xl flex items-center justify-center group-hover:bg-[#008080]/10 transition-colors">
                    <ArrowRight
                      size={18}
                      className="text-stone-300 group-hover:text-[#008080] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${
                      animal.statusAnimal === "DISPONIVEL"
                        ? "text-teal-600"
                        : "text-red-500"
                    }`}
                  >
                    <Calendar size={12} strokeWidth={3} />
                    {animal.statusAnimal}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase">
                    <MapPin size={12} strokeWidth={3} />
                    PetRescue
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {favoritos.length === 0 && (
          <div className="col-span-full py-24 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-red-200">
              <Heart size={40} fill="currentColor" />
            </div>
            <h2 className="text-slate-800 font-black text-xl mb-2">
              Sua lista está vazia
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">
              Você ainda não favoritou nenhum pet. Vá até a galeria e clique no
              coração!
            </p>
            <Link
              href="/galeria"
              className="inline-block mt-8 text-[#008080] font-black text-sm underline decoration-2 underline-offset-4 hover:text-teal-700"
            >
              Voltar para a Galeria
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
