"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Animal, AnimalFormProps } from "@/app/types/animal";
import { salvarAnimal } from "@/app/services/animalService";

export default function AnimalForm({ animalExistente }: AnimalFormProps) {
  const router = useRouter();

  const SexoLabel = {
    MACHO: "Macho",
    FEMEA: "Fêmea",
  };

  const EspecieLabel = {
    CACHORRO: "Cachorro",
    GATO: "Gato",
  };

  const PorteLabel = {
    MINI: "Mini",
    MEDIO: "Médio",
    GRANDE: "Grande",
    GIGANTE: "Gigante",
  };

  const ConfirmacaoLabel = {
    SIM: "Sim",
    NAO: "Não",
    NAO_ESPECIFICADO: "Não Especificado",
  };

  const StatusAnimalLabel = {
    DISPONIVEL: "Disponível",
    INATIVO: "Inativo",
  };

  const [animal, setAnimal] = useState<Animal>(
    animalExistente ||
      new Animal(
        null,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "DISPONIVEL",
      ),
  );

  const isEdicao = !!animalExistente;

  const handleChange = (campo: keyof Animal, valor: string) => {
    setAnimal((prev) => {
      const novoAnimal = { ...prev, [campo]: valor };

      return new Animal(
        prev.id,
        campo === "nameAnimal" ? valor : prev.nameAnimal,
        campo === "raca" ? valor : prev.raca,
        campo === "sexo" ? valor : prev.sexo,
        campo === "idade" ? valor : prev.idade,
        campo === "urlFoto" ? valor : prev.urlFoto,
        campo === "porte" ? valor : prev.porte,
        campo === "corPelagem" ? valor : prev.corPelagem,
        campo === "castrado" ? valor : prev.castrado,
        campo === "vermifugado" ? valor : prev.vermifugado,
        campo === "vacinado" ? valor : prev.vacinado,
        campo === "vacinadoDescricao" ? valor : prev.vacinadoDescricao,
        campo === "especie" ? valor : prev.especie,
        campo === "nameDoador" ? valor : prev.nameDoador,
        campo === "telefoneDoador" ? valor : prev.telefoneDoador,
        campo === "statusAnimal" ? valor : prev.statusAnimal,
      );
    });
  };

  const handleSalvar = async () => {
    const sucesso = await salvarAnimal(animal, !!animalExistente);

    if (sucesso) {
      alert("Animal salvo com sucesso!");
      router.push("/animais");
    } else {
      alert("Erro ao salvar dados.");
      return;
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="bg-stone-50/50 px-10 py-8 border-b border-stone-100">
          <h2 className="text-2xl font-black text-[#008080] tracking-tight">
            {animalExistente ? "Editar Pet" : "Novo Protegido"}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Preencha as informações do animal.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSalvar();
          }}
          className="p-10 space-y-6"
        >
          {/* Campo: Nome */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Nome do Pet
            </label>
            <input
              type="text"
              required
              onChange={(e) => handleChange("nameAnimal", e.target.value)}
              value={animal.nameAnimal}
              placeholder="Ex: Bolinha"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Espécie
              </label>
              <select
                value={animal.especie}
                required
                onChange={(e) => handleChange("especie", e.target.value)}
                className="w-full bg-stone-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all"
              >
                <option value="">Selecione...</option>
                {Object.entries(EspecieLabel).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Raça
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleChange("raca", e.target.value)}
                value={animal.raca}
                placeholder="Vira-lata, Poodle..."
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Sexo
              </label>
              <select
                value={animal.sexo}
                required
                onChange={(e) => handleChange("sexo", e.target.value)}
                className="w-full bg-stone-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all"
              >
                <option value="">Selecione...</option>
                {Object.entries(SexoLabel).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Idade
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleChange("idade", e.target.value)}
                value={animal.idade}
                placeholder="Ex: 2 meses"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Porte
              </label>
              <select
                value={animal.porte}
                required
                onChange={(e) => handleChange("porte", e.target.value)}
                className="w-full bg-stone-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all"
              >
                <option value="">Selecione...</option>
                {Object.entries(PorteLabel).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Cor da Pelagem
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleChange("corPelagem", e.target.value)}
                value={animal.corPelagem}
                placeholder="Ex: Preto e Branco"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Nome do Doador
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleChange("nameDoador", e.target.value)}
                value={animal.nameDoador}
                placeholder="Ex: Pedro"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Telefone Doador
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleChange("telefoneDoador", e.target.value)}
                value={animal.telefoneDoador}
                placeholder="(48) 9 9999-9999"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                URL da Foto
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleChange("urlFoto", e.target.value)}
                value={animal.urlFoto}
                placeholder="http://..."
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Castrado?
              </label>
              <select
                value={animal.castrado}
                required
                onChange={(e) => handleChange("castrado", e.target.value)}
                className="w-full bg-stone-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all"
              >
                <option value="">Selecione...</option>
                {Object.entries(ConfirmacaoLabel).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Vermifugado?
              </label>
              <select
                value={animal.vermifugado}
                required
                onChange={(e) => handleChange("vermifugado", e.target.value)}
                className="w-full bg-stone-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all"
              >
                <option value="">Selecione...</option>
                {Object.entries(ConfirmacaoLabel).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Vacinado?
              </label>
              <select
                value={animal.vacinado}
                required
                onChange={(e) => handleChange("vacinado", e.target.value)}
                className="w-full bg-stone-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all"
              >
                <option value="">Selecione...</option>
                {Object.entries(ConfirmacaoLabel).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {animal.vacinado === "SIM" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Quais Vacinas? (Descrição)
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  handleChange("vacinadoDescricao", e.target.value)
                }
                value={animal.vacinadoDescricao}
                placeholder="Ex: V10, Raiva..."
                className="w-full bg-teal-50/30 border-2 border-teal-100 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-teal-200"
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/animais"
              className="flex-1 text-center py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-stone-50 transition-all"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex-1 bg-[#008080] hover:bg-teal-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 active:scale-95"
            >
              Salvar Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
