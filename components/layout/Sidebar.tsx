"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Briefcase,
  Handshake,
  BarChart3,
  Menu,
  X,
  LogOut,
  Settings,
  HeartPulse,
  PawPrint,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const nav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/servicios", label: "Servicios", icon: Briefcase },
  { href: "/admin/convenios", label: "Convenios", icon: Handshake },
  { href: "/admin/fallecidos", label: "Fallecidos", icon: HeartPulse },
  { href: "/admin/mascotas", label: "Cremación mascotas", icon: PawPrint },
  { href: "/admin/contabilidad", label: "Contabilidad", icon: BookOpen },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-brand-50 text-brand-800 border border-brand-100"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <span className="font-bold text-brand-800 text-lg">Evenser</span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">E</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Evenser</p>
              <p className="text-xs text-gray-500">Gestión Funeraria</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              active={isActive(href)}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <NavLink
            href="/admin/configuracion"
            label="Configuración"
            icon={Settings}
            active={pathname === "/admin/configuracion"}
            onClick={() => setOpen(false)}
          />
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
