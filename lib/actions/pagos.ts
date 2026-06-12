"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PagoInput } from "@/lib/validations";
import { sendTelegram } from "@/lib/telegram";

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

  // Telegram — pago registrado manualmente
  if (input.estado === "pagado") {
    const { data: cli } = await supabase
      .from("clients")
      .select("nombre, apellido")
      .eq("id", input.cliente_id)
      .single();
    if (cli) {
      const metodo = input.metodo_pago === "efectivo" ? "💵 Efectivo"
        : input.metodo_pago === "transferencia" ? "🏦 Transferencia"
        : "💳 Mercado Pago";
      await sendTelegram(
        `✅ <b>Pago registrado</b>\n👤 ${cli.apellido}, ${cli.nombre}\n💰 $${input.monto.toLocaleString("es-AR")}\n📋 ${metodo}\n📅 ${input.fecha}`
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

  // Si se marcó como pagado y el cliente es manual, generar siguiente cuota pendiente
  if (estado === "pagado") {
    const { data: pagoActual } = await supabase
      .from("payments")
      .select("cliente_id, monto, metodo_pago, fecha_vence, clients(metodo_cobro)")
      .eq("id", id)
      .single();
    const cliente = pagoActual?.clients as any;
    if (pagoActual && cliente?.metodo_cobro === "manual" && pagoActual.fecha_vence) {
      const base = new Date(pagoActual.fecha_vence);
      const dia = base.getDate();
      const siguiente = new Date(base);
      siguiente.setMonth(siguiente.getMonth() + 1);
      if (siguiente.getDate() !== dia) siguiente.setDate(0);
      const nuevaFechaVence = siguiente.toISOString().split("T")[0];
      await supabase.from("payments").insert({
        cliente_id: pagoActual.cliente_id,
        monto: pagoActual.monto,
        fecha: pagoActual.fecha_vence,
        metodo_pago: pagoActual.metodo_pago,
        estado: "pendiente",
        tipo_pago: "mensual",
        descripcion: "Cuota mensual",
        fecha_vence: nuevaFechaVence,
      });
    }
  }

  // Telegram — pago marcado como pagado
  if (estado === "pagado") {
    const { data: pagoInfo } = await supabase
      .from("payments")
      .select("monto, metodo_pago, fecha, cliente_id, clients(nombre, apellido)")
      .eq("id", id)
      .single();
    if (pagoInfo) {
      const cli = pagoInfo.clients as any;
      const metodo = pagoInfo.metodo_pago === "efectivo" ? "💵 Efectivo"
        : pagoInfo.metodo_pago === "transferencia" ? "🏦 Transferencia"
        : "💳 Mercado Pago";
      await sendTelegram(
        `✅ <b>Pago confirmado</b>\n👤 ${cli?.apellido}, ${cli?.nombre}\n💰 $${pagoInfo.monto.toLocaleString("es-AR")}\n📋 ${metodo}\n📅 ${pagoInfo.fecha}`
      );
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
