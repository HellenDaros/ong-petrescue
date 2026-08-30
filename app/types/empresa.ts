import { Usuario } from "./usuarios";

export class Empresa {
  constructor(
    public id: number | null,
    public nameFantasia: string,
    public razaoSocial: string,
    public cnpj: string,
    public cep: string,
    public endereco: string,
    public bairro: string,
    public cidade: string,
    public uf: string,
    public complemento: string | null,
    public usuarioAdmin: Usuario,
  ) {}
}

export interface EmpresaFormProps {
  empresaExistente?: Empresa;
}
