"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { FamiliarInput } from "@/lib/validations";

export async function createFamiliar(clienteId: string, input: FamiliarInput) {
  const supabase = createClient();
  const { error } = await supabase
    .from("family_members")
    .insert({ ...input, cliente_id: clienteId });
  if (error) return { error: error.message };
  revalidatePath(`/clientes/${clienteId}`);
  return { success: true };
}

export async function deleteFamiliar(id: string, clienteId?: string) {
  const supabase = createClient();

  // Si no viene clienteId, lo buscamos antes de borrar para revalidar
  let resolvedClienteId = clienteId;
  if (!resolvedClienteId) {
    const { data } = await supabase
      .from("family_members")
      .select("cliente_id")
      .eq("id", id)
      .single();
    resolvedClienteId = data?.cliente_id;
  }

  const { error } = await supabase.from("family_members").delete().eq("id", id);
  if (error) return { error: error.message };

  if (resolvedClienteId) {
    revalidatePath(`/clientes/${resolvedClienteId}`);
  }

  return { success: true };
}
