import Link from "next/link";

export default function BotaoEditar({
  href,
  desabilitado,
  motivoDesabilitado,
  children,
}: {
  href: string;
  desabilitado: boolean;
  motivoDesabilitado: string;
  children: React.ReactNode;
}) {
  if (desabilitado) {
    return (
      <span
        aria-disabled="true"
        className="p-2 bg-stone-100 text-stone-300 rounded-xl cursor-not-allowed"
        title={motivoDesabilitado}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="p-2 bg-amber-50 text-amber-400 hover:bg-amber-100 hover:text-amber-500 rounded-xl transition-all"
      title="Editar"
    >
      {children}
    </Link>
  );
}
