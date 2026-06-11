"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SupplyInput, MovementInput } from "@/lib/validations/insumos";

export async function getSupplies() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("supplies")
    .select("*")
    .order("nombre");
  if (error) throw error;
  return data ?? [];
}

export async function createSupply(input: SupplyInput) {
  const supabase = createClient();
  const { error } = await supabase.from("supplies").insert({
    ...input,
    precio_unitario: input.precio_unitario || null,
    descripcion: input.descripcion || null,
    proveedor: input.proveedor || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/insumos");
  return { success: true };
}

export async function updateSupply(id: string, input: Partial<SupplyInput>) {
  const supabase = createClient();
  const { error } = await supabase.from("supplies").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/insumos");
  return { success: true };
}

export async function deleteSupply(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("supplies").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/insumos");
  return { success: true };
}

export async function getMovements(supplyId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("supply_movements")
    .select("*")
    .eq("supply_id", supplyId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function registerMovement(input: MovementInput) {
  const supabase = createClient();
  const { error: mvError } = await supabase.from("supply_movements").insert({
    supply_id: input.supply_id,
    tipo: input.tipo,
    cantidad: input.cantidad,
    motivo: input.motivo || null,
  });
  if (mvError) return { error: mvError.message };

  // Actualizar stock
  const { data: supply } = await supabase
    .from("supplies")
    .select("stock_actual")
    .eq("id", input.supply_id)
    .single();

  if (supply) {
    const nuevo = input.tipo === "entrada"
      ? supply.stock_actual + input.cantidad
      : Math.max(0, supply.stock_actual - input.cantidad);
    await supabase.from("supplies").update({ stock_actual: nuevo }).eq("id", input.supply_id);
  }

  revalidatePath("/admin/insumos");
  return { success: true };
}
