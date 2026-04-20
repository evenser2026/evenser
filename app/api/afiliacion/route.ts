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
      email,
      ocupacion,
      obra_social,
      localidad,
      carpeta_nacimiento,
    } = body;

    if (!nombre || !apellido || !dni || !telefono || !localidad || !email) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Crear cliente en la DB
    const { data: cliente, error: dbError } = await supabase
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

    if (dbError) {
      console.error("[Afiliación] Error DB:", dbError.code, dbError.message);
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "Este DNI ya está registrado en el sistema." },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: "Error al registrar los datos." },
        { status: 500 },
      );
    }

    const clienteId = cliente!.id;

    // 2. Monto según obra social
    const monto = obra_social && obra_social.trim() !== "" ? 20000 : 25000;

    // 3. Verificar ACCESS_TOKEN
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("[Afiliación] MP_ACCESS_TOKEN no configurado");
      return NextResponse.json({ success: true, clienteId, sin_mp: true });
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://evenser.vercel.app";

    // 4. Crear suscripción MP con el email REAL del usuario
    const mpPayload = {
      reason: `Cuota mensual Evenser - ${apellido}, ${nombre}`,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: monto,
        currency_id: "ARS",
      },
      payer_email: email, // ← email real ingresado en el formulario
      back_url: `${appUrl}/landing?afiliado=ok`,
      status: "pending",
    };

    console.log("[Afiliación] Llamando MP para:", email, "monto:", monto);

    const mpRes = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(mpPayload),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok || !mpData.init_point) {
      console.error(
        "[Afiliación] MP rechazó:",
        mpRes.status,
        mpData.message,
        JSON.stringify(mpData.cause),
      );
      // Cliente registrado — fallback contacto manual
      return NextResponse.json({
        success: true,
        clienteId,
        sin_mp: true,
        mp_error: mpData.message,
      });
    }

    console.log("[Afiliación] MP OK, id:", mpData.id);

    // 5. Guardar suscripción en DB
    await supabase.from("suscripciones_mp").insert({
      cliente_id: clienteId,
      mp_preapproval_id: mpData.id,
      monto,
      estado: "pendiente",
      init_point: mpData.init_point,
    });

    return NextResponse.json({
      success: true,
      clienteId,
      init_point: mpData.init_point,
      monto,
    });
  } catch (err: any) {
    console.error("[Afiliación] Excepción:", err?.message);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
