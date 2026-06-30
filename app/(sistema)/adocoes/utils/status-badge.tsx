import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getStatusBadge = (
  status: "PENDENTE" | "APROVADO" | "REJEITADO",
) => {
  switch (status) {
    case "APROVADO":
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <CheckCircle size={14} />
          Aprovado
        </span>
      );
    case "REJEITADO":
      return (
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <XCircle size={14} />
          Recusado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <Clock size={14} />
          Pendente
        </span>
      );
  }
};
