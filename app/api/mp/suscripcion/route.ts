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

    const isTesting = accessToken.startsWith("TEST-");
    const payerEmail = isTesting
      ? (process.env.MP_TEST_PAYER_EMAIL ?? "TESTUSER8746695382589969460@testuser.com")
      : emailCliente;

    const body = {
      reason: descripcion || "Suscripción mensual Evenser",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(monto),
        currency_id: "ARS",
      },
      payer_email: payerEmail,
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/clientes/${clienteId}`,
      status: "pending",
    };

    console.log("[MP Suscripción] Modo:", isTesting ? "TEST" : "PRODUCCIÓN");
    console.log("[MP Suscripción] Payload:", JSON.stringify(body, null, 2));

    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[MP Suscripción] Error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.message || "Error al crear suscripción en MP" },
        { status: response.status },
      );
    }

    console.log("[MP Suscripción] OK:", data.id);

    // Guardar referencia de la suscripción en Supabase
    const supabase = createClient();
    await supabase.from("suscripciones_mp").insert({
      cliente_id: clienteId,
      mp_preapproval_id: data.id,
      monto: Number(monto),
      estado: "pendiente",
      init_point: data.init_point,
    });

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
    });
  } catch (error) {
    console.error("[MP Suscripción] Excepción:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}