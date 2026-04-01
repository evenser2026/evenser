"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  clientes_activos: number;
  clientes_morosos: number;
  ingresos_mes: number;
  servicios_recientes: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);

  const [
    activeClientsResult,
    morososResult,
    ingresosMesResult,
    serviciosRecientesResult,
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("activo", true),

    supabase.from("payments").select("cliente_id").eq("estado", "vencido"),

    supabase
      .from("payments")
      .select("monto")
      .eq("estado", "pagado")
      .gte("fecha", startOfMonth)
      .lte("fecha", endOfMonth),

    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .gte("fecha", thirtyDaysAgoStr),
  ]);

  if (activeClientsResult.error) {
    console.error(
      "Error activeClientsResult:",
      activeClientsResult.error.message,
    );
  }

  if (morososResult.error) {
    console.error("Error morososResult:", morososResult.error.message);
  }

  if (ingresosMesResult.error) {
    console.error("Error ingresosMesResult:", ingresosMesResult.error.message);
  }

  if (serviciosRecientesResult.error) {
    console.error(
      "Error serviciosRecientesResult:",
      serviciosRecientesResult.error.message,
    );
  }

  const clientes_activos = activeClientsResult.count ?? 0;

  const clientes_morosos = morososResult.data
    ? new Set(morososResult.data.map((p) => p.cliente_id).filter(Boolean)).size
    : 0;

  const ingresos_mes = ingresosMesResult.data
    ? ingresosMesResult.data.reduce(
        (acc, pago) => acc + Number(pago.monto ?? 0),
        0,
      )
    : 0;

  const servicios_recientes = serviciosRecientesResult.count ?? 0;

  return {
    clientes_activos,
    clientes_morosos,
    ingresos_mes,
    servicios_recientes,
  };
}
