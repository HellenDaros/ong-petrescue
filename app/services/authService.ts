import api from "./api";
import { LoginResponse } from "../types/auth";

interface LoginParams {
  email: string;
  senha: string;
}

export async function loginResult({
  email,
  senha,
}: LoginParams): Promise<LoginResponse | null> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      senha,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }

  return null;
}