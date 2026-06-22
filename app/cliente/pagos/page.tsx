"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner, Badge } from "@/components/ui";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ClientePagosPage() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const dni = user.email?.replace("@evenser.internal", "");
      const { data: cliente } = await supabase
        .from("clients")
        .select("id")
        .eq("dni", dni)
        .single();
      if (!cliente) return;
      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("cliente_id", cliente.id)
        .order("fecha", { ascending: false });
      setPagos(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const estadoVariant: Record<string, "green" | "amber" | "red"> = {
    pagado: "green", pendiente: "amber", vencido: "red",
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Mis pagos</h1>
      {!pagos.length ? (
        <div className="card p-8 text-center text-gray-400 text-sm">Sin pagos registrados</div>
      ) : (
        <div className="space-y-3">
          {pagos.map((p) => (
            <div key={p.id} className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{formatCurrency(p.monto)}</span>
                <Badge variant={estadoVariant[p.estado]}>{p.estado}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(p.fecha)}</span>
                <span className="capitalize">{p.metodo_pago.replace("_", " ")}</span>
              </div>
              {p.descripcion && (
                <p className="text-xs text-gray-400">{p.descripcion}</p>
              )}
              {p.fecha_vence && (
                <p className="text-xs text-gray-400">Vence: {formatDate(p.fecha_vence)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
