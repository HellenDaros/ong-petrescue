import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BotaoVoltarProps {
  href: string;
  children: React.ReactNode;
}

export default function BotaoVoltar({ href, children }: BotaoVoltarProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 w-fit text-slate-500 hover:text-teal-600 font-bold text-sm transition-colors"
    >
      <ChevronLeft size={16} strokeWidth={3} />
      {children}
    </Link>
  );
}
