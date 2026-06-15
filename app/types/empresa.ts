import { UsuarioAdmin } from "./usuarios";

export class Empresa {
  constructor(
    public id: number | null,
    public nameFantasia: string,
    public razaoSocial: string,
    public cnpj: string,
    public usuarioAdmin: UsuarioAdmin,
  ) {}
}

export interface EmpresaFormProps {
  empresaExistente?: Empresa;
}
