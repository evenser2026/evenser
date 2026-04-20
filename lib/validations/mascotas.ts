import { z } from "zod";

export const petCremationSchema = z.object({
  duenio_nombre: z.string().min(2, "Nombre del dueño requerido"),
  duenio_telefono: z.string().min(8, "Teléfono requerido"),
  duenio_dni: z.string().optional(),
  mascota_nombre: z.string().min(1, "Nombre de la mascota requerido"),
  especie: z.string().min(1, "Especie requerida"),
  raza: z.string().optional(),
  peso_kg: z.coerce.number().positive().optional().or(z.literal("")),
  fecha: z.string().min(1, "Fecha requerida"),
  monto: z.coerce.number().positive("Monto debe ser positivo"),
  metodo_pago: z.enum(["efectivo", "transferencia", "mercado_pago"]),
  estado: z.enum(["pagado", "pendiente", "vencido"]).default("pagado"),
  observaciones: z.string().optional(),
});
export type PetCremationInput = z.infer<typeof petCremationSchema>;
