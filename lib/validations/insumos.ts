import { z } from "zod";

export const supplySchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  categoria: z.enum(["ataud","urna","flores","velas","ropa","higiene","papeleria","ferreteria","otro"]),
  descripcion: z.string().optional(),
  stock_minimo: z.coerce.number().int().min(0).default(1),
  precio_unitario: z.coerce.number().positive().optional().or(z.literal("")),
  proveedor: z.string().optional(),
});
export type SupplyInput = z.infer<typeof supplySchema>;

export const movementSchema = z.object({
  supply_id: z.string().uuid(),
  tipo: z.enum(["entrada", "salida"]),
  cantidad: z.coerce.number().int().positive("Cantidad debe ser positiva"),
  motivo: z.string().optional(),
});
export type MovementInput = z.infer<typeof movementSchema>;
