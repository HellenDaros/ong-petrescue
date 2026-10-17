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

export interface EventosPaginados {
  content: Evento[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface FiltrosEventos {
  nome: string;
  cidade: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  direcao: "asc" | "desc";
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

export function formatarDataBR(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

export function eventoJaPassou(evento: Evento): boolean {
  const hoje = new Date();
  const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  return evento.data < hojeISO;
}

export function eventoSomenteLeitura(evento: Evento): boolean {
  return evento.status === "ENCERRADO" || eventoJaPassou(evento);
}

export function formatarLocalEvento(evento: Evento): string {
  const enderecoCompleto = [
    evento.endereco,
    evento.bairro,
    evento.cidade && evento.uf
      ? `${evento.cidade}/${evento.uf}`
      : evento.cidade,
  ]
    .filter(Boolean)
    .join(", ");

  return evento.nomeLocal
    ? [evento.nomeLocal, enderecoCompleto].filter(Boolean).join(" - ")
    : enderecoCompleto;
}
