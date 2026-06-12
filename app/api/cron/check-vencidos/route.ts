import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { enviarNotificacion } from "@/lib/actions/push";
import { sendTelegram } from "@/lib/telegram";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Admin client para bypasear RLS — los crons corren sin sesión de usuario
  const supabase = createAdminClient();

  const hoyStr = new Date().toISOString().split("T")[0];

  // ✅ Marcar como vencidos todos los pagos pendientes con fecha pasada
  // Sin esto el cron nunca encuentra nada porque nadie los marcaba antes
  const { data: marcadosData } = await supabase
    .from("payments")
    .update({ estado: "vencido" })
    .eq("estado", "pendiente")
    .lt("fecha", hoyStr)
    .select("id");

  const marcados = marcadosData?.length ?? 0;
  console.log(`[check-vencidos] Pagos marcados como vencidos: ${marcados}`);

  const { data: clientes } = await supabase
    .from("clients")
    .select("id, nombre, apellido")
    .eq("activo", true);

  if (!clientes?.length) {
    return NextResponse.json({ mensaje: "Sin clientes activos", enviados: 0 });
  }

  let enviados = 0;

  for (const cliente of clientes) {
    const { data: pagos } = await supabase
      .from("payments")
      .select("id, fecha, estado")
      .eq("cliente_id", cliente.id)
      .eq("estado", "vencido");

    if (pagos?.length) {
      const result = await enviarNotificacion({
        titulo: "🔴 Pago vencido",
        cuerpo: `${cliente.nombre} ${cliente.apellido} tiene ${pagos.length} pago(s) vencidos`,
        url: `/admin/clientes/${cliente.id}`,
        clienteId: cliente.id,
      });
      if (result?.enviados > 0) enviados++;
    }
  }

  if (marcados > 0) {
    await sendTelegram(
      `🔴 <b>Pagos vencidos detectados</b>\n📊 ${marcados} pago(s) marcado(s) como vencidos\n⚠️ Revisá /admin/reportes/morosidad`
    );
  }

  return NextResponse.json({
    mensaje: "Check de vencidos completado",
    marcados,
    notificaciones: enviados,
  });
}
