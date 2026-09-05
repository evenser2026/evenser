"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  SeccionInput,
  GenerarParcelasInput,
  ParcelaUpdateInput,
} from "@/lib/validations/cementerio";

export async function getSecciones() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cemetery_sections")
    .select("*")
    .eq("activo", true)
    .order("orden");
  if (error) throw error;
  return data ?? [];
}

export async function createSeccion(input: SeccionInput) {
  const supabase = createClient();
  const { error } = await supabase.from("cemetery_sections").insert({
    ...input,
    descripcion: input.descripcion || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/cementerio");
  return { success: true };
}

export async function getParcelas(seccionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cemetery_plots")
    .select("*, cliente:clients(id, nombre, apellido)")
    .eq("seccion_id", seccionId)
    .order("fila")
    .order("columna");
  if (error) throw error;
  return data ?? [];
}

export async function generarParcelas(input: GenerarParcelasInput) {
  const supabase = createClient();

  // evitar duplicar si la sección ya tiene parcelas generadas
  const { count } = await supabase
    .from("cemetery_plots")
    .select("id", { count: "exact", head: true })
    .eq("seccion_id", input.seccion_id);

  if (count && count > 0) {
    return { error: "Esta sección ya tiene parcelas generadas." };
  }

  const rows: any[] = [];
  let n = 1;
  for (let f = 1; f <= input.filas; f++) {
    for (let c = 1; c <= input.columnas; c++) {
      rows.push({
        seccion_id: input.seccion_id,
        fila: f,
        columna: c,
        numero: `${input.prefijo}-${n}`,
        estado: "libre",
      });
      n++;
    }
  }

  const { error } = await supabase.from("cemetery_plots").insert(rows);
  if (error) return { error: error.message };
  revalidatePath("/admin/cementerio");
  return { success: true };
}

export async function updateParcela(id: string, input: ParcelaUpdateInput) {
  const supabase = createClient();
  const payload: Record<string, any> = {
    estado: input.estado,
    nombre_difunto: input.nombre_difunto || null,
    fecha_inhumacion: input.fecha_inhumacion || null,
    cliente_id: input.cliente_id || null,
    precio: input.precio === "" || input.precio === undefined ? null : input.precio,
    observaciones: input.observaciones || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("cemetery_plots")
    .update(payload)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/cementerio");
  return { success: true };
}

export async function buscarParcelas(query: string) {
  if (!query.trim()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cemetery_plots")
    .select("*, seccion:cemetery_sections(id, nombre)")
    .or(`numero.ilike.%${query}%,nombre_difunto.ilike.%${query}%`)
    .limit(20);
  if (error) throw error;
  return data ?? [];
}
