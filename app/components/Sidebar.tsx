"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Heart,
  LogOut,
  Settings,
  BookImage,
  PawPrint,
  FilePen,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function Sidebar() {
  const pathname = usePathname();

  const usuario = useSelector((state: RootState) => state.auth.usuario);

  const menuItems = [
    {
      name: "Home",
      href: "/home",
      icon: LayoutDashboard,
      roles: ["ROLE_ADMIN", "ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO"],
    },
    { name: "Ong", href: "/ong", icon: Settings, roles: ["ROLE_ADMIN"] },
    {
      name: "Usuários",
      href: "/usuarios",
      icon: Users,
      roles: ["ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO"],
    },
    {
      name: "Adotante",
      href: "/adotantes",
      icon: User,
      roles: ["ROLE_ADOTANTE"],
    },
    { name: "Galeria", href: "/galeria", icon: BookImage },
    {
      name: "Favoritos",
      href: "/favoritos",
      icon: Heart,
      roles: ["ROLE_ADOTANTE"],
    },
    {
      name: "Animais",
      href: "/animais",
      icon: PawPrint,
      roles: ["ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO"],
    },
  ];

  const menuPermitido = menuItems.filter(
    (item) => !item.roles || item.roles.includes(usuario?.role ?? ""),
  );

  return (
    <aside className="w-72 h-screen bg-white border-r border-stone-100 flex flex-col p-6 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="bg-teal-600 p-2 rounded-2xl shadow-lg shadow-teal-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-6 h-6"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-800">
          PET
          <span className="text-orange-500 underline decoration-2 underline-offset-4">
            RESCUE
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4 mb-4">
          Menu Principal
        </p>

        {menuPermitido.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          console.log("usuario sidebar", usuario);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group
                ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-stone-50 hover:text-slate-700"
                }
              `}
            >
              <Icon
                size={20}
                className={`${isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-stone-100">
        <button className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group">
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-bold">Sair do Painel</span>
        </button>
      </div>
    </aside>
  );
}
