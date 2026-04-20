import { z } from "zod";

export const accountingSchema = z.object({
  tipo: z.enum(["ingreso", "egreso"]),
  categoria: z.string().min(2, "Categoría requerida"),
  descripcion: z.string().optional(),
  monto: z.coerce.number().positive("Monto debe ser positivo"),
  fecha: z.string().min(1, "Fecha requerida"),
  cliente_id: z.string().uuid().optional().or(z.literal("")),
});
export type AccountingInput = z.infer<typeof accountingSchema>;
