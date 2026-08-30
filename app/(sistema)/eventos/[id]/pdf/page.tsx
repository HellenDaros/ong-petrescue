"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { buscarEventoPorId } from "@/app/services/eventoService";
import { Evento, formatarLocalEvento } from "@/app/types/evento";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
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
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link
          href="/eventos"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 font-bold text-sm bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-sm transition-all"
        >
          <ArrowLeft size={16} />
          Voltar para Lista de Eventos
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-md transition-all active:scale-95"
        >
          <Printer size={18} />
          Imprimir / Salvar em PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 sm:p-12 print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:w-full">
        <div className="flex justify-between items-center pb-6 border-b-2 border-stone-100 mb-8">
          <div className="flex items-center gap-3">
            {/* <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-md">
              <PawPrint size={28} />
            </div> */}
            <div>
              <span className="text-2xl font-black tracking-tighter text-slate-800">
                I🧡PET
              </span>
              <p className="text-xs font-extrabold text-teal-600 uppercase tracking-widest">
                {evento.empresaNome || "Feira de Adoção de Animais"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-orange-100 text-orange-700 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Feira Presencial de Adoção
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {evento.nome}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            {evento.descricao}
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <Calendar className="text-teal-600 mb-1" size={24} />
            <span className="text-[10px] font-black uppercase text-slate-400">
              Data
            </span>
            <span className="text-slate-800 font-extrabold text-sm">
              {evento.data}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 border-y sm:border-y-0 sm:border-x border-stone-200">
            <Clock className="text-teal-600 mb-1" size={24} />
            <span className="text-[10px] font-black uppercase text-slate-400">
              Horário
            </span>
            <span className="text-slate-800 font-extrabold text-sm">
              {evento.horarioInicio} às {evento.horarioTermino}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <MapPin className="text-teal-600 mb-1" size={24} />
            <span className="text-[10px] font-black uppercase text-slate-400">
              Local
            </span>
            <span className="text-slate-800 font-extrabold text-sm truncate max-w-[200px]">
              {formatarLocalEvento(evento)}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-teal-50 to-emerald-50 rounded-3xl border-2 border-teal-100 p-8 text-center mb-8 flex flex-col items-center justify-center">
          <p className="text-xs font-black uppercase tracking-widest text-teal-800 mb-4">
            Escaneie o QR Code abaixo com seu celular
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-lg border border-teal-100 mb-4 inline-block">
            {publicUrl && (
              <QRCodeSVG
                value={publicUrl}
                size={220}
                bgColor={"#FFFFFF"}
                fgColor={"#0F172A"}
                level={"H"}
                includeMargin={true}
              />
            )}
          </div>

          <p className="text-slate-700 text-sm font-bold max-w-md leading-snug mb-2">
            Veja a lista exclusiva dos{" "}
            <span className="text-teal-700 underline">
              {evento.animais?.length || 0} animais
            </span>{" "}
            presentes nesta feira e faça o pedido de adoção direto da sua tela!
          </p>

        </div>

        <div className="mt-8 text-center text-stone-400 text-[11px] font-medium pt-4 border-t border-stone-100">
          Documento gerado pelo sistema I🧡PET • Adote com responsabilidade
          e amor.
        </div>
      </div>

      <style jsx global>{`
        @media print {
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
