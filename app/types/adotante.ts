import { Usuario } from "./usuarios";

export class Adotante extends Usuario {
  constructor(
    id: number | null,
    name: string,
    email: string,
    cpf: string,
    status: string,
    senha: string,
    role: string | null,

    public identidade: string,
    public endereco: string,
    public bairro: string,
    public cidade: string,
    public uf: string,
    public profissao: string,
    public telefoneFixo: string,
    public telefoneMovel: string,
  ) {
    super(id, name, email, cpf, status, senha, role);
  }
}

export interface AdotanteFormProps {
  adotanteExistente?: Adotante;
  redirectTo?: string;
}
