import { Usuario } from "./usuarios";

export interface LoginResponse {
  token: string;
}

export interface AuthSlice{
  usuario: Usuario | null,
  token: string
}