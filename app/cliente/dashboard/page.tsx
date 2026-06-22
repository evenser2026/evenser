"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner, Badge } from "@/components/ui";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ClienteDashboardPage() {
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const dni = user.email?.replace("@evenser.internal", "");
      const { data } = await supabase
        .from("clients")
        .select("*, payments(*), family_members(*)")
        .eq("dni", dni)
        .single();
      setCliente(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;
  if (!cliente) return <div className="p-8 text-center text-gray-400">No se encontró tu cuenta.</div>;

  const ultimoPago = cliente.payments?.sort((a: any, b: any) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )[0];

  const estadoVariant: Record<string, "green" | "amber" | "red"> = {
    pagado: "green", pendiente: "amber", vencido: "red",
  };

  const iniciales = (nombre: string, apellido: string) =>
    `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-4">
      <div className="pt-1 pb-2">
        <h1 className="text-xl font-semibold text-brand-950">Hola, {cliente.nombre} 👋</h1>
        <p className="text-sm text-brand-500">{cliente.localidad} · Afiliado/a activo/a</p>
      </div>

      <div className="card p-5 space-y-0 border-l-4 border-l-brand-700">
        <p className="text-xs text-brand-400 uppercase tracking-wider font-medium mb-3">Estado de cuenta</p>
        {ultimoPago ? (
          <>
            <p className="text-3xl font-semibold text-brand-950 mb-3">{formatCurrency(ultimoPago.monto)}</p>
            <div className="flex items-center justify-between py-2 border-b border-brand-100">
              <span className="text-sm text-brand-500">Último pago</span>
              <span className="text-sm font-medium text-brand-900">{formatDate(ultimoPago.fecha)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-brand-100">
              <span className="text-sm text-brand-500">Estado</span>
              <Badge variant={estadoVariant[ultimoPago.estado]}>{ultimoPago.estado}</Badge>
            </div>
            {ultimoPago.fecha_vence && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-brand-500">Próximo vencimiento</span>
                <span className="text-sm font-medium text-brand-900">{formatDate(ultimoPago.fecha_vence)}</span>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-brand-300">Sin pagos registrados</p>
        )}
      </div>

      <div className="card p-5">
        <p className="text-xs text-brand-400 uppercase tracking-wider font-medium mb-3">Grupo familiar</p>
        {cliente.family_members?.length ? (
          <div className="space-y-0">
            {cliente.family_members.map((f: any) => (
              <div key={f.id} className="flex items-center gap-3 py-2 border-b border-brand-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-700 shrink-0">
                  {iniciales(f.nombre, f.apellido)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-900">{f.nombre} {f.apellido}</p>
                  <p className="text-xs text-brand-400">{f.parentesco}</p>
                </div>
                {f.edad && <span className="text-xs text-brand-400 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">{f.edad} años</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-300">Sin familiares registrados</p>
        )}
      </div>
    </div>
  );
}
