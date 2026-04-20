// lib/utils/exportCsv.ts
// Exportación CSV (una tabla) y Excel multi-hoja

// ── CSV simple ────────────────────────────────────────────────

function escapeCsv(val: unknown): string {
  if (val == null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escapeCsv(r[h])).join(",")),
  ];
  return lines.join("\n");
}

export function downloadCsv(rows: Record<string, unknown>[], filename: string) {
  const csv = toCsv(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Excel multi-hoja con SheetJS (xlsx) ───────────────────────
// Requiere: npm install xlsx
// O usar la versión CDN en el browser: https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js

export interface ExcelSheet {
  name: string;
  rows: Record<string, unknown>[];
}

export async function downloadExcel(sheets: ExcelSheet[], filename: string) {
  // Importación dinámica — solo se carga cuando se usa
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();

  for (const sheet of sheets) {
    if (!sheet.rows.length) {
      // Hoja vacía con encabezado
      const ws = XLSX.utils.aoa_to_sheet([[`Sin datos en ${sheet.name}`]]);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      continue;
    }

    const ws = XLSX.utils.json_to_sheet(sheet.rows);

    // Ancho automático de columnas
    const colWidths = Object.keys(sheet.rows[0]).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...sheet.rows.map((r) => String(r[key] ?? "").length),
      );
      return { wch: Math.min(maxLen + 2, 50) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }

  XLSX.writeFile(
    wb,
    filename.endsWith(".xlsx") ? filename : filename + ".xlsx",
  );
}

// ── Helpers de preparación de datos para exportación ─────────

export function prepareClientesSheet(clientes: any[]) {
  return clientes.map((c) => ({
    Apellido: c.apellido,
    Nombre: c.nombre,
    DNI: c.dni,
    Teléfono: c.telefono,
    Localidad: c.localidad,
    "Obra Social": c.obra_social ?? "",
    Ocupación: c.ocupacion ?? "",
    "Carpeta / Ref.": c.carpeta_nacimiento ?? "",
    "Fecha alta": c.created_at ? c.created_at.slice(0, 10) : "",
    Activo: c.activo ? "Sí" : "No",
  }));
}

export function prepareFamiliaresSheet(familiares: any[]) {
  return familiares.map((f) => ({
    "Apellido cliente": f.clients?.apellido ?? "",
    "Nombre cliente": f.clients?.nombre ?? "",
    Apellido: f.apellido,
    Nombre: f.nombre,
    DNI: f.dni,
    Edad: f.edad,
    Parentesco: f.parentesco,
  }));
}

export function preparePagosSheet(pagos: any[]) {
  return pagos.map((p) => ({
    Fecha: p.fecha,
    "Apellido cliente": p.clients?.apellido ?? "",
    "Nombre cliente": p.clients?.nombre ?? "",
    Monto: p.monto,
    "Método pago": p.metodo_pago,
    "Tipo pago": p.tipo_pago,
    Estado: p.estado,
    Descripción: p.descripcion ?? "",
    "INSEP Nro.": p.insep_numero ?? "",
  }));
}

export function prepareServiciosSheet(servicios: any[]) {
  return servicios.map((s) => ({
    Fecha: s.fecha,
    "Apellido cliente": s.clients?.apellido ?? "",
    "Nombre cliente": s.clients?.nombre ?? "",
    Tipo: s.tipo.replace(/_/g, " "),
    Estado: s.estado,
    Observaciones: s.observaciones ?? "",
  }));
}

export function prepareMascotasSheet(mascotas: any[]) {
  return mascotas.map((m) => ({
    Fecha: m.fecha,
    "Dueño apellido": m.dueno_apellido,
    "Dueño nombre": m.dueno_nombre,
    "Dueño teléfono": m.dueno_telefono,
    Mascota: m.mascota_nombre,
    Especie: m.mascota_especie,
    Raza: m.mascota_raza ?? "",
    "Peso (kg)": m.mascota_peso_kg ?? "",
    Monto: m.monto,
    "Método pago": m.metodo_pago,
    Estado: m.estado,
  }));
}
