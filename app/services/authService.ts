import api from "./api";
import {
  EsqueciSenhaRequest,
  LoginRequest,
  LoginResponse,
  RedefinirSenhaRequest,
} from "../types/auth";

export async function loginService(
  login: LoginRequest,
): Promise<LoginResponse> {
  var loginResult = await api.post<LoginResponse>("/auth/login", login);

  return loginResult.data;
}

export async function solicitarRecuperacaoSenha(
  request: EsqueciSenhaRequest,
): Promise<string> {
  const response = await api.post<string>("/auth/esqueci-senha", request);

  return response.data;
}

export async function redefinirSenha(
  request: RedefinirSenhaRequest,
): Promise<string> {
  const response = await api.post<string>("/auth/redefinir-senha", request);

  return response.data;
}
