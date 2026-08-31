import api from "./api";
import { Evento, EventoRequest, AlterarStatusEventoRequest } from "../types/evento";
import axios from "axios";

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
  try {
    const response = await api.post<number>("/eventos", evento);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
    throw new Error("Erro ao cadastrar evento. Tente novamente.");
  }
};

export const atualizarEvento = async (id: number, evento: EventoRequest): Promise<string> => {
  try {
    const response = await api.put<string>(`/eventos/${id}`, evento);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
    throw new Error("Erro ao atualizar evento. Tente novamente.");
  }
};

export const salvarEvento = async (
  evento: EventoRequest,
  isEdicao: boolean,
  id?: number,
): Promise<void> => {
  if (isEdicao && id) {
    await atualizarEvento(id, evento);
  } else {
    await cadastrarEvento(evento);
  }
};

export const alterarStatusEvento = async (
  id: number,
  status: "AGENDADO" | "ENCERRADO"
): Promise<string> => {
  try {
    const request: AlterarStatusEventoRequest = { status };
    const response = await api.put<string>(`/eventos/${id}/status`, request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
    throw new Error("Erro ao alterar status do evento. Tente novamente.");
  }
};
