"use server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { MemorialInput, MemorialMessageInput } from "@/lib/validations/memorial";

// ────────────────────────────────────────────────────────────
// STAFF (admin, requiere sesión — usa el cliente con cookies)
// ────────────────────────────────────────────────────────────

export async function getMemorials() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("memorials")
    .select(
      "*, deceased:deceased_records(id, nombre_fallecido, apellido_fallecido, fecha_fallecimiento)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMemorial(input: MemorialInput) {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("memorials")
    .select("id")
    .eq("deceased_id", input.deceased_id)
    .maybeSingle();
  if (existing) {
    return { error: "Este fallecido ya tiene un memorial creado." };
  }
  const { error } = await supabase.from("memorials").insert({
    ...input,
    foto_url: input.foto_url || null,
    frase: input.frase || null,
    biografia: input.biografia || null,
  });
  if (error) {
    if (error.code === "23505") return { error: "El slug ya está en uso, elegí otro." };
    return { error: error.message };
  }
  revalidatePath("/admin/memorial");
  return { success: true };
}

export async function updateMemorial(id: string, input: MemorialInput) {
  const supabase = createClient();
  const { error } = await supabase
    .from("memorials")
    .update({
      slug: input.slug,
      foto_url: input.foto_url || null,
      frase: input.frase || null,
      biografia: input.biografia || null,
      activo: input.activo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "El slug ya está en uso, elegí otro." };
    return { error: error.message };
  }
  revalidatePath("/admin/memorial");
  revalidatePath(`/memorial/${input.slug}`);
  return { success: true };
}

export async function deleteMemorial(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("memorials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/memorial");
  return { success: true };
}

export async function getMensajesAdmin(memorialId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("memorial_messages")
    .select("*")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function ocultarMensaje(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("memorial_messages")
    .update({ estado: "oculto" })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/memorial");
  return { success: true };
}

export async function mostrarMensaje(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("memorial_messages")
    .update({ estado: "visible" })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/memorial");
  return { success: true };
}

export async function eliminarMensaje(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("memorial_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/memorial");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// PÚBLICO (sin sesión — usa el cliente con service role,
// mismo patrón que app/api/afiliacion/route.ts)
// ────────────────────────────────────────────────────────────

export async function getMemorialPublico(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("memorials")
    .select(
      "*, deceased:deceased_records(id, nombre_fallecido, apellido_fallecido, fecha_fallecimiento)",
    )
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMensajesVisibles(memorialId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("memorial_messages")
    .select("*")
    .eq("memorial_id", memorialId)
    .eq("estado", "visible")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function encenderVela(memorialId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("increment_velas", {
    memorial_id_input: memorialId,
  });
  if (error) return { error: error.message };
  return { success: true, velas_count: data as number };
}

export async function buscarMemoriales(query: string) {
  if (!query.trim()) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("memorials")
    .select(
      "id, slug, foto_url, deceased:deceased_records(nombre_fallecido, apellido_fallecido, fecha_fallecimiento)",
    )
    .eq("activo", true);
  if (error) throw error;

  const q = query.trim().toLowerCase();
  return (data ?? [])
    .filter((m: any) => {
      const nombre = `${m.deceased?.nombre_fallecido ?? ""} ${m.deceased?.apellido_fallecido ?? ""}`.toLowerCase();
      return nombre.includes(q);
    })
    .slice(0, 20);
}

export async function crearMensaje(memorialId: string, input: MemorialMessageInput) {
  const supabase = createAdminClient();
  const { data: memorial } = await supabase
    .from("memorials")
    .select("id, activo")
    .eq("id", memorialId)
    .eq("activo", true)
    .maybeSingle();
  if (!memorial) return { error: "Memorial no disponible." };

  const { error } = await supabase.from("memorial_messages").insert({
    memorial_id: memorialId,
    autor_nombre: input.autor_nombre.trim(),
    mensaje: input.mensaje.trim(),
    estado: "visible",
  });
  if (error) return { error: error.message };
  return { success: true };
}
