"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearSuscripcionMP(clienteId: string, monto: number) {
  const supabase = createClient();

  const { data: cliente, error } = await supabase
    .from("clients")
    .select("nombre, apellido, telefono")
    .eq("id", clienteId)
    .single();

  if (error || !cliente) {
    return { error: "Cliente no encontrado" };
  }

  const emailCliente =
    process.env.MP_TEST_PAYER_EMAIL || "test_user_payer@testuser.com";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://evenser.vercel.app";

  try {
    const res = await fetch(`${appUrl}/api/mp/suscripcion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId,
        monto,
        descripcion: `Cuota mensual - ${cliente.apellido}, ${cliente.nombre}`,
        emailCliente,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return { error: data.error || "Error al crear suscripción" };
    }

    revalidatePath(`/admin/clientes/${clienteId}`);

    return {
      success: true,
      init_point: data.init_point,
      id: data.id,
    };
  } catch (err) {
    console.error("Error crearSuscripcionMP:", err);
    return { error: "Error de conexión con Mercado Pago" };
  }
}

export async function getSuscripcionByCliente(clienteId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("suscripciones_mp")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}

export async function cancelarSuscripcion(
  preapprovalId: string,
  clienteId: string,
) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return { error: "MP no configurado" };

  const res = await fetch(
    `https://api.mercadopago.com/preapproval/${preapprovalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "cancelled" }),
    },
  );

  const supabase = createClient();

  // ✅ Aunque MP falle, actualizar igual en DB para no dejar al cliente bloqueado
  await supabase
    .from("suscripciones_mp")
    .update({ estado: "cancelada" })
    .eq("mp_preapproval_id", preapprovalId);

  revalidatePath(`/admin/clientes/${clienteId}`);

  if (!res.ok) {
    // MP falló pero DB quedó actualizada — loguear para revisar manualmente
    console.error(
      "[cancelarSuscripcion] MP rechazó la cancelación, pero DB fue actualizada",
    );
    return { success: true, warning: "Cancelado localmente, verificar en MP" };
  }

  return { success: true };
}

export async function pausarSuscripcion(preapprovalId: string, clienteId: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return { error: "MP no configurado" };

  const res = await fetch(
    `https://api.mercadopago.com/preapproval/${preapprovalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "paused" }),
    },
  );

  const supabase = createClient();
  await supabase
    .from("suscripciones_mp")
    .update({ estado: "pausada" })
    .eq("mp_preapproval_id", preapprovalId);

  revalidatePath(`/admin/clientes/${clienteId}`);
  revalidatePath("/admin/suscripciones");

  if (!res.ok) {
    console.error("[pausarSuscripcion] MP rechazó la pausa, pero DB fue actualizada");
    return { success: true, warning: "Pausado localmente, verificar en MP" };
  }

  return { success: true };
}

export async function reactivarSuscripcion(preapprovalId: string, clienteId: string) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return { error: "MP no configurado" };

  const res = await fetch(
    `https://api.mercadopago.com/preapproval/${preapprovalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "authorized" }),
    },
  );

  const supabase = createClient();
  await supabase
    .from("suscripciones_mp")
    .update({ estado: "activa" })
    .eq("mp_preapproval_id", preapprovalId);

  revalidatePath(`/admin/clientes/${clienteId}`);
  revalidatePath("/admin/suscripciones");

  if (!res.ok) {
    console.error("[reactivarSuscripcion] MP rechazó la reactivación, pero DB fue actualizada");
    return { success: true, warning: "Reactivado localmente, verificar en MP" };
  }

  return { success: true };
}

export async function getAllSuscripciones() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("suscripciones_mp")
    .select(`*, cliente:clients(id, nombre, apellido, telefono, localidad)`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
