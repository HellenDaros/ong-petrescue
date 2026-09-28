import BotaoVoltar from "@/app/components/BotaoVoltar";
import UsuarioForm from "../components/UsuarioForm";

export default function cadastrarUsuario() {
  return (
    <div>
      <BotaoVoltar href="/usuarios">Voltar para gestão de Usuários</BotaoVoltar>
      <UsuarioForm />
    </div>
  );
}
