"use server";
import { createClient } from "@/lib/supabase/server";

export async function getContractModifications(clienteId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contract_modifications")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function registrarModificacion(
  clienteId: string,
  campo: string,
  valorAnterior: string | null,
  valorNuevo: string,
  motivo?: string,
  usuarioEmail?: string,
) {
  const supabase = createClient();
  const { error } = await supabase.from("contract_modifications").insert({
    cliente_id: clienteId,
    campo,
    valor_anterior: valorAnterior,
    valor_nuevo: valorNuevo,
    motivo: motivo ?? null,
    usuario_email: usuarioEmail ?? null,
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function registerContractModification(
  clienteId: string,
  changes: Array<{ campo: string; valor_anterior: string; valor_nuevo: string }>,
  motivo?: string,
  usuarioEmail?: string,
) {
  const supabase = createClient();
  const inserts = changes.map((c) => ({
    cliente_id: clienteId,
    campo: c.campo,
    valor_anterior: c.valor_anterior,
    valor_nuevo: c.valor_nuevo,
    motivo: motivo ?? null,
    usuario_email: usuarioEmail ?? null,
  }));
  const { error } = await supabase.from("contract_modifications").insert(inserts);
  if (error) return { error: error.message };
  return { success: true };
}
