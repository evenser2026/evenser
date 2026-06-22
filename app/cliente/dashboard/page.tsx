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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hola, {cliente.nombre} 👋</h1>
        <p className="text-sm text-gray-500">{cliente.localidad}</p>
      </div>

      <div className="card p-5 space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Estado de cuenta</p>
        {ultimoPago ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Último pago</span>
              <span className="text-sm font-semibold">{formatCurrency(ultimoPago.monto)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fecha</span>
              <span className="text-sm">{formatDate(ultimoPago.fecha)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estado</span>
              <Badge variant={estadoVariant[ultimoPago.estado]}>{ultimoPago.estado}</Badge>
            </div>
            {ultimoPago.fecha_vence && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Próximo vencimiento</span>
                <span className="text-sm">{formatDate(ultimoPago.fecha_vence)}</span>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">Sin pagos registrados</p>
        )}
      </div>

      <div className="card p-5 space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Grupo familiar</p>
        {cliente.family_members?.length ? (
          cliente.family_members.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-900">{f.nombre} {f.apellido}</span>
              <span className="text-xs text-gray-400">{f.parentesco}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">Sin familiares registrados</p>
        )}
      </div>
    </div>
  );
}
