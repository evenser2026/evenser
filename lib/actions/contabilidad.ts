"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AccountingInput } from "@/lib/validations/contabilidad";



export async function getAccountingEntries(mes?: number, anio?: number) {
  const supabase = createClient();
  let query = supabase
    .from("accounting_entries")
    .select("*, cliente:clients(id, nombre, apellido)")
    .order("fecha", { ascending: false });

  if (mes && anio) {
    const inicio = new Date(anio, mes - 1, 1).toISOString().split("T")[0];
    const fin = new Date(anio, mes, 1).toISOString().split("T")[0];
    query = query.gte("fecha", inicio).lt("fecha", fin);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAccountingSummary(mes: number, anio: number) {
  const entries = await getAccountingEntries(mes, anio);
  const ingresos = entries
    .filter((e) => e.tipo === "ingreso")
    .reduce((s, e) => s + e.monto, 0);
  const egresos = entries
    .filter((e) => e.tipo === "egreso")
    .reduce((s, e) => s + e.monto, 0);
  return { ingresos, egresos, balance: ingresos - egresos, entries };
}

export async function createAccountingEntry(
  input: AccountingInput,
  comprobante_url?: string,
) {
  const supabase = createClient();
  const { error } = await supabase.from("accounting_entries").insert({
    ...input,
    cliente_id: input.cliente_id || null,
    comprobante_url: comprobante_url ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/contabilidad");
  return { success: true };
}

export async function deleteAccountingEntry(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("accounting_entries")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/contabilidad");
  return { success: true };
}

export async function cerrarMesContable(mes: number, anio: number) {
  const supabase = createClient();
  const inicio = new Date(anio, mes - 1, 1).toISOString().split("T")[0];
  const fin = new Date(anio, mes, 1).toISOString().split("T")[0];
  const { error } = await supabase
    .from("accounting_entries")
    .update({ cerrado: true })
    .gte("fecha", inicio)
    .lt("fecha", fin)
    .eq("cerrado", false);
  if (error) return { error: error.message };
  revalidatePath("/admin/contabilidad");
  return { success: true };
}
