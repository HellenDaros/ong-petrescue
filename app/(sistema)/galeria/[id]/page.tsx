"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Heart, Share2 } from "lucide-react";
import { Animal } from "@/app/types/animal";
import { buscarAnimalPorId } from "@/app/services/animalService";
import { useFavoritos } from "@/app/redux/useFavoritos";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { criarSolicitacaoAdocao } from "@/app/services/adocaoService";
import { buscarAdotanteLogado } from "@/app/services/adotanteService";

export default function DetalhesAnimalPage() {
  const params = useParams();
  const router = useRouter();
  const { addFavorito, removeFavorito, isFavorito } = useFavoritos();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);

  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enderecoAnimal, setEnderecoAnimal] = useState("");
  const [concordaTermos, setConcordaTermos] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const carregarAdotante = async () => {
      try {
        const profile = await buscarAdotanteLogado();
        if (profile && profile.endereco) {
          const fullAddress = `${profile.endereco}, ${profile.bairro}, ${profile.cidade} - ${profile.uf}`;
          setEnderecoAnimal(fullAddress);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do adotante:", error);
      }
    };

    if (usuario && usuario.role === "ROLE_ADOTANTE") {
      carregarAdotante();
    }
  }, [usuario]);

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

  const handleEnviarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enderecoAnimal.trim()) {
      alert("Por favor, preencha o endereço onde o animal ficará.");
      return;
    }
    if (!concordaTermos) {
      alert("Você deve concordar com os termos da Lei Federal 9.605/98 para continuar.");
      return;
    }
    if (animal?.id === undefined || animal?.id === null) return;

    setEnviando(true);
    try {
      const sucesso = await criarSolicitacaoAdocao({
        animalId: animal.id,
        enderecoAnimal: enderecoAnimal,
      });

      if (sucesso) {
        alert("Solicitação de adoção enviada com sucesso!");
        router.push("/adocoes/minhas");
      } else {
        alert("Erro ao enviar a solicitação. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao solicitar adoção:", error);
      alert("Erro ao solicitar adoção.");
    } finally {
      setEnviando(false);
    }
  };

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

            {mostrarFormulario ? (
              <form onSubmit={handleEnviarSolicitacao} className="mt-8 bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-6">
                <h3 className="text-lg font-black text-slate-800">Solicitação de Adoção</h3>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                    Endereço onde ficará o animal
                  </label>
                  <input
                    type="text"
                    required
                    value={enderecoAnimal}
                    onChange={(e) => setEnderecoAnimal(e.target.value)}
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    className="w-full bg-white border-2 border-stone-200 focus:border-teal-500 outline-none px-5 py-3 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider">
                    Lei Federal nº 9.605/98 (Artigo 32)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Praticar ato de abuso, maus-tratos, ferir ou mutilar animais silvestres, domésticos ou domesticados, nativos ou exóticos é crime federal, sujeito a pena de detenção e multa. Para cães e gatos, a pena é de reclusão de 2 a 5 anos, multa e proibição da guarda.
                  </p>
                  
                  <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      required
                      checked={concordaTermos}
                      onChange={(e) => setConcordaTermos(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
                    />
                    <span className="text-xs text-slate-600 font-bold select-none">
                      Estou ciente e concordo com a Lei Federal 9.605/98 e assumo o compromisso de guarda responsável do animal.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="flex-1 py-4 bg-white border border-stone-200 text-slate-500 hover:bg-stone-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95 disabled:bg-slate-300"
                  >
                    {enviando ? "Enviando..." : "Confirmar Adoção"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-12 flex flex-col sm:flex-row gap-3">
                <button
                  disabled={!isDisponivel}
                  onClick={() => {
                    if (usuario?.role !== "ROLE_ADOTANTE") {
                      alert("Apenas usuários adotantes podem manifestar interesse em adoção.");
                      return;
                    }
                    setMostrarFormulario(true);
                  }}
                  className={`flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                    isDisponivel
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isDisponivel ? "Tenho Interesse" : "Pet não disponível"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
