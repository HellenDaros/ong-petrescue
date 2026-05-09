import { AuthSlice } from "@/app/types/auth";
import { Usuario } from "@/app/types/usuarios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import  Cookies  from 'js-cookie';

const usuarioRecover = Cookies.get('usuario');
const tokenRecover = Cookies.get('token');

const initialState: AuthSlice = {
    usuario: usuarioRecover ? JSON.parse(usuarioRecover) as Usuario:null,
    token: tokenRecover ?? ""
}

const authSlice = createSlice(
    {
        name:'auth',
        initialState,
        reducers:{
            login: (state, action: PayloadAction<{usuario: Usuario, token: string}> ) =>{
                state.token = action.payload.token;
                state.usuario = action.payload.usuario;
                       Cookies.set('usuario', JSON.stringify(action.payload.usuario),{expires:7})
                     Cookies.set('token', action.payload.token, {expires:7, secure:true})
            } ,
            logout : (state) =>{
                state.token = "";
                state.usuario = null;
                Cookies.remove('usuario');
                Cookies.remove('token');
            }
        }
    }
);

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;