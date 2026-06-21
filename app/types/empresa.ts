import { Usuario } from "./usuarios";

export class Empresa {
  constructor(
    public id: number | null,
    public nameFantasia: string,
    public razaoSocial: string,
    public cnpj: string,
    public usuarioAdmin: Usuario,
  ) {}
}

export interface EmpresaFormProps {
  empresaExistente?: Empresa;
}
