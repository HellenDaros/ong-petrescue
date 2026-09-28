"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buscarEventoPublicoPorId } from "@/app/services/eventoService";
import { Evento, formatarLocalEvento } from "@/app/types/evento";
import { Animal } from "@/app/types/animal";
import { useFavoritos } from "@/app/redux/useFavoritos";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Calendar, Clock, MapPin, Heart, AlertTriangle, PawPrint, Sparkles } from "lucide-react";
import BotaoVoltar from "@/app/components/BotaoVoltar";

export default function EventoPublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventoId = Number(resolvedParams.id);
  const router = useRouter();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);

  const { addFavorito, removeFavorito, isFavorito } = useFavoritos();
  const usuario = useSelector((state: RootState) => state.auth.usuario);

  useEffect(() => {
    carregarEvento();
  }, [eventoId]);

  const carregarEvento = async () => {
    try {
      setCarregando(true);
      const dados = await buscarEventoPublicoPorId(eventoId);
      setEvento(dados);
    } catch (error) {
      console.error("Erro ao carregar evento público:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleCardClick = (animalId: number | null) => {
    if (animalId === null) return;
    if (!usuario) {
      alert("Você deve fazer login para continuar. Caso não tenha uma conta, crie uma.");
      router.push(`/login?redirectTo=/galeria/${animalId}`);
    } else {
      router.push(`/galeria/${animalId}`);
    }
  };

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

  if (carregando) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <PawPrint size={32} />
          </div>
          <p className="text-slate-500 font-bold text-sm">Carregando feira de adoção...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={36} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Evento não encontrado</h1>
        <p className="text-slate-500 text-sm mb-6">
          O evento solicitado não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-3 rounded-2xl text-sm transition-all"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  const isEncerrado = evento.status === "ENCERRADO";

  return (
    <div className="min-h-screen bg-stone-50 pb-12">
      {/* Top Banner / Navigation */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <BotaoVoltar href="/">Página Inicial</BotaoVoltar>

          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tighter text-slate-800">
             I🧡PET
            </span>
          </div>
        </div>
      </header>

      {/* Event Header Hero */}
      <section className="bg-gradient-to-b from-teal-900 to-slate-900 text-white py-10 px-6 relative overflow-hidden">
        {evento.urlCapa && (
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <img
              src={evento.urlCapa}
              alt={evento.nome}
              className="w-full h-full object-cover blur-sm scale-105"
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-teal-300 text-[10px] font-black uppercase tracking-widest mb-4 border border-white/10">
            <Sparkles size={12} />
            {evento.empresaNome || "Evento de Adoção de Animais"}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black mb-3 tracking-tight leading-tight">
            {evento.nome}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium mb-5 leading-relaxed">
            {evento.descricao}
          </p>

          <div className="inline-flex flex-wrap justify-center gap-2 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-xs font-bold">
            <div className="flex items-center gap-2 px-3 py-1">
              <Calendar className="text-orange-400" size={16} />
              <span>{evento.data}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 border-x border-white/10">
              <Clock className="text-orange-400" size={16} />
              <span>
                {evento.horarioInicio} às {evento.horarioTermino}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1">
              <MapPin className="text-orange-400" size={16} />
              <span>{formatarLocalEvento(evento)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Closed Event Warning Notice */}
      {isEncerrado && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 text-amber-900">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider">
                Este evento já foi encerrado
              </h3>
              <p className="text-xs font-medium text-amber-800">
                A feira presencial de adoção foi finalizada, porém a lista dos animais participantes continua disponível para consulta e solicitação de adoção online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animals Catalog Section (Matches GaleriaPublica card design) */}
      <section className="py-6 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
            Animais Presentes na Feira
          </h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Estes são os peludinhos selecionados pela ONG para este evento ({evento.animais?.length || 0} animais).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {evento.animais &&
            evento.animais.map((animal) => {
              const favoritado = animal.id !== null && isFavorito(animal.id);

              return (
                <div
                  key={animal.id}
                  onClick={() => handleCardClick(animal.id)}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl relative cursor-pointer"
                >
                  <button
                    onClick={(e) => handleToggleFavorito(e, animal)}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-xl transition-all shadow-sm backdrop-blur-md ${
                      favoritado
                        ? "bg-red-500 text-white scale-110"
                        : "bg-white/80 text-slate-400 hover:text-red-500 hover:scale-110"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={favoritado ? "currentColor" : "none"}
                      strokeWidth={2.5}
                    />
                  </button>

                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={animal.urlFoto}
                      alt={animal.nameAnimal}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[#008080] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {animal.especie}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-black text-slate-800 leading-tight">
                          {animal.nameAnimal}
                        </h3>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                          {animal.raca}
                        </p>
                      </div>
                      <button className="shrink-0 whitespace-nowrap bg-stone-100 hover:bg-orange-100 text-orange-500 px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors shadow-sm active:scale-95">
                        Quero Adotar!
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-stone-50">
                      <div className="flex items-center gap-1.5 text-teal-600 text-[10px] font-black uppercase">
                        <Calendar size={12} strokeWidth={3} />
                        {animal.statusAnimal}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase">
                        <MapPin size={12} strokeWidth={3} />
                        {evento.empresaNome || "I🧡PET"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {(!evento.animais || evento.animais.length === 0) && (
            <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-stone-200 p-4">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2 text-stone-300">
                <PawPrint size={20} />
              </div>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                Nenhum animal foi associado a este evento até o momento.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
