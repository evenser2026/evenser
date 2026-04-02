"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface AppConfig {
  monto_con_obra_social: number;
  monto_sin_obra_social: number;
  checkout_dias: number;
  nombre_empresa: string;
  whatsapp_contacto: string;
  email_contacto: string;
}

// Devuelve todas las configs como objeto key→value tipado
export async function getAppConfig(): Promise<AppConfig> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("clave, valor");

  if (error || !data) {
    // Valores de fallback si la tabla no existe todavía
    return {
      monto_con_obra_social: 20000,
      monto_sin_obra_social: 25000,
      checkout_dias: 35,
      nombre_empresa: "Evenser",
      whatsapp_contacto: "",
      email_contacto: "",
    };
  }

  const map = Object.fromEntries(data.map((r) => [r.clave, r.valor]));

  return {
    monto_con_obra_social: Number(map.monto_con_obra_social ?? 20000),
    monto_sin_obra_social: Number(map.monto_sin_obra_social ?? 25000),
    checkout_dias: Number(map.checkout_dias ?? 35),
    nombre_empresa: map.nombre_empresa ?? "Evenser",
    whatsapp_contacto: map.whatsapp_contacto ?? "",
    email_contacto: map.email_contacto ?? "",
  };
}

// Actualiza una clave individual
export async function updateConfigValue(clave: string, valor: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("app_config")
    .update({ valor })
    .eq("clave", clave);

  if (error) return { error: error.message };
  revalidatePath("/configuracion");
  return { success: true };
}

// Actualiza múltiples claves de una vez (para el form completo)
// Buscar esta línea:
export async function updateAppConfig(values: Partial<Record<string, string>>) {
  const supabase = createClient();

  const updates = Object.entries(values).map(([clave, valor]) =>
    supabase.from("app_config").update({ valor }).eq("clave", clave),
  );

  await Promise.all(updates);
  revalidatePath("/configuracion");
  return { success: true };
}

// Reemplazar por:
export async function updateAppConfig(
  values: Partial<Record<string, string>>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const updates = Object.entries(values).map(([clave, valor]) =>
    supabase.from("app_config").update({ valor }).eq("clave", clave),
  );

  await Promise.all(updates);
  revalidatePath("/configuracion");
  return { success: true };
}
