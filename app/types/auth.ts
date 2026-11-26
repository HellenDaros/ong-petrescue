import { Adotante } from "./adotante";
import { Usuario } from "./usuarios";

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface EsqueciSenhaRequest {
  email: string;
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
}

export interface AuthSlice {
  usuario: Usuario | Adotante | null;
  token: string;
}
