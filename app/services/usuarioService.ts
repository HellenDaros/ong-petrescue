import api from "./api";
import { Usuario } from "../types/usuarios";
import axios from "axios";

export async function buscarListaUsuarios(): Promise<Usuario[]> {
  const dados = await api.get<Usuario[]>("/usuarios");
  if (dados.status == 200) {
    return dados.data;
  }
  return [];
}

export async function alterarStatusUsuario(usuario: Usuario): Promise<void> {
  var novoStatus = {};
  if (usuario.status === "ATIVO") {
    novoStatus = { status: "INATIVO" };
  } else {
    novoStatus = { status: "ATIVO" };
    //novos testes
  }

  const response = await api.put(
    `/usuarios/${usuario.id}/AlterarStatus`,
    novoStatus,
  );

  if (response.status !== 200) {
    alert("Erro ao atualizar status!");
  }
}

export async function buscarUsuarioPorId(id: number): Promise<Usuario | null> {
  try {
    const response = await api.get<Usuario>(`/usuarios/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
  }

  return null;
}

export async function salvarUsuario(
  usuario: Usuario,
  isEdicao: boolean,
): Promise<boolean> {
  try {
    let response;

    if (isEdicao) {
      response = await api.put(`/usuarios/${usuario.id}`, usuario);
    } else {
      response = await api.post("/usuarios", usuario);
    }

    return response.status === 200 || response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const erroDoBackend = error.response.data;
      throw new Error(erroDoBackend);
    }

    console.error("Erro inesperado no service:", error);
    throw new Error("Erro de conexão com o servidor. Tente novamente.");
    return false;
  }
}

export async function buscarUsuarioLogado(): Promise<Usuario> {
  return (await api.get<Usuario>("/usuarios/usuariologado")).data;
}
