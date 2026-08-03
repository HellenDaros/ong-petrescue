import { Animal } from "./animal";

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string; // YYYY-MM-DD
  horarioInicio: string; // HH:mm
  horarioTermino: string; // HH:mm
  local: string;
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
  local: string;
  urlCapa?: string;
  status?: "AGENDADO" | "ENCERRADO";
  animaisIds: number[];
}

export interface AlterarStatusEventoRequest {
  status: "AGENDADO" | "ENCERRADO";
}
