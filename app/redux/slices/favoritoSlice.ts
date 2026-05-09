import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    animais: []
}

const favoritosSlice = createSlice(
    {
        name:'favoritos',
        initialState,
        reducers:{
            adicionarFavoritos: (state, action: PayloadAction<{animais: string}> ) =>{
         
            } ,
            removerFavoritos : (state, action: PayloadAction<{animais: string}> ) =>{
               
            }
        }
    }
);

export const { adicionarFavoritos, removerFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer;