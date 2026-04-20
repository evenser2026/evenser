"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PetCremationInput } from "@/lib/validations/mascotas";



export async function getPetCremations() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pet_cremations")
    .select("*")
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPetCremation(
  input: PetCremationInput,
  foto_url?: string,
) {
  const supabase = createClient();
  const { error } = await supabase.from("pet_cremations").insert({
    ...input,
    peso_kg: input.peso_kg || null,
    foto_url: foto_url ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath("/mascotas");
  return { success: true };
}

export async function updatePetCremation(
  id: string,
  input: Partial<PetCremationInput>,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("pet_cremations")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/mascotas");
  return { success: true };
}

export async function deletePetCremation(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("pet_cremations").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/mascotas");
  return { success: true };
}
