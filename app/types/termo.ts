export interface Termo {
  id: number;
  titulo: string;
  conteudo: string;
  ativo: boolean;
  textoPadrao: boolean;
  dataAtualizacao: string;
}

export interface TermoRequest {
  titulo: string;
  conteudo: string;
  textoPadrao: boolean;
}

export interface TermoFormProps {
  termoExistente?: Termo;
}

export interface AlterarStatusTermoRequest {
  ativo: boolean;
}
