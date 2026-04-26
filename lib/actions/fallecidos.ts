"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DeceasedInput } from "@/lib/validations/fallecidos";



function cleanNullable(input: DeceasedInput) {
  return {
    ...input,
    cliente_id: input.cliente_id || null,
    familiar_id: input.familiar_id || null,
    convenio_id: input.convenio_id || null,
  };
}

export async function getDeceasedRecords() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deceased_records")
    .select(
      `
      *,
      cliente:clients(id, nombre, apellido),
      convenio:agreements(id, nombre)
    `,
    )
    .order("fecha_fallecimiento", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getDeceasedById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deceased_records")
    .select(
      `*, cliente:clients(id, nombre, apellido), convenio:agreements(id, nombre)`,
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createDeceased(input: DeceasedInput) {
  const supabase = createClient();
  const { error } = await supabase
    .from("deceased_records")
    .insert(cleanNullable(input));
  if (error) return { error: error.message };
  revalidatePath("/admin/fallecidos");
  if (input.cliente_id) revalidatePath(`/admin/clientes/${input.cliente_id}`);
  return { success: true };
}

export async function updateDeceased(
  id: string,
  input: Partial<DeceasedInput>,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("deceased_records")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/fallecidos");
  return { success: true };
}

export async function updateDeceasedEstado(
  id: string,
  estado: "en_proceso" | "completado" | "cancelado",
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("deceased_records")
    .update({ estado })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/fallecidos");
  return { success: true };
}
