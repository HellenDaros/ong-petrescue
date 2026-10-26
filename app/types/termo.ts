export interface Termo {
  id: number;
  titulo: string;
  conteudo: string;
  ativo: boolean;
  dataAtualizacao: string;
}

export interface TermoRequest {
  titulo: string;
  conteudo: string;
}

export interface TermoFormProps {
  termoExistente?: Termo;
}

export interface AlterarStatusTermoRequest {
  ativo: boolean;
}
