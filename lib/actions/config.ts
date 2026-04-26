"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Localidad {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface AppConfig {
  monto_con_obra_social: number;
  monto_sin_obra_social: number;
  checkout_dias: number;
  nombre_empresa: string;
  whatsapp_contacto: string;
  email_contacto: string;
  localidades: Localidad[];
}

export async function getAppConfig(): Promise<AppConfig> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("clave, valor");
  if (error || !data) {
    return {
      monto_con_obra_social: 20000,
      monto_sin_obra_social: 25000,
      checkout_dias: 35,
      nombre_empresa: "Evenser",
      whatsapp_contacto: "",
      email_contacto: "",
      localidades: [
        { id: "1", nombre: "Col. Elisa", activo: true },
        { id: "2", nombre: "La Escondida", activo: true },
        { id: "3", nombre: "Tirol", activo: true },
        { id: "4", nombre: "La Verde", activo: true },
        { id: "5", nombre: "Colonias Unidas", activo: true },
        { id: "6", nombre: "Las Garcitas", activo: true },
        { id: "7", nombre: "Otra", activo: true },
      ],
    };
  }
  const map = Object.fromEntries(data.map((r) => [r.clave, r.valor]));
  const localidadesRaw = map.localidades
    ? JSON.parse(map.localidades as string)
    : [
        { id: "1", nombre: "Col. Elisa", activo: true },
        { id: "2", nombre: "La Escondida", activo: true },
        { id: "3", nombre: "Tirol", activo: true },
        { id: "4", nombre: "La Verde", activo: true },
        { id: "5", nombre: "Colonias Unidas", activo: true },
        { id: "6", nombre: "Las Garcitas", activo: true },
        { id: "7", nombre: "Otra", activo: true },
      ];
  return {
    monto_con_obra_social: Number(map.monto_con_obra_social ?? 20000),
    monto_sin_obra_social: Number(map.monto_sin_obra_social ?? 25000),
    checkout_dias: Number(map.checkout_dias ?? 35),
    nombre_empresa: map.nombre_empresa ?? "Evenser",
    whatsapp_contacto: map.whatsapp_contacto ?? "",
    email_contacto: map.email_contacto ?? "",
    localidades: localidadesRaw,
  };
}

export async function updateConfigValue(clave: string, valor: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("app_config")
    .update({ valor })
    .eq("clave", clave);
  if (error) return { error: error.message };
  revalidatePath("/admin/configuracion");
  return { success: true };
}

export async function saveLocalidad(nombre: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("app_config")
    .select("valor")
    .eq("clave", "localidades")
    .single();

  let localidades: Localidad[] = [];
  if (existing?.valor) {
    try { localidades = JSON.parse(existing.valor as string); } catch { localidades = []; }
  }

  const newLocalidad: Localidad = {
    id: crypto.randomUUID(),
    nombre: nombre.trim(),
    activo: true,
  };
  localidades.push(newLocalidad);

  const res = await updateConfigValue("localidades", JSON.stringify(localidades));
  if (res?.error) return { success: false, error: res.error };
  return { success: true };
}

export async function toggleLocalidad(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("app_config")
    .select("valor")
    .eq("clave", "localidades")
    .single();

  if (!existing?.valor) return { success: false, error: "No encontrado" };

  let localidades: Localidad[] = [];
  try { localidades = JSON.parse(existing.valor as string); } catch { return { success: false, error: "Parse error" }; }

  localidades = localidades.map((l) => l.id === id ? { ...l, activo: !l.activo } : l);

  const res = await updateConfigValue("localidades", JSON.stringify(localidades));
  if (res?.error) return { success: false, error: res.error };
  return { success: true };
}

export async function deleteLocalidad(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("app_config")
    .select("valor")
    .eq("clave", "localidades")
    .single();

  if (!existing?.valor) return { success: false, error: "No encontrado" };

  let localidades: Localidad[] = [];
  try { localidades = JSON.parse(existing.valor as string); } catch { return { success: false, error: "Parse error" }; }

  localidades = localidades.filter((l) => l.id !== id);

  const res = await updateConfigValue("localidades", JSON.stringify(localidades));
  if (res?.error) return { success: false, error: res.error };
  return { success: true };
}

export async function updateAppConfig(
  values: Partial<Record<string, string>>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const updates = Object.entries(values).map(([clave, valor]) =>
    supabase.from("app_config").update({ valor }).eq("clave", clave),
  );
  await Promise.all(updates);
  revalidatePath("/admin/configuracion");
  return { success: true };
}
