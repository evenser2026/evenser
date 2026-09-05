import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const memorialSchema = z.object({
  deceased_id: z.string().uuid("Seleccioná un fallecido"),
  slug: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(80, "Máximo 80 caracteres")
    .regex(slugRegex, "Solo minúsculas, números y guiones (ej: juan-perez)"),
  foto_url: z.string().url().optional().or(z.literal("")),
  frase: z.string().max(200, "Máximo 200 caracteres").optional(),
  biografia: z.string().max(3000, "Máximo 3000 caracteres").optional(),
  activo: z.boolean().default(true),
});
export type MemorialInput = z.infer<typeof memorialSchema>;

export const memorialMessageSchema = z.object({
  autor_nombre: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres"),
  mensaje: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(500, "Máximo 500 caracteres"),
});
export type MemorialMessageInput = z.infer<typeof memorialMessageSchema>;
