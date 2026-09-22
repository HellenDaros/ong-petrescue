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
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const usuario = useSelector((state: RootState) => state.auth.usuario);

  const menuItems = [
    {
      name: "Home",
      href: "/home",
      icon: LayoutDashboard,
      roles: ["ROLE_ADMIN", "ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO_ONG"],
    },
    {
      name: "Página Inicial",
      href: "/",
      icon: BookImage,
    },
    { name: "Ong", href: "/empresa", icon: Settings, roles: ["ROLE_ADMIN"] },
    {
      name: "Usuários",
      href: "/usuarios",
      icon: Users,
      roles: ["ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO_ONG"],
    },
    {
      name: "Adotante",
      href: "/adotantes",
      icon: User,
      roles: ["ROLE_ADOTANTE"],
    },
    {
      name: "Favoritos",
      href: "/favoritos",
      icon: Heart,
      roles: ["ROLE_ADOTANTE"],
    },
    {
      name: "Minhas Adoções",
      href: "/adocoes/minhas",
      icon: FilePen,
      roles: ["ROLE_ADOTANTE"],
    },
    {
      name: "Animais",
      href: "/animais",
      icon: PawPrint,
      roles: ["ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO_ONG"],
    },
    {
      name: "Eventos",
      href: "/eventos",
      icon: Calendar,
      roles: ["ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO_ONG"],
    },
    {
      name: "Gerenciar Adoções",
      href: "/adocoes/gerenciamento",
      icon: FileText,
      roles: ["ROLE_ADMIN_ONG", "ROLE_FUNCIONARIO_ONG"],
    },
  ];

  const menuPermitido = menuItems.filter(
    (item) => !item.roles || item.roles.includes(usuario?.role ?? ""),
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen bg-white border-r border-stone-100
          flex flex-col p-6 z-50 transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-72 md:w-24" : "w-72"}
        `}
      >
        <div
          className={`flex items-center gap-3 px-2 mb-12 ${collapsed ? "md:justify-center md:px-0" : ""}`}
        >
          <span
            className={`text-xl text-teal-600 font-black tracking-tighter text-slate-800 ${collapsed ? "md:hidden" : ""}`}
          >
            I🧡PET
          </span>
          {collapsed && <span className="hidden md:inline text-xl">🧡</span>}
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto md:hidden text-slate-400 hover:text-slate-600"
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expandir menu" : "Encolher menu"}
          className="hidden md:flex absolute -right-3 top-9 w-6 h-6 items-center justify-center rounded-full bg-white border border-stone-200 shadow-md text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4 mb-4">
              Menu Principal
            </p>
          )}

          {menuPermitido.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group
                  ${collapsed ? "md:justify-center md:px-0" : ""}
                  ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-500 hover:bg-stone-50 hover:text-slate-700"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"}`}
                />
                <span className={collapsed ? "md:hidden" : ""}>
                  {item.name}
                </span>
                {isActive && (
                  <div
                    className={`ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse ${collapsed ? "md:hidden" : ""}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* <div className="mt-auto pt-6 border-t border-stone-100">
          <button className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group">
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-bold">Sair do Painel</span>
          </button>
        </div> */}
      </aside>
    </>
  );
}
