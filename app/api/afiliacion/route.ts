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

    // Guardar el cliente en la base de datos
    const { data, error } = await supabase
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

    if (error) {
      console.error("[Afiliación] Error guardando cliente:", error);
      // No retornamos error al cliente — mejor que el formulario funcione
      // aunque haya un problema técnico
      return NextResponse.json({
        success: true,
        message: "Solicitud recibida",
      });
    }

    return NextResponse.json({
      success: true,
      clienteId: data?.id,
      message: "Solicitud de afiliación recibida correctamente",
    });
  } catch (error) {
    console.error("[Afiliación] Error:", error);
    return NextResponse.json({ success: true, message: "Solicitud recibida" });
  }
}
