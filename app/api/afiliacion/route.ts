import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellido,
      dni,
      telefono,
      ocupacion,
      obra_social,
      localidad,
      carpeta_nacimiento,
    } = body;

    if (!nombre || !apellido || !dni || !telefono || !localidad) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Crear cliente en la DB
    const { data: cliente, error } = await supabase
      .from("clients")
      .insert({
        nombre,
        apellido,
        dni,
        telefono,
        ocupacion: ocupacion || null,
        obra_social: obra_social || null,
        localidad,
        carpeta_nacimiento: carpeta_nacimiento || null,
        activo: true,
      })
      .select("id")
      .single();

    if (error || !cliente) {
      console.error("[Afiliación] Error guardando cliente:", error);
      return NextResponse.json({
        success: true,
        message: "Solicitud recibida",
      });
    }

    // 2. Monto según obra social
    const monto = obra_social && obra_social.trim() !== "" ? 20000 : 25000;

    // 3. Generar suscripción MP
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://evenser.vercel.app";
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ success: true, clienteId: cliente.id });
    }

    const mpRes = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason: `Cuota mensual Evenser - ${apellido}, ${nombre}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: monto,
          currency_id: "ARS",
        },
        payer_email:
          process.env.MP_TEST_PAYER_EMAIL || "test_user@testuser.com",
        back_url: `${appUrl}/landing?afiliado=ok`,
        status: "pending",
      }),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok || !mpData.init_point) {
      console.error("[Afiliación] Error MP:", mpData);
      return NextResponse.json({ success: true, clienteId: cliente.id });
    }

    // 4. Guardar suscripción en DB
    await supabase.from("suscripciones_mp").insert({
      cliente_id: cliente.id,
      mp_preapproval_id: mpData.id,
      monto,
      estado: "pendiente",
      init_point: mpData.init_point,
    });

    // 5. Devolver link de pago
    return NextResponse.json({
      success: true,
      clienteId: cliente.id,
      init_point: mpData.init_point,
      monto,
    });
  } catch (error) {
    console.error("[Afiliación] Error:", error);
    return NextResponse.json({ success: true, message: "Solicitud recibida" });
  }
}
