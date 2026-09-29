"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Heart, PenTool, Share2 } from "lucide-react";
import BotaoVoltar from "@/app/components/BotaoVoltar";
import { Animal } from "@/app/types/animal";
import { buscarAnimalPorId } from "@/app/services/animalService";
import { useFavoritos } from "@/app/redux/useFavoritos";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { criarSolicitacaoAdocao } from "@/app/services/adocaoService";
import { buscarAdotanteLogado } from "@/app/services/adotanteService";
import AssinaturaModal from "@/app/components/AssinaturaModal";
import { CONFIRMACAO_LABEL } from "@/app/(sistema)/animais/constants/animal-constants";

const rotuloConfirmacao = (valor: string) =>
  CONFIRMACAO_LABEL[valor as keyof typeof CONFIRMACAO_LABEL] ?? valor;

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
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [modalAssinaturaAberto, setModalAssinaturaAberto] = useState(false);

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
      } catch (error: any) {
        const mensagemErro =
          typeof error.response?.data === "string"
            ? error.response.data
            : "Erro ao carregar as informações do pet.";

        alert(mensagemErro);
        router.push("/");
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
      alert(
        "Você deve concordar com os termos da Lei Federal 9.605/98 para continuar.",
      );
      return;
    }
    if (!assinatura) {
      alert("Você precisa assinar o termo de compromisso antes de enviar.");
      return;
    }
    if (animal?.id === undefined || animal?.id === null) return;

    setEnviando(true);
    try {
      const sucesso = await criarSolicitacaoAdocao({
        animalId: animal.id,
        enderecoAnimal: enderecoAnimal,
        assinaturaBase64: assinatura,
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
    <main className="font-[family-name:var(--font-poppins)] flex flex-col flex-1">
      <BotaoVoltar href="/galeria">Voltar para a Galeria</BotaoVoltar>

      <div className="flex-1 flex items-center justify-center">
      <div
        className={`w-full mx-auto mt-3 transition-all ${mostrarFormulario ? "max-w-5xl" : "max-w-3xl"}`}
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-50 overflow-hidden flex flex-col md:flex-row">
          <div
            className={`w-full h-[260px] md:h-auto md:min-h-[320px] relative ${mostrarFormulario ? "md:w-[38%]" : "md:w-[45%]"}`}
          >
            <img
              src={animal.urlFoto}
              alt={animal.nameAnimal}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/95 backdrop-blur-sm text-[#008080] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md">
                {animal.especie}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  if (animal.id)
                    favoritado ? removeFavorito(animal.id) : addFavorito(animal);
                }}
                className={`p-2 rounded-xl transition-all shadow-md backdrop-blur-sm ${
                  favoritado
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-slate-400 hover:text-red-500"
                }`}
              >
                <Heart
                  size={16}
                  fill={favoritado ? "currentColor" : "none"}
                  strokeWidth={2.5}
                />
              </button>
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md text-slate-400 hover:text-[#008080] transition-all">
                <Share2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div
            className={`w-full p-6 flex flex-col justify-between ${mostrarFormulario ? "md:w-[62%] md:p-6" : "md:w-[55%] md:p-8"}`}
          >
            <div>
              <div className="flex flex-col gap-1 mb-4">
                <div
                  className={`w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 ${
                    isDisponivel
                      ? "bg-teal-50 text-teal-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {animal.statusAnimal}
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                  {animal.nameAnimal}
                </h1>
                <p className="text-[#008080] font-black text-xs uppercase tracking-widest mt-2">
                  Raça: <span className="text-slate-400">{animal.raca}</span>
                </p>
              </div>

              <div className="h-px bg-stone-100 w-full mb-5" />

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { label: "Idade", value: animal.idade },
                  { label: "Vacinado", value: rotuloConfirmacao(animal.vacinado) },
                  { label: "Castrado", value: rotuloConfirmacao(animal.castrado) },
                  {
                    label: "Vermifugado",
                    value: rotuloConfirmacao(animal.vermifugado),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-stone-50 border border-stone-100 rounded-xl px-3 py-2"
                  >
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-xs font-black text-slate-700">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                  Conheça o amigo
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm italic">
                  "{animal.nameAnimal} é um(a) {animal.especie} que está
                  aguardando por um lar cheio de amor."
                </p>
              </div>
            </div>

            {mostrarFormulario ? (
              <form
                onSubmit={handleEnviarSolicitacao}
                className="mt-4 bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-3"
              >
                <h3 className="text-base font-black text-slate-800">
                  Solicitação de Adoção
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Endereço onde ficará o animal
                  </label>
                  <input
                    type="text"
                    required
                    value={enderecoAnimal}
                    onChange={(e) => setEnderecoAnimal(e.target.value)}
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    className="w-full bg-white border border-stone-200 focus:border-teal-500 outline-none px-4 py-2.5 text-sm rounded-xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="text-xs font-black text-orange-500 uppercase tracking-wider">
                    Lei Federal nº 9.605/98 (Artigo 32)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    Praticar ato de abuso, maus-tratos, ferir ou mutilar animais
                    silvestres, domésticos ou domesticados, nativos ou exóticos
                    é crime federal, sujeito a pena de detenção e multa. Para
                    cães e gatos, a pena é de reclusão de 2 a 5 anos, multa e
                    proibição da guarda.
                  </p>

                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={concordaTermos}
                      onChange={(e) => setConcordaTermos(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
                    />
                    <span className="text-[11px] leading-snug text-slate-600 font-bold select-none">
                      Estou ciente e concordo com a Lei Federal 9.605/98 e
                      assumo o compromisso de guarda responsável do animal.
                    </span>
                  </label>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Assinatura do Termo de Compromisso
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    Assine digitalmente para confirmar que está ciente da lei e
                    do compromisso de guarda responsável.
                  </p>

                  <button
                    type="button"
                    onClick={() => setModalAssinaturaAberto(true)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      assinatura
                        ? "bg-teal-50 text-teal-600 border-2 border-teal-100 hover:bg-teal-100"
                        : "bg-white text-slate-500 border-2 border-dashed border-stone-300 hover:border-teal-400 hover:text-teal-600"
                    }`}
                  >
                    {assinatura ? (
                      <>
                        <CheckCircle2 size={14} strokeWidth={3} />
                        Assinatura Salva · Editar
                      </>
                    ) : (
                      <>
                        <PenTool size={14} strokeWidth={3} />
                        Realizar Assinatura
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="flex-1 py-2.5 bg-white border border-stone-200 text-slate-500 hover:bg-stone-100 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando || !assinatura}
                    title={
                      !assinatura
                        ? "Assine o termo para habilitar o envio"
                        : undefined
                    }
                    className="flex-[2] py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95 disabled:bg-slate-300"
                  >
                    {enviando ? "Enviando..." : "Confirmar Adoção"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  disabled={!isDisponivel}
                  onClick={() => {
                    if (usuario?.role !== "ROLE_ADOTANTE") {
                      alert(
                        "Apenas usuários adotantes podem manifestar interesse em adoção.",
                      );
                      return;
                    }
                    setMostrarFormulario(true);
                  }}
                  className={`flex-[2] py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
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
      </div>

      {modalAssinaturaAberto && (
        <AssinaturaModal
          assinaturaAtual={assinatura}
          onFechar={() => setModalAssinaturaAberto(false)}
          onSalvar={(assinaturaBase64) => {
            setAssinatura(assinaturaBase64);
            setModalAssinaturaAberto(false);
          }}
        />
      )}
    </main>
  );
}
