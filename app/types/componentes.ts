import { ReactNode } from "react";

export interface BotaoVoltarProps {
  href: string;
  children: ReactNode;
}

export interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export interface CampoDataProps {
  value: string; // YYYY-MM-DD
  onChange: (valor: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  className?: string;
  alinhar?: "esquerda" | "direita";
  expandirNoMobile?: boolean;
}

export type TipoCampo = "texto" | "numero" | "select" | "data";

export interface OpcaoFiltro {
  valor: string;
  rotulo: string;
}

export interface CampoAdicional {
  rotulo: string;
  tipo: TipoCampo;
  valor: string;
  onFiltrar: (valor: string) => void;
  opcoes?: OpcaoFiltro[] | ((valorPrincipal: string) => OpcaoFiltro[]);
  dependeDoPrincipal?: boolean;
  textoSemPrincipal?: string;
}

export interface FiltroColunaProps {
  titulo: string;
  tipo: TipoCampo;
  valor: string;
  onFiltrar: (valor: string) => void;
  rotuloPesquisa?: string;
  opcoes?: OpcaoFiltro[];
  adicionais?: CampoAdicional[];
  ordenavel?: boolean;
  ordenacaoAtiva?: "asc" | "desc" | null;
  onOrdenar?: (direcao: "asc" | "desc") => void;
  textoCrescente?: string;
  textoDecrescente?: string;
}
