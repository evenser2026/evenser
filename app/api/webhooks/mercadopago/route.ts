import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
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

  if (pago.status !== "approved") return;

  // ✅ MP puede enviar el preapproval_id directo o dentro de point_of_interaction
  const preapprovalId =
    pago.preapproval_id ||
    pago.point_of_interaction?.transaction_data?.subscription_id;

  if (!preapprovalId) {
    console.warn(
      "[MP Webhook] Pago sin preapproval_id ni subscription_id:",
      pagoId,
    );
    return;
  }

  console.log("[MP Webhook] preapprovalId resuelto:", preapprovalId);

  // ✅ Usar admin client para bypasear RLS — el webhook corre sin sesión
  const supabase = createAdminClient();

  const { data: suscripcion } = await supabase
    .from("suscripciones_mp")
    .select("cliente_id, monto")
    .eq("mp_preapproval_id", preapprovalId)
    .single();

  if (!suscripcion) {
    console.warn("[MP Webhook] Suscripción no encontrada:", preapprovalId);
    return;
  }

  const montoFinal = pago.transaction_amount || suscripcion.monto;
  const fechaHoy = new Date().toISOString().split("T")[0];

  // Registrar el pago en payments y recuperar el id generado
  const { data: nuevoPago, error: errorPago } = await supabase
    .from("payments")
    .insert({
      cliente_id: suscripcion.cliente_id,
      monto: montoFinal,
      fecha: fechaHoy,
      metodo_pago: "mercado_pago",
      estado: "pagado",
      tipo_pago: "mensual",
      descripcion: `Pago automático MP - ID: ${pagoId}`,
      checkout_dias: 35,
    })
    .select("id")
    .single();

  if (errorPago) {
    console.error("[MP Webhook] Error al insertar payment:", errorPago);
    return;
  }

  // ✅ Registrar en contabilidad vinculado al pago
  if (nuevoPago) {
    const { error: errorContabilidad } = await supabase
      .from("accounting_entries")
      .insert({
        tipo: "ingreso",
        categoria: "cuota_mensual",
        monto: montoFinal,
        fecha: fechaHoy,
        descripcion: `Cuota mensual MP - ID: ${pagoId}`,
        cliente_id: suscripcion.cliente_id,
        pago_id: nuevoPago.id,
      });

    if (errorContabilidad) {
      console.error(
        "[MP Webhook] Error al insertar en contabilidad:",
        errorContabilidad,
      );
    }
  }

  // Actualizar estado de la suscripción
  await supabase
    .from("suscripciones_mp")
    .update({ estado: "activa", ultimo_pago: new Date().toISOString() })
    .eq("mp_preapproval_id", preapprovalId);

  console.log(
    "[MP Webhook] Pago registrado para cliente:",
    suscripcion.cliente_id,
  );

  // Notificar después de registrar todo correctamente
  await enviarNotificacion({
    titulo: "💳 Pago recibido",
    cuerpo: `Se registró un pago de $${montoFinal}`,
    url: `/admin/clientes/${suscripcion.cliente_id}`,
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

  // ✅ Usar admin client para bypasear RLS
  const supabase = createAdminClient();

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
