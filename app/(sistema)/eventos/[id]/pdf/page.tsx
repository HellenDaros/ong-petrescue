"use client";

import { useEffect, useState, use } from "react";
import BotaoVoltar from "@/app/components/BotaoVoltar";
import { buscarEventoPorId } from "@/app/services/eventoService";
import { Evento, formatarLocalEvento } from "@/app/types/evento";
import { QRCodeSVG } from "qrcode.react";
import {
  Printer,
  Calendar,
  Clock,
  MapPin,
  PawPrint,
} from "lucide-react";

export default function EventoPdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventoId = Number(resolvedParams.id);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    carregarEvento();
    if (typeof window !== "undefined") {
      setPublicUrl(`${window.location.origin}/eventos-publicos/${eventoId}`);
    }
  }, [eventoId]);

  const carregarEvento = async () => {
    try {
      setCarregando(true);
      const dados = await buscarEventoPorId(eventoId);
      setEvento(dados);
    } catch (error) {
      console.error("Erro ao carregar evento para PDF:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (carregando) {
    return (
      <div className="w-full max-w-4xl mx-auto py-24 text-center text-slate-400 font-bold">
        Gerando visualização de impressão e QR Code...
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="w-full max-w-4xl mx-auto py-24 text-center text-red-500 font-bold">
        Evento não encontrado.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen animate-in fade-in duration-500">
      <div className="print:hidden">
        <BotaoVoltar href="/eventos">Voltar para Eventos</BotaoVoltar>
      </div>

      <div className="max-w-2xl mx-auto my-3 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-black text-xs shadow-md transition-all active:scale-95"
        >
          <Printer size={16} />
          Imprimir / Salvar em PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-5 sm:p-7 print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:w-full print:max-w-none">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-5">
          <div className="flex items-center gap-3">
            {/* <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-md">
              <PawPrint size={28} />
            </div> */}
            <div>
              <span className="text-xl font-black tracking-tighter text-slate-800">
                I🧡PET
              </span>
              <p className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest">
                {evento.empresaNome || "Feira de Adoção de Animais"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Feira Presencial de Adoção
            </span>
          </div>
        </div>

        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
            {evento.nome}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            {evento.descricao}
          </p>
        </div>

        <div className="bg-stone-50 rounded-xl border border-stone-200 mb-5 flex flex-col sm:flex-row text-center overflow-hidden">
          <div className="flex flex-col items-center justify-center p-3 sm:flex-1 sm:basis-0 min-w-0">
            <Calendar className="text-teal-600 mb-1" size={20} />
            <span className="text-[10px] font-black uppercase text-slate-400">
              Data
            </span>
            <span className="text-slate-800 font-extrabold text-xs">
              {evento.data}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 sm:flex-1 sm:basis-0 min-w-0 border-y sm:border-y-0 sm:border-x border-stone-200">
            <Clock className="text-teal-600 mb-1" size={20} />
            <span className="text-[10px] font-black uppercase text-slate-400">
              Horário
            </span>
            <span className="text-slate-800 font-extrabold text-xs">
              {evento.horarioInicio} às {evento.horarioTermino}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 sm:grow-[1.6] sm:basis-0 min-w-0">
            <MapPin className="text-teal-600 mb-1" size={20} />
            <span className="text-[10px] font-black uppercase text-slate-400">
              Local
            </span>
            <span className="text-slate-800 font-extrabold text-xs leading-snug break-words">
              {formatarLocalEvento(evento)}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-5 text-center mb-5 flex flex-col items-center justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-teal-800 mb-3">
            Escaneie o QR Code abaixo com seu celular
          </p>

          <div className="bg-white p-3 rounded-xl shadow-md border border-teal-100 mb-3 inline-block">
            {publicUrl && (
              <QRCodeSVG
                value={publicUrl}
                size={170}
                bgColor={"#FFFFFF"}
                fgColor={"#0F172A"}
                level={"H"}
                includeMargin={true}
              />
            )}
          </div>

          <p className="text-slate-700 text-xs font-bold max-w-md leading-snug">
            Veja a lista exclusiva dos{" "}
            <span className="text-teal-700 underline">
              {evento.animais?.length || 0} animais
            </span>{" "}
            presentes nesta feira e faça o pedido de adoção direto da sua tela!
          </p>

        </div>

        <div className="mt-5 text-center text-stone-400 text-[10px] font-medium pt-3 border-t border-stone-100">
          Documento gerado pelo sistema I🧡PET • Adote com responsabilidade
          e amor.
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Na impressão, desfaz a redução de tela (fonte-base 13px e zoom do layout)
             para o documento preencher a folha. */
          html {
            font-size: 16px !important;
          }
          .sistema-conteudo {
            zoom: 1 !important;
          }
          main {
            padding: 0 !important;
          }
          body {
            background-color: white !important;
          }
          header,
          aside,
          footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
