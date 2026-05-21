import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { clienteId, monto, descripcion, emailCliente } =
      await request.json();

    if (!clienteId || !monto || !emailCliente) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "MP_ACCESS_TOKEN no configurado" },
        { status: 500 },
      );
    }

    // Crear suscripción sin plan (directa) en MP
    const body = {
      reason: descripcion || "Suscripción mensual Evenser",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(monto),
        currency_id: "ARS",
      },
      payer_email: emailCliente,
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/clientes/${clienteId}`,
      status: "pending",
    };

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(process.env.NODE_ENV !== "production" && { "X-scope": "stage" }),
      };

      const response = await fetch("https://api.mercadopago.com/preapproval", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

    const data = await response.json();

    if (!response.ok) {
      console.error("MP error:", data);
      return NextResponse.json(
        { error: data.message || "Error al crear suscripción en MP" },
        { status: response.status },
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const checkoutUrl = isProd ? data.init_point : data.sandbox_init_point;

    // Guardar referencia de la suscripción en Supabase
    const supabase = createClient();
    await supabase.from("suscripciones_mp").insert({
      cliente_id: clienteId,
      mp_preapproval_id: data.id,
      monto: Number(monto),
      estado: "pendiente",
      init_point: checkoutUrl,
    });

    return NextResponse.json({
      id: data.id,
      init_point: checkoutUrl,
    });
  } catch (error) {
    console.error("Error crear suscripción:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
