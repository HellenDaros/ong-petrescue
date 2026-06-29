"use client";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";

export default function Header() {
  // const { usuario, logout } = useAuth();

  const dispatch = useDispatch();
  const usuario = store.getState().auth.usuario;

  return (
    <header className="bg-[#f1f5f4] border-b border-stone-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              className="w-5 h-5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-800 font-black text-base tracking-tight leading-tight">
              {usuario?.name.toLocaleUpperCase() || "USUÁRIO INDEFINIDO"}
            </span>
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-wider">
              {usuario?.role == "ROLE_ADOTANTE"
                ? "Painel Adotante"
                : "Painel ONG"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="group relative flex items-center"
          onClick={(e) => {
            dispatch(logout());
          }}
        >
          <div className="flex items-center gap-2 bg-[#1e293b] hover:bg-orange-500 text-white pl-5 pr-8 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 text-white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="text-sm">Sair</span>
          </div>
        </button>
      </div>
    </header>
  );
}
