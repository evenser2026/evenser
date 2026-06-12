import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("app_config")
    .select("clave, valor");

  const map = Object.fromEntries((data ?? []).map((r: any) => [r.clave, r.valor]));

  return NextResponse.json({
    monto_con_obra_social: Number(map.monto_con_obra_social ?? 20000),
    monto_sin_obra_social: Number(map.monto_sin_obra_social ?? 25000),
    localidades: map.localidades ? JSON.parse(map.localidades) : [],
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
