import { Usuario } from "./usuarios";

export class Adotante extends Usuario {
  constructor(
    id: number | null,
    name: string,
    email: string,
    status: string,
    senha: string,

    public cpf: string,
    public identidade: string,
    public endereco: string,
    public bairro: string,
    public cidade: string,
    public uf: string,
    public profissao: string,
    public telefoneFixo: string,
    public telefoneMovel: string,
  ) {
    super(id, name, email, status, senha);
  }
}

export interface AdotanteFormProps {
  adotanteExistente?: Adotante;
}
