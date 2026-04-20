import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enviarNotificacion } from "@/lib/actions/push";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log("[MP Webhook]", type, data?.id);

    if (type === "payment") {
      await handlePago(data.id);
    }

    if (type === "subscription_preapproval") {
      await handleSuscripcion(data.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP Webhook] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

async function handlePago(pagoId: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return;

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${pagoId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return;
  const pago = await res.json();

  if (pago.status !== "approved" || !pago.preapproval_id) return;

  const supabase = createClient();

  const { data: suscripcion } = await supabase
    .from("suscripciones_mp")
    .select("cliente_id, monto")
    .eq("mp_preapproval_id", pago.preapproval_id)
    .single();

  if (!suscripcion) {
    console.warn(
      "[MP Webhook] Suscripción no encontrada:",
      pago.preapproval_id,
    );
    return;
  }

  // Registrar el pago en la DB
  await supabase.from("payments").insert({
    cliente_id: suscripcion.cliente_id,
    monto: pago.transaction_amount || suscripcion.monto,
    fecha: new Date().toISOString().split("T")[0],
    metodo_pago: "mercado_pago",
    estado: "pagado",
    tipo_pago: "mensual",
    descripcion: `Pago automático MP - ID: ${pagoId}`,
    checkout_dias: 35,
  });

  // Actualizar estado de la suscripción
  await supabase
    .from("suscripciones_mp")
    .update({ estado: "activa", ultimo_pago: new Date().toISOString() })
    .eq("mp_preapproval_id", pago.preapproval_id);

  console.log(
    "[MP Webhook] Pago registrado para cliente:",
    suscripcion.cliente_id,
  );

  // ✅ Notificar DESPUÉS de registrar todo correctamente
  await enviarNotificacion({
    titulo: "💳 Pago recibido",
    cuerpo: `Se registró un pago de $${pago.transaction_amount}`,
    url: `/clientes/${suscripcion.cliente_id}`,
    clienteId: suscripcion.cliente_id,
  });
}

async function handleSuscripcion(preapprovalId: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return;

  const res = await fetch(
    `https://api.mercadopago.com/preapproval/${preapprovalId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) return;
  const sub = await res.json();

  const supabase = createClient();

  const estadoMap: Record<string, string> = {
    authorized: "activa",
    paused: "pausada",
    cancelled: "cancelada",
    pending: "pendiente",
  };

  await supabase
    .from("suscripciones_mp")
    .update({ estado: estadoMap[sub.status] || sub.status })
    .eq("mp_preapproval_id", preapprovalId);

  console.log(
    "[MP Webhook] Suscripción actualizada:",
    preapprovalId,
    sub.status,
  );
}
