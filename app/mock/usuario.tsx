// import { Usuario } from "../context/AuthContext";

// export class UsuarioMock{

//     private static usuarioDB: Usuario[] = [
//                 new Usuario(1,"Hellen Daros", "46566356", "ATIVO"),
//                 new Usuario(2,"João Silva", "9556635566", "ATIVO"),
//                 new Usuario(3,"Maria Souza", "659856896", "ATIVO"),
//                 new Usuario(4,"Lucas Gomes", "685406665", "ATIVO"),
//                 new Usuario(5,"Fernanda Ferreira", "49856985", "ATIVO"),
//     ]; 
    
//     static async listarTodos(): Promise<Usuario[]>{
//         return [...this.usuarioDB]
//     }

//     static async salvar(usuario: Usuario):Promise<void>{

//         const indexExistente = this.usuarioDB.findIndex(u=> u.id === usuario.id)

//         if (indexExistente === -1){

//         const novoCodigo = Math.max(...this.usuarioDB.map(u=>u.id??0)) + 1;

//         usuario.id = novoCodigo

//         this.usuarioDB.push(usuario)

//         console.log(`Usuario Id${novoCodigo} salvo com sucesso`)

//         } else{
//             this.usuarioDB[indexExistente].name = usuario.name
//             this.usuarioDB[indexExistente].email = usuario.email

//             console.log(`Usuario Id${usuario.id} atualizado com sucesso!`)
//         }

        
//     } 

//     static async buscarPorId(codigo: Number): Promise<Usuario| undefined>{

//         return this.usuarioDB.find(u=>u.id === codigo)

//     }
// }