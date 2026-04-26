import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enviarNotificacion } from "@/lib/actions/push";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const hoy = new Date();
  const en7Dias = new Date(hoy);
  en7Dias.setDate(hoy.getDate() + 7);

  const hoyStr = hoy.toISOString().split("T")[0];
  const en7DiasStr = en7Dias.toISOString().split("T")[0];

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
      .eq("estado", "pendiente")
      .gte("fecha", hoyStr)
      .lte("fecha", en7DiasStr);

    if (pagos?.length) {
      const result = await enviarNotificacion({
        titulo: "⏰ Pago próximo a vencer",
        cuerpo: `${cliente.nombre} ${cliente.apellido} tiene ${pagos.length} pago(s) por vencer en los próximos 7 días`,
        url: `/admin/clientes/${cliente.id}`,
        clienteId: cliente.id,
      });
      if (result?.enviados > 0) enviados++;
    }
  }

  return NextResponse.json({
    mensaje: "Check de vencimientos completado",
    notificaciones: enviados,
  });
}
