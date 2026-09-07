"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, PenTool, X } from "lucide-react";

interface AssinaturaModalProps {
  assinaturaAtual?: string | null;
  onFechar: () => void;
  onSalvar: (assinaturaBase64: string) => void;
}

/**
 * Modal com um "editor" de assinatura em canvas. É desmontada pelo
 * componente pai (renderização condicional) para que cada abertura
 * comece com o traço em branco (ou pré-carregado, se já houver assinatura).
 */
export default function AssinaturaModal({
  assinaturaAtual,
  onFechar,
  onSalvar,
}: AssinaturaModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desenhandoRef = useRef(false);
  const ultimoPontoRef = useRef<{ x: number; y: number } | null>(null);
  const ultimoMeioRef = useRef<{ x: number; y: number } | null>(null);
  const [temTraco, setTemTraco] = useState(!!assinaturaAtual);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e293b";

    if (assinaturaAtual) {
      const imagem = new Image();
      imagem.onload = () => ctx.drawImage(imagem, 0, 0, rect.width, rect.height);
      imagem.src = assinaturaAtual;
    }
  }, [assinaturaAtual]);

  const obterPosicao = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const pos = obterPosicao(e);
    ultimoPontoRef.current = pos;
    ultimoMeioRef.current = pos;
    desenhandoRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (
      !desenhandoRef.current ||
      !ultimoPontoRef.current ||
      !ultimoMeioRef.current
    )
      return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const atual = obterPosicao(e);
    const ultimo = ultimoPontoRef.current;
    const meio = { x: (ultimo.x + atual.x) / 2, y: (ultimo.y + atual.y) / 2 };

    // Curva suave ligando o meio anterior ao novo meio, usando o ponto
    // capturado como controle — cada segmento continua exatamente de
    // onde o anterior terminou, sem deixar vãos entre eles.
    ctx.beginPath();
    ctx.moveTo(ultimoMeioRef.current.x, ultimoMeioRef.current.y);
    ctx.quadraticCurveTo(ultimo.x, ultimo.y, meio.x, meio.y);
    ctx.stroke();

    ultimoMeioRef.current = meio;
    ultimoPontoRef.current = atual;
    setTemTraco(true);
  };

  const finalizarTraco = () => {
    desenhandoRef.current = false;
    ultimoPontoRef.current = null;
    ultimoMeioRef.current = null;
  };

  const handleLimpar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setTemTraco(false);
  };

  const handleSalvar = () => {
    const canvas = canvasRef.current;
    if (!canvas || !temTraco) return;
    onSalvar(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-stone-100 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-8">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              Assinatura Digital
            </h3>
            <p className="text-slate-500 text-xs font-medium mt-1">
              Assine no campo abaixo com o mouse ou o dedo (touch).
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-stone-100 transition-all"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="px-8 pt-6">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finalizarTraco}
            onPointerLeave={finalizarTraco}
            className="w-full h-56 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 touch-none cursor-default"
          />
        </div>

        <div className="flex items-center justify-between gap-3 p-8 pt-6">
          <button
            type="button"
            onClick={handleLimpar}
            className="inline-flex items-center gap-2 py-3 px-4 bg-white border border-stone-200 text-slate-500 hover:bg-stone-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <Eraser size={14} strokeWidth={3} />
            Limpar
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onFechar}
              className="py-3 px-5 bg-white border border-stone-200 text-slate-500 hover:bg-stone-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={!temTraco}
              className="inline-flex items-center gap-2 py-3 px-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            >
              <PenTool size={14} strokeWidth={3} />
              Salvar Assinatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
