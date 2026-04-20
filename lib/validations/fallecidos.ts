import { z } from "zod";

export const deceasedSchema = z.object({
  cliente_id: z.string().uuid().optional().or(z.literal("")),
  familiar_id: z.string().uuid().optional().or(z.literal("")),
  nombre_fallecido: z.string().min(2, "Nombre requerido"),
  apellido_fallecido: z.string().min(2, "Apellido requerido"),
  dni_fallecido: z.string().optional(),
  fecha_fallecimiento: z.string().min(1, "Fecha requerida"),
  causa: z.string().optional(),
  convenio_id: z.string().uuid().optional().or(z.literal("")),
  cubre_traslado: z.boolean().default(false),
  cubre_capilla: z.boolean().default(false),
  cubre_sala: z.boolean().default(false),
  cubre_tramite: z.boolean().default(false),
  cubre_cremacion: z.boolean().default(false),
  cubre_serv_calle: z.boolean().default(false),
  estado: z.enum(["en_proceso", "completado", "cancelado"]).default("en_proceso"),
  observaciones: z.string().optional(),
});
export type DeceasedInput = z.infer<typeof deceasedSchema>;
