"use client";

import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import {
  FichaAdocaoModalProps,
  formatarEnderecoAdocao,
} from "@/app/types/solicitacaoAdocao";
import {
  CONFIRMACAO_LABEL,
  ESPECIE_LABEL,
  PORTE_LABEL,
  SEXO_LABEL,
} from "@/app/(sistema)/animais/constants/animal-constants";

const STATUS_LABEL = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Recusado",
};

const rotulo = (mapa: Record<string, string>, valor: string) =>
  mapa[valor] ?? valor ?? "-";

function Campo({ label, valor }: { label: string; valor: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-xs font-bold text-slate-800 break-words">
        {valor || "-"}
      </p>
    </div>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2 break-inside-avoid">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700 border-b border-stone-200 pb-1">
        {titulo}
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </section>
  );
}

export default function FichaAdocaoModal({
  solicitacao,
  onFechar,
}: FichaAdocaoModalProps) {
  const { adotante, animal } = solicitacao;

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString("pt-BR");

  const vacinas =
    animal.vacinado === "SIM" && animal.vacinadoDescricao
      ? `Sim (${animal.vacinadoDescricao})`
      : rotulo(CONFIRMACAO_LABEL, animal.vacinado);

  const outrosTermos = (solicitacao.termosTitulos ?? []).filter(
    (titulo) => titulo !== solicitacao.textoPadraoTitulo,
  );

  const ficha = (
    <div className="ficha-print-root fixed inset-0 z-[60] overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:static print:overflow-visible print:bg-transparent print:backdrop-blur-none">
      <div className="max-w-3xl mx-auto my-6 print:my-0 print:max-w-none">
        <div className="flex justify-end gap-2 mb-3 print:hidden px-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-black text-xs shadow-md transition-all active:scale-95"
          >
            <Printer size={16} />
            Imprimir / Salvar em PDF
          </button>
          <button
            type="button"
            onClick={onFechar}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-slate-600 px-4 py-2 rounded-xl font-black text-xs shadow-md transition-all"
          >
            <X size={16} />
            Fechar
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 print:shadow-none print:rounded-none print:p-0">
          <div className="flex justify-between items-center pb-4 border-b border-stone-200">
            <div>
              <span className="text-xl font-black tracking-tighter text-slate-800">
                I🧡PET
              </span>
              <p className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest">
                {solicitacao.ongNome || "ONG responsável"}
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Ficha de Adoção Nº {solicitacao.id}
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Solicitada em {formatarData(solicitacao.dataSolicitacao)} ·{" "}
                {STATUS_LABEL[solicitacao.statusAdocao]}
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-start break-inside-avoid">
            {animal.urlFoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={animal.urlFoto}
                alt={animal.nameAnimal}
                className="w-28 h-28 rounded-2xl object-cover border border-stone-200 shrink-0"
              />
            )}
            <div className="flex-1 space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700 border-b border-stone-200 pb-1">
                Dados do Animal
              </h2>
              <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                <Campo label="Nome" valor={animal.nameAnimal} />
                <Campo
                  label="Espécie"
                  valor={rotulo(ESPECIE_LABEL, animal.especie)}
                />
                <Campo label="Sexo" valor={rotulo(SEXO_LABEL, animal.sexo)} />
                <Campo label="Raça" valor={animal.raca} />
                <Campo label="Idade" valor={animal.idade} />
                <Campo
                  label="Porte"
                  valor={rotulo(PORTE_LABEL, animal.porte)}
                />
                <Campo label="Cor da pelagem" valor={animal.corPelagem} />
                <Campo
                  label="Castrado"
                  valor={rotulo(CONFIRMACAO_LABEL, animal.castrado)}
                />
                <Campo
                  label="Vermifugado"
                  valor={rotulo(CONFIRMACAO_LABEL, animal.vermifugado)}
                />
              </div>
              <Campo label="Vacinado" valor={vacinas} />
            </div>
          </div>

          <Secao titulo="Dados do Adotante">
            <Campo label="Nome" valor={adotante.name} />
            <Campo label="CPF" valor={adotante.cpf} />
            <Campo label="Identidade (RG)" valor={adotante.identidade} />
            <Campo label="Profissão" valor={adotante.profissao} />
            <Campo label="E-mail" valor={adotante.email} />
            <Campo
              label="Telefones"
              valor={[adotante.telefoneMovel, adotante.telefoneFixo]
                .filter(Boolean)
                .join(" / ")}
            />
            <div className="col-span-2">
              <Campo
                label="Endereço do adotante"
                valor={`${adotante.endereco}, ${adotante.bairro} - ${adotante.cidade}/${adotante.uf}`}
              />
            </div>
          </Secao>

          <Secao titulo="Local onde o animal ficará">
            <div className="col-span-2">
              <Campo
                label="Endereço"
                valor={formatarEnderecoAdocao(solicitacao)}
              />
            </div>
          </Secao>

          <section className="space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700 border-b border-stone-200 pb-1 break-after-avoid">
              Termo de Compromisso
            </h2>
            {solicitacao.textoPadraoConteudo && (
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-800 break-after-avoid">
                  {solicitacao.textoPadraoTitulo}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {solicitacao.textoPadraoConteudo}
                </p>
              </div>
            )}
            {outrosTermos.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Leis e termos aceitos
                </p>
                <ul className="list-disc pl-5 text-xs font-medium text-slate-700 space-y-1">
                  {outrosTermos.map((titulo) => (
                    <li key={titulo}>{titulo}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="break-inside-avoid space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">
                O adotante declara ter lido e aceitado os termos acima.
              </p>

              <div className="flex flex-col items-center pt-4">
                {solicitacao.assinaturaBase64 ? (
                  <img
                    src={solicitacao.assinaturaBase64}
                    alt={`Assinatura de ${adotante.name}`}
                    className="max-h-20"
                  />
                ) : (
                  <div className="h-16" />
                )}
                <div className="w-64 border-t border-slate-400 pt-1 text-center">
                  <p className="text-xs font-bold text-slate-700">
                    {adotante.name}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Assinatura do adotante
                  </p>
                </div>
              </div>
            </div>
          </section>

          <p className="text-center text-stone-400 text-[10px] font-medium pt-3 border-t border-stone-100">
            Documento gerado pelo sistema I🧡PET • Adote com responsabilidade e
            amor.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Imprime somente a ficha: esconde o restante da página */
          body > *:not(.ficha-print-root) {
            display: none !important;
          }
          html {
            font-size: 16px !important;
          }
          body {
            background-color: white !important;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(ficha, document.body);
}
