import { Animal } from "./animal";

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string; // YYYY-MM-DD
  horarioInicio: string; // HH:mm
  horarioTermino: string; // HH:mm
  nomeLocal?: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
  urlCapa?: string;
  status: "AGENDADO" | "ENCERRADO";
  empresaId?: number;
  empresaNome?: string;
  animais: Animal[];
}

export interface EventoRequest {
  nome: string;
  descricao: string;
  data: string;
  horarioInicio: string;
  horarioTermino: string;
  nomeLocal?: string;
  cep: string;
  complemento?: string;
  urlCapa?: string;
  status?: "AGENDADO" | "ENCERRADO";
  animaisIds: number[];
}

export interface AlterarStatusEventoRequest {
  status: "AGENDADO" | "ENCERRADO";
}

export interface EventoFormProps {
  eventoExistente?: Evento;
}

export function formatarLocalEvento(evento: Evento): string {
  const enderecoCompleto = [
    evento.endereco,
    evento.bairro,
    evento.cidade && evento.uf ? `${evento.cidade}/${evento.uf}` : evento.cidade,
  ]
    .filter(Boolean)
    .join(", ");

  return evento.nomeLocal
    ? [evento.nomeLocal, enderecoCompleto].filter(Boolean).join(" - ")
    : enderecoCompleto;
}
