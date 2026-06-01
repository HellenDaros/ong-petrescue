import { Animal } from "@/app/types/animal";
import { FavoritoState } from "@/app/types/favoritos";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const favoritosRecover = Cookies.get("favoritos_petrescue");

const initialState: FavoritoState = {
  items: favoritosRecover ? (JSON.parse(favoritosRecover) as Animal[]) : [],
};

const favoritoSlice = createSlice({
  name: "favoritos",
  initialState,
  reducers: {
    setFavoritos: (state, action: PayloadAction<{ items: Animal[] }>) => {
      state.items = action.payload.items;
      Cookies.set("favoritos_petrescue", JSON.stringify(state.items), {
        expires: 30,
      });
    },
    adicionarFavorito: (state, action: PayloadAction<{ animal: Animal }>) => {
      if (!state.items.some((fav) => fav.id === action.payload.animal.id)) {
        state.items.push(action.payload.animal);
        Cookies.set("favoritos_petrescue", JSON.stringify(state.items), {
          expires: 30,
        });
      }
    },
    removerFavorito: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter(
        (animal) => animal.id !== action.payload.id,
      );
      Cookies.set("favoritos_petrescue", JSON.stringify(state.items), {
        expires: 30,
      });
    },
  },
});

export const { setFavoritos, adicionarFavorito, removerFavorito } =
  favoritoSlice.actions;
export default favoritoSlice.reducer;
