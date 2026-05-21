"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PagoInput } from "@/lib/validations";

export async function getPagos(clienteId?: string) {
  const supabase = createClient();
  let query = supabase
    .from("payments")
    .select("*, clients(nombre, apellido)")
    .order("fecha", { ascending: false });
  if (clienteId) query = query.eq("cliente_id", clienteId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPago(input: PagoInput) {
  const supabase = createClient();

  const { data: nuevoPago, error } = await supabase
    .from("payments")
    .insert(input)
    .select("id")
    .single();

  if (error) return { error: error.message };

  // ✅ Reflejar en contabilidad solo si el pago está confirmado
  if (nuevoPago && input.estado === "pagado") {
    const { error: errorContabilidad } = await supabase
      .from("accounting_entries")
      .insert({
        tipo: "ingreso",
        categoria: "cuota_mensual",
        monto: input.monto,
        fecha: input.fecha,
        descripcion:
          input.descripcion || `Cuota mensual - ${input.metodo_pago}`,
        cliente_id: input.cliente_id,
        pago_id: nuevoPago.id,
      });

    if (errorContabilidad) {
      console.error(
        "[createPago] Error al insertar en contabilidad:",
        errorContabilidad,
      );
    }
  }

  revalidatePath("/admin/pagos");
  revalidatePath("/admin/contabilidad");
  revalidatePath(`/admin/clientes/${input.cliente_id}`);
  return { success: true };
}

export async function updateEstadoPago(id: string, estado: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("payments")
    .update({ estado })
    .eq("id", id);

  if (error) return { error: error.message };

  // ✅ Si se marca como pagado, crear entry contable si no existe aún
  if (estado === "pagado") {
    const { data: pago } = await supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();

    if (pago) {
      const { data: existing } = await supabase
        .from("accounting_entries")
        .select("id")
        .eq("pago_id", id)
        .maybeSingle();

      if (!existing) {
        const { error: errorContabilidad } = await supabase
          .from("accounting_entries")
          .insert({
            tipo: "ingreso",
            categoria: "cuota_mensual",
            monto: pago.monto,
            fecha: pago.fecha,
            descripcion:
              pago.descripcion || `Cuota mensual - ${pago.metodo_pago}`,
            cliente_id: pago.cliente_id,
            pago_id: id,
          });

        if (errorContabilidad) {
          console.error(
            "[updateEstadoPago] Error al insertar en contabilidad:",
            errorContabilidad,
          );
        }
      }
    }
  }

  revalidatePath("/admin/pagos");
  revalidatePath("/admin/contabilidad");
  return { success: true };
}

export async function deletePago(id: string) {
  const supabase = createClient();

  // Eliminar el entry contable vinculado si existe
  await supabase.from("accounting_entries").delete().eq("pago_id", id);

  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/pagos");
  revalidatePath("/admin/contabilidad");
  return { success: true };
}

export async function getIngresosDelMes() {
  const supabase = createClient();
  const inicio = new Date();
  inicio.setDate(1);
  inicio.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("payments")
    .select("monto")
    .eq("estado", "pagado")
    .gte("fecha", inicio.toISOString());
  if (error) return 0;
  return data.reduce((sum, p) => sum + (p.monto || 0), 0);
}
