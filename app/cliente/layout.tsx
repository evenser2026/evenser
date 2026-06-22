"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Home, CreditCard, User, LogOut } from "lucide-react";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user && pathname !== "/cliente") {
        router.push("/cliente");
      }
      setChecking(false);
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/cliente");
  };

  if (checking) return null;
  if (pathname === "/cliente") return <>{children}</>;

  const navItems = [
    { href: "/cliente/dashboard", label: "Inicio", icon: Home },
    { href: "/cliente/pagos", label: "Pagos", icon: CreditCard },
    { href: "/cliente/perfil", label: "Perfil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-brand-50">
      <header className="bg-brand-950 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-white text-sm tracking-wide">Evenser</span>
          <p className="text-xs text-brand-400">Portal de afiliados</p>
        </div>
        <button onClick={handleLogout} className="text-brand-400 hover:text-white transition-colors">
          <LogOut size={18} />
        </button>
      </header>
      <main className="p-4 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 flex">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
              pathname === href ? "text-brand-800 font-medium" : "text-brand-300"
            }`}
          >
            <Icon size={20} />
            {label}
            {pathname === href && <span className="w-1 h-1 rounded-full bg-brand-700" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
