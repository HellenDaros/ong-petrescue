"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckSquare, Square, Search } from "lucide-react";
import { Evento, EventoFormProps, EventoRequest } from "@/app/types/evento";
import { Animal } from "@/app/types/animal";
import { buscarListaAnimais } from "@/app/services/animalService";
import { salvarEvento } from "@/app/services/eventoService";
import { buscarEnderecoPorCep } from "@/app/services/enderecoService";

const EVENTO_VAZIO: Evento = {
  id: 0,
  nome: "",
  descricao: "",
  data: "",
  horarioInicio: "",
  horarioTermino: "",
  nomeLocal: "",
  cep: "",
  endereco: "",
  bairro: "",
  cidade: "",
  uf: "",
  complemento: "",
  urlCapa: "",
  status: "AGENDADO",
  animais: [],
};

export default function EventoForm({ eventoExistente }: EventoFormProps) {
  const router = useRouter();
  const isEdicao = !!eventoExistente;

  const [evento, setEvento] = useState<Evento>(
    eventoExistente
      ? {
          ...eventoExistente,
          nomeLocal: eventoExistente.nomeLocal || "",
          complemento: eventoExistente.complemento || "",
          urlCapa: eventoExistente.urlCapa || "",
        }
      : EVENTO_VAZIO,
  );
  const [animaisOng, setAnimaisOng] = useState<Animal[]>([]);
  const [buscaAnimal, setBuscaAnimal] = useState("");
  const [carregandoAnimais, setCarregandoAnimais] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarAnimais();
  }, []);

  const carregarAnimais = async () => {
    try {
      setCarregandoAnimais(true);
      const lista = await buscarListaAnimais();
      setAnimaisOng(lista);
    } catch (error) {
      console.error("Erro ao carregar animais da ONG:", error);
    } finally {
      setCarregandoAnimais(false);
    }
  };

  const handleChange = (
    campo:
      | "nome"
      | "descricao"
      | "data"
      | "horarioInicio"
      | "horarioTermino"
      | "nomeLocal"
      | "complemento"
      | "urlCapa",
    valor: string,
  ) => {
    setEvento((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleBuscarCep = async (cepConsultado: string) => {
    const cepLimpo = cepConsultado.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return;
    }

    try {
      const enderecoEncontrado = await buscarEnderecoPorCep(cepLimpo);

      setEvento((prev) => ({
        ...prev,
        cep: enderecoEncontrado.cep,
        endereco: enderecoEncontrado.logradouro,
        bairro: enderecoEncontrado.bairro,
        cidade: enderecoEncontrado.cidade,
        uf: enderecoEncontrado.uf,
      }));
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleCepChange = (valor: string) => {
    setEvento((prev) => ({ ...prev, cep: valor }));

    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      handleBuscarCep(cepLimpo);
    }
  };

  const toggleAnimal = (animal: Animal) => {
    if (animal.id === null) return;

    setEvento((prev) => {
      const jaSelecionado = prev.animais.some((a) => a.id === animal.id);

      return {
        ...prev,
        animais: jaSelecionado
          ? prev.animais.filter((a) => a.id !== animal.id)
          : [...prev.animais, animal],
      };
    });
  };

  const selecionarTodos = () => {
    setEvento((prev) => ({ ...prev, animais: animaisOng }));
  };

  const desmarcarTodos = () => {
    setEvento((prev) => ({ ...prev, animais: [] }));
  };

  const handleSalvar = async () => {
    if (
      !evento.nome ||
      !evento.descricao ||
      !evento.data ||
      !evento.horarioInicio ||
      !evento.horarioTermino ||
      !evento.endereco
    ) {
      alert(
        "Por favor, preencha todos os campos obrigatórios, incluindo o CEP do local.",
      );
      return;
    }

    if (!isEdicao && evento.animais.length === 0) {
      const confirmaSemAnimais = confirm(
        "Nenhum animal foi selecionado para este evento. Deseja cadastrar o evento assim mesmo?",
      );
      if (!confirmaSemAnimais) return;
    }

    try {
      setSalvando(true);
      const payload: EventoRequest = {
        nome: evento.nome,
        descricao: evento.descricao,
        data: evento.data,
        horarioInicio: evento.horarioInicio,
        horarioTermino: evento.horarioTermino,
        nomeLocal: evento.nomeLocal || undefined,
        cep: evento.cep,
        complemento: evento.complemento || undefined,
        urlCapa: evento.urlCapa || undefined,
        status: evento.status,
        animaisIds: evento.animais
          .map((a) => a.id)
          .filter((id): id is number => id !== null),
      };

      await salvarEvento(payload, isEdicao, evento.id);

      alert(`Evento ${isEdicao ? "atualizado" : "cadastrado"} com sucesso!`);
      router.push("/eventos");
    } catch (error) {
      console.error(
        `Erro ao ${isEdicao ? "atualizar" : "cadastrar"} evento:`,
        error,
      );
      alert(
        error instanceof Error
          ? error.message
          : `Ocorreu um erro ao ${isEdicao ? "atualizar" : "cadastrar"} o evento. Verifique os dados e tente novamente.`,
      );
    } finally {
      setSalvando(false);
    }
  };

  const animaisFiltrados = animaisOng.filter(
    (animal) =>
      animal.nameAnimal.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
      animal.raca.toLowerCase().includes(buscaAnimal.toLowerCase()) ||
      animal.especie.toLowerCase().includes(buscaAnimal.toLowerCase()),
  );

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          {isEdicao ? "Editar Evento" : "Cadastrar Novo Evento"}
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          {isEdicao
            ? "Altere os detalhes do evento e atualize quais animais estarão presentes."
            : "Preencha as informações do evento e escolha os animais da ONG que estarão presentes."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSalvar();
        }}
        className="space-y-8"
      >
        {/* Event details card */}
        <div className="bg-white rounded-[2rem] border border-stone-100 shadow-md p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-black text-slate-800 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Calendar className="text-teal-600" size={20} />
            {isEdicao ? "Informações Gerais" : "Informações do Evento"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Nome do Evento *
              </label>
              <input
                type="text"
                value={evento.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Ex: Feira de Adoção - Praça Central 15/09"
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
                value={evento.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descreva a proposta do evento, avisos para visitantes e detalhes..."
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
                value={evento.data}
                onChange={(e) => handleChange("data", e.target.value)}
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
                  value={evento.horarioInicio}
                  onChange={(e) =>
                    handleChange("horarioInicio", e.target.value)
                  }
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
                  value={evento.horarioTermino}
                  onChange={(e) =>
                    handleChange("horarioTermino", e.target.value)
                  }
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
                value={evento.nomeLocal}
                onChange={(e) => handleChange("nomeLocal", e.target.value)}
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
                value={evento.cep}
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
                value={evento.complemento}
                onChange={(e) => handleChange("complemento", e.target.value)}
                placeholder="Ex: Portão 3"
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>

            {evento.endereco && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={evento.endereco}
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
                    value={evento.bairro}
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
                      value={evento.cidade}
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
                      value={evento.uf}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-sm font-medium text-slate-500"
                    />
                  </div>
                </div>
              </>
            )}

            {isEdicao && (
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  value={evento.status}
                  onChange={(e) =>
                    setEvento((prev) => ({
                      ...prev,
                      status: e.target.value as "AGENDADO" | "ENCERRADO",
                    }))
                  }
                  className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                >
                  <option value="AGENDADO">Agendado</option>
                  <option value="ENCERRADO">Encerrado</option>
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                URL da Imagem de Capa (Opcional)
              </label>
              <input
                type="url"
                value={evento.urlCapa}
                onChange={(e) => handleChange("urlCapa", e.target.value)}
                placeholder="https://exemplo.com/imagem-do-evento.jpg"
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Animal selection card */}
        <div className="bg-white rounded-[2rem] border border-stone-100 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                {isEdicao
                  ? "Animais Participantes do Evento"
                  : "Selecione os Animais Participantes"}
              </h2>
              <p className="text-slate-500 text-xs font-medium mt-1">
                {isEdicao
                  ? "Marque ou desmarque os animais que estarão na feira de adoção."
                  : "Apenas os animais selecionados abaixo serão exibidos na página pública gerada pelo QR Code deste evento."}
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
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar por nome, raça ou espécie..."
                value={buscaAnimal}
                onChange={(e) => setBuscaAnimal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <span className="text-xs font-bold text-teal-700 bg-teal-100/80 px-3 py-1.5 rounded-full ml-4">
              {evento.animais.length} de {animaisOng.length} selecionados
            </span>
          </div>

          {carregandoAnimais ? (
            <div className="py-12 text-center text-slate-400 font-bold text-sm">
              Carregando catálogo de animais da ONG...
            </div>
          ) : animaisFiltrados.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium text-sm">
              Nenhum animal encontrado para os critérios informados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {animaisFiltrados.map((animal) => {
                const selecionado = evento.animais.some(
                  (a) => a.id === animal.id,
                );

                return (
                  <div
                    key={animal.id}
                    onClick={() => toggleAnimal(animal)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selecionado
                        ? "border-teal-500 bg-teal-50/50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="shrink-0 text-teal-600">
                      {selecionado ? (
                        <CheckSquare
                          size={22}
                          className="text-teal-600 fill-teal-50"
                        />
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
          )}
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
            {salvando
              ? isEdicao
                ? "Salvando..."
                : "Cadastrando..."
              : isEdicao
                ? "Salvar Alterações"
                : "Cadastrar Evento"}
          </button>
        </div>
      </form>
    </div>
  );
}
