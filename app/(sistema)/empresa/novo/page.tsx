import BotaoVoltar from "@/app/components/BotaoVoltar";
import EmpresaForm from "../components/empresa-form";

export default function CadastrarEmpresa() {
  return (
    <div>
      <BotaoVoltar href="/empresa">Voltar para gestão de Empresas</BotaoVoltar>

      <EmpresaForm />
    </div>
  );
}
