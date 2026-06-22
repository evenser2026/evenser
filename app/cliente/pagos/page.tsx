"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner, Badge } from "@/components/ui";
import { formatDate, formatCurrency } from "@/lib/utils";

function imprimirComprobante(p: any, clienteNombre: string) {
  const win = window.open("", "_blank", "width=600,height=700");
  if (!win) return;
  win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante de pago</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; max-width: 520px; margin: 0 auto; }
    .logo { font-size: 22px; font-weight: bold; color: #1a1a2e; margin-bottom: 4px; }
    .subtitulo { font-size: 12px; color: #666; margin-bottom: 32px; }
    h2 { font-size: 16px; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin-bottom: 20px; }
    .fila { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .fila:last-child { border-bottom: none; }
    .label { color: #666; }
    .valor { font-weight: 600; }
    .monto { font-size: 24px; font-weight: bold; color: #16a34a; text-align: center; margin: 24px 0; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #15803d; }
    .pie { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="logo">Evenser</div>
  <div class="subtitulo">Eventos y Servicios Sociales</div>
  <h2>Comprobante de pago</h2>
  <div class="monto">${formatCurrency(p.monto)}</div>
  <div class="fila"><span class="label">Afiliado</span><span class="valor">${clienteNombre}</span></div>
  <div class="fila"><span class="label">Fecha de pago</span><span class="valor">${formatDate(p.fecha)}</span></div>
  <div class="fila"><span class="label">Método</span><span class="valor">${p.metodo_pago.replace(/_/g, " ")}</span></div>
  <div class="fila"><span class="label">Tipo</span><span class="valor">${p.tipo_pago}</span></div>
  ${p.descripcion ? `<div class="fila"><span class="label">Descripción</span><span class="valor">${p.descripcion}</span></div>` : ""}
  ${p.fecha_vence ? `<div class="fila"><span class="label">Período hasta</span><span class="valor">${formatDate(p.fecha_vence)}</span></div>` : ""}
  ${p.insep_numero ? `<div class="fila"><span class="label">Nro. INSEP</span><span class="valor">${p.insep_numero}</span></div>` : ""}
  <div class="fila"><span class="label">Estado</span><span class="badge">Pagado</span></div>
  <div class="pie">Comprobante generado el ${new Date().toLocaleDateString("es-AR")} · Evenser</div>
  <br>
  <div style="text-align:center"><button onclick="window.print()" style="padding:10px 24px;background:#1a1a2e;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Imprimir / Guardar PDF</button></div>
</body>
</html>`);
  win.document.close();
}

export default function ClientePagosPage() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clienteNombre, setClienteNombre] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const dni = user.email?.replace("@evenser.internal", "");
      const { data: cliente } = await supabase
        .from("clients")
        .select("id, nombre, apellido")
        .eq("dni", dni)
        .single();
      if (!cliente) return;
      setClienteNombre(`${cliente.apellido}, ${cliente.nombre}`);
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
              {p.estado === "pagado" && (
                <button
                  onClick={() => imprimirComprobante(p, clienteNombre)}
                  className="w-full mt-1 text-xs text-brand-700 border border-brand-200 rounded-md py-1.5 hover:bg-brand-50 transition-colors"
                >
                  Descargar comprobante
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
