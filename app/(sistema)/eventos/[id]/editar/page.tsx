"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buscarListaAnimais } from "@/app/services/animalService";
import { buscarEventoPorId, atualizarEvento } from "@/app/services/eventoService";
import { buscarEnderecoPorCep } from "@/app/services/enderecoService";
import { Animal } from "@/app/types/animal";
import { EventoRequest } from "@/app/types/evento";
import { ArrowLeft, Calendar, CheckSquare, Square, Search } from "lucide-react";

export default function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventoId = Number(resolvedParams.id);
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioTermino, setHorarioTermino] = useState("");
  const [nomeLocal, setNomeLocal] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [complemento, setComplemento] = useState("");
  const [urlCapa, setUrlCapa] = useState("");
  const [status, setStatus] = useState<"AGENDADO" | "ENCERRADO">("AGENDADO");

  const [animaisOng, setAnimaisOng] = useState<Animal[]>([]);
  const [animaisSelecionados, setAnimaisSelecionados] = useState<number[]>([]);
  const [buscaAnimal, setBuscaAnimal] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [eventoId]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [evento, listaAnimais] = await Promise.all([
        buscarEventoPorId(eventoId),
        buscarListaAnimais(),
      ]);

      setNome(evento.nome);
      setDescricao(evento.descricao);
      setData(evento.data);
      setHorarioInicio(evento.horarioInicio);
      setHorarioTermino(evento.horarioTermino);
      setNomeLocal(evento.nomeLocal || "");
      setCep(evento.cep);
      setEndereco(evento.endereco);
      setBairro(evento.bairro);
      setCidade(evento.cidade);
      setUf(evento.uf);
      setComplemento(evento.complemento || "");
      setUrlCapa(evento.urlCapa || "");
      setStatus(evento.status);

      setAnimaisOng(listaAnimais);
      const idsJaVinculados = evento.animais
        .map((a) => a.id)
        .filter((id): id is number => id !== null);
      setAnimaisSelecionados(idsJaVinculados);
    } catch (error) {
      console.error("Erro ao carregar dados do evento:", error);
      alert("Erro ao carregar evento.");
      router.push("/eventos");
    } finally {
      setCarregando(false);
    }
  };

  const toggleAnimal = (id: number | null) => {
    if (id === null) return;
    if (animaisSelecionados.includes(id)) {
      setAnimaisSelecionados(animaisSelecionados.filter((aId) => aId !== id));
    } else {
      setAnimaisSelecionados([...animaisSelecionados, id]);
    }
  };

  const selecionarTodos = () => {
    const todosIds = animaisOng
      .map((a) => a.id)
      .filter((id): id is number => id !== null);
    setAnimaisSelecionados(todosIds);
  };

  const desmarcarTodos = () => {
    setAnimaisSelecionados([]);
  };

  const handleBuscarCep = async (cepConsultado: string) => {
    const cepLimpo = cepConsultado.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return;
    }

    try {
      const enderecoEncontrado = await buscarEnderecoPorCep(cepLimpo);

      setCep(enderecoEncontrado.cep);
      setEndereco(enderecoEncontrado.logradouro);
      setBairro(enderecoEncontrado.bairro);
      setCidade(enderecoEncontrado.cidade);
      setUf(enderecoEncontrado.uf);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleCepChange = (valor: string) => {
    setCep(valor);

    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      handleBuscarCep(cepLimpo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !descricao || !data || !horarioInicio || !horarioTermino || !endereco) {
      alert("Por favor, preencha todos os campos obrigatórios, incluindo o CEP do local.");
      return;
    }

    try {
      setSalvando(true);
      const payload: EventoRequest = {
        nome,
        descricao,
        data,
        horarioInicio,
        horarioTermino,
        nomeLocal: nomeLocal || undefined,
        cep,
        complemento: complemento || undefined,
        urlCapa: urlCapa || undefined,
        status,
        animaisIds: animaisSelecionados,
      };

      await atualizarEvento(eventoId, payload);
      alert("Evento atualizado com sucesso!");
      router.push("/eventos");
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      alert("Falha ao atualizar evento. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const animaisFiltrados = animaisOng.filter((animal) =>
    animal.nameAnimal.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
    animal.raca.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
    animal.especie.toLowerCase().includes(buscaAnimal.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 text-center font-bold text-slate-400">
        Carregando dados do evento...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 p-6">
      <div className="mb-6">
        <Link
          href="/eventos"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold text-sm transition-all mb-4"
        >
          <ArrowLeft size={16} />
          Voltar para Eventos
        </Link>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Editar Evento
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Altere os detalhes do evento e atualize quais animais estarão presentes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[2rem] border border-stone-100 shadow-md p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-black text-slate-800 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Calendar className="text-teal-600" size={20} />
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Nome do Evento *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Descrição do Evento *
              </label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  Início *
                </label>
                <input
                  type="time"
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  Término *
                </label>
                <input
                  type="time"
                  value={horarioTermino}
                  onChange={(e) => setHorarioTermino(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Nome do Local (Opcional)
              </label>
              <input
                type="text"
                value={nomeLocal}
                onChange={(e) => setNomeLocal(e.target.value)}
                placeholder="Ex: Prefeitura, Parque Ibirapuera - Portão 3"
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                CEP *
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Complemento (Opcional)
              </label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Ex: Portão 3"
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            {endereco && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={endereco}
                    readOnly
                    className="w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-sm font-medium text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={bairro}
                    readOnly
                    className="w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-sm font-medium text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={cidade}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-sm font-medium text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                      UF
                    </label>
                    <input
                      type="text"
                      value={uf}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-sm font-medium text-slate-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "AGENDADO" | "ENCERRADO")}
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              >
                <option value="AGENDADO">Agendado</option>
                <option value="ENCERRADO">Encerrado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                URL da Imagem de Capa (Opcional)
              </label>
              <input
                type="url"
                value={urlCapa}
                onChange={(e) => setUrlCapa(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-stone-100 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Animais Participantes do Evento
              </h2>
              <p className="text-slate-500 text-xs font-medium mt-1">
                Marque ou desmarque os animais que estarão na feira de adoção.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selecionarTodos}
                className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-all"
              >
                Selecionar Todos
              </button>
              <button
                type="button"
                onClick={desmarcarTodos}
                className="text-xs font-bold text-slate-500 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-all"
              >
                Desmarcar Todos
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center bg-stone-50 px-4 py-3 rounded-2xl">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por nome, raça ou espécie..."
                value={buscaAnimal}
                onChange={(e) => setBuscaAnimal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <span className="text-xs font-bold text-teal-700 bg-teal-100/80 px-3 py-1.5 rounded-full ml-4">
              {animaisSelecionados.length} de {animaisOng.length} selecionados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {animaisFiltrados.map((animal) => {
              const selecionado = animal.id !== null && animaisSelecionados.includes(animal.id);

              return (
                <div
                  key={animal.id}
                  onClick={() => toggleAnimal(animal.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    selecionado
                      ? "border-teal-500 bg-teal-50/50 shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="shrink-0 text-teal-600">
                    {selecionado ? (
                      <CheckSquare size={22} className="text-teal-600 fill-teal-50" />
                    ) : (
                      <Square size={22} className="text-stone-300" />
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                    {animal.urlFoto ? (
                      <img
                        src={animal.urlFoto}
                        alt={animal.nameAnimal}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 font-black text-xs">
                        PET
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-black text-slate-800 text-sm truncate">
                      {animal.nameAnimal}
                    </h4>
                    <p className="text-slate-400 text-xs font-semibold truncate">
                      {animal.especie} • {animal.raca}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/eventos"
            className="px-6 py-3.5 rounded-2xl border border-stone-300 text-slate-600 font-bold text-sm hover:bg-stone-100 transition-all"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={salvando}
            className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-lg shadow-teal-100 transition-all disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
