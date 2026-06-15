export class Usuario {
  constructor(
    public id: number | null,
    public name: string,
    public email: string,
    public cpf: string | null,
    public status: string,
    public senha: string,
  ) {}
}

export class UsuarioAdmin {
  constructor(
    public name: string,
    public email: string,
    public senha: string,
    public cpf: string,
  ) {}
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export interface UsuarioFormProps {
  usuarioExistente?: Usuario;
}
