import api from "./api";
import { Evento, EventoRequest, AlterarStatusEventoRequest } from "../types/evento";

export const listarEventosOng = async (): Promise<Evento[]> => {
  const response = await api.get<Evento[]>("/eventos");
  return response.data;
};

export const listarEventosPublicos = async (): Promise<Evento[]> => {
  const response = await api.get<Evento[]>("/eventos/publicos");
  return response.data;
};

export const buscarEventoPublicoPorId = async (id: number): Promise<Evento> => {
  const response = await api.get<Evento>(`/eventos/publicos/${id}`);
  return response.data;
};

export const buscarEventoPorId = async (id: number): Promise<Evento> => {
  const response = await api.get<Evento>(`/eventos/${id}`);
  return response.data;
};

export const cadastrarEvento = async (evento: EventoRequest): Promise<number> => {
  const response = await api.post<number>("/eventos", evento);
  return response.data;
};

export const atualizarEvento = async (id: number, evento: EventoRequest): Promise<string> => {
  const response = await api.put<string>(`/eventos/${id}`, evento);
  return response.data;
};

export const alterarStatusEvento = async (
  id: number,
  status: "AGENDADO" | "ENCERRADO"
): Promise<string> => {
  const request: AlterarStatusEventoRequest = { status };
  const response = await api.put<string>(`/eventos/${id}/status`, request);
  return response.data;
};
