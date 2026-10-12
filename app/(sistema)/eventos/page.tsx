"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Evento, eventoSomenteLeitura, formatarLocalEvento } from "@/app/types/evento";
import { alterarStatusEvento, listarEventosOng } from "@/app/services/eventoService";
import { Calendar, MapPin, Clock, Plus, ExternalLink, Edit3, Eye, QrCode, CheckCircle2, XCircle } from "lucide-react";

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const carregarEventos = async () => {
    try {
      setCarregando(true);
      const dados = await listarEventosOng(pagina, 9);
      setEventos(dados.content);
      setTotalPaginas(dados.totalPages);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, [pagina]);

  const handleToggleStatus = async (evento: Evento) => {
    const novoStatus = evento.status === "AGENDADO" ? "ENCERRADO" : "AGENDADO";
    const confirmacao = confirm(
      `Deseja encerrar o evento "${evento.nome}"? Esta ação é permanente: depois de encerrado, o evento não poderá mais ser editado nem reaberto, apenas visualizado.`
    );

    if (!confirmacao) return;

    try {
      await alterarStatusEvento(evento.id, novoStatus);
      alert("Status do evento atualizado com sucesso!");
      carregarEventos();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Falha ao alterar o status do evento.",
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Gestão de Eventos
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Cadastre e gerencie feiras de adoção, presenças de animais e QR Codes para impressão.
          </p>
        </div>

        <Link
          href="/eventos/novo"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 active:scale-95 text-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Cadastrar Evento
        </Link>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-slate-400 font-bold">
          Carregando eventos...
        </div>
      ) : eventos.length === 0 ? (
        <div className="py-20 text-center bg-stone-50 rounded-[2.5rem] border-2 border-dashed border-stone-200 p-8">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Calendar size={32} />
          </div>
          <h3 className="text-slate-700 font-black text-lg mb-1">Nenhum evento cadastrado</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Crie feiras de adoção e selecione quais animais estarão presentes para gerar o QR Code de divulgação.
          </p>
          <Link
            href="/eventos/novo"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black transition-all text-sm shadow-md"
          >
            <Plus size={18} strokeWidth={2.5} />
            Criar Primeiro Evento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventos.map((evento) => {
            const isAgendado = evento.status === "AGENDADO";
            const somenteLeitura = eventoSomenteLeitura(evento);

            return (
              <div
                key={evento.id}
                className="bg-white rounded-[2rem] border border-stone-100 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                    {evento.urlCapa ? (
                      <img
                        src={evento.urlCapa}
                        alt={evento.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white">
                        <Calendar size={48} className="opacity-40" />
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                          isAgendado
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        {isAgendado ? (
                          <>
                            <CheckCircle2 size={12} />
                            Agendado
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            Encerrado
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-xl font-black text-slate-800 mb-1 leading-snug">
                      {evento.nome}
                    </h2>
                    <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-3">
                      {evento.descricao}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-teal-600 shrink-0" />
                        <span>Data: {evento.data}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={14} className="text-teal-600 shrink-0" />
                        <span>
                          Horário: {evento.horarioInicio} - {evento.horarioTermino}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={14} className="text-teal-600 shrink-0" />
                        <span className="truncate">{formatarLocalEvento(evento)}</span>
                      </div>
                    </div>

                    <div className="mt-3 bg-teal-50/70 border border-teal-100 rounded-xl p-2.5 flex justify-between items-center text-xs">
                      <span className="text-teal-800 font-bold">Animais no Evento:</span>
                      <span className="bg-teal-600 text-white font-black px-2.5 py-0.5 rounded-full text-xs">
                        {evento.animais?.length || 0} pets
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/eventos-publicos/${evento.id}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
                    >
                      <ExternalLink size={14} />
                      Ver Página
                    </Link>
                    <Link
                      href={`/eventos/${evento.id}/pdf`}
                      className="flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs py-2.5 rounded-xl transition-all"
                    >
                      <QrCode size={14} />
                      PDF / QR Code
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    {!somenteLeitura ? (
                    <button
                      onClick={() => handleToggleStatus(evento)}
                      className={`text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                        isAgendado
                          ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                          : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                    >
                      {isAgendado ? "Encerrar Evento" : "Reabrir Evento"}
                    </button>
                    ) : (
                      <span />
                    )}

                    <Link
                      href={`/eventos/${evento.id}/editar`}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-600 text-xs font-bold transition-all p-1"
                    >
                      {eventoSomenteLeitura(evento) ? (
                        <Eye size={14} />
                      ) : (
                        <Edit3 size={14} />
                      )}
                      {eventoSomenteLeitura(evento) ? "Visualizar" : "Editar"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPaginas > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Anterior"
          >
            ‹
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => setPagina(i)}
              className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                i === pagina
                  ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-stone-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina + 1 >= totalPaginas}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Próxima"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
