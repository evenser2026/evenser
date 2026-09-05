import { z } from "zod";

export const seccionSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  descripcion: z.string().optional(),
  orden: z.coerce.number().int().min(0).default(0),
});
export type SeccionInput = z.infer<typeof seccionSchema>;

export const generarParcelasSchema = z.object({
  seccion_id: z.string().uuid(),
  filas: z.coerce.number().int().min(1, "Mínimo 1").max(50, "Máximo 50"),
  columnas: z.coerce.number().int().min(1, "Mínimo 1").max(50, "Máximo 50"),
  prefijo: z.string().min(1, "Prefijo requerido").max(6, "Máximo 6 caracteres"),
});
export type GenerarParcelasInput = z.infer<typeof generarParcelasSchema>;

export const parcelaUpdateSchema = z.object({
  estado: z.enum(["libre", "reservado", "ocupado", "mantenimiento"]),
  nombre_difunto: z.string().optional(),
  fecha_inhumacion: z.string().optional(),
  cliente_id: z.string().uuid().optional().or(z.literal("")),
  precio: z.coerce.number().positive().optional().or(z.literal("")),
  observaciones: z.string().optional(),
});
export type ParcelaUpdateInput = z.infer<typeof parcelaUpdateSchema>;
