import { z } from "zod";

export const localidades = [
  "Col. Elisa",
  "La Escondida",
  "Tirol",
  "La Verde",
  "Colonias Unidas",
  "Las Garcitas",
  "Otra",
] as const;

export const clienteSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  apellido: z.string().min(2, "Apellido requerido"),
  dni: z.string().min(7, "DNI inválido").max(11),
  telefono: z.string().min(8, "Teléfono requerido"),
  ocupacion: z.string().optional(),
  obra_social: z.string().optional(),
  localidad: z.enum(localidades, {
    errorMap: () => ({ message: "Seleccioná una localidad" }),
  }),
  carpeta_nacimiento: z.string().optional(),
});

export const familiarSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  apellido: z.string().min(2, "Apellido requerido"),
  dni: z.string().min(7, "DNI inválido"),
  edad: z.coerce.number().min(0).max(120),
  parentesco: z.string().min(2, "Parentesco requerido"),
});

export const pagoSchema = z.object({
  cliente_id: z.string().uuid("Cliente requerido"),
  monto: z.coerce.number().positive("Monto debe ser positivo"),
  fecha: z.string().min(1, "Fecha requerida"),
  metodo_pago: z.enum(["efectivo", "transferencia", "mercado_pago"]),
  estado: z.enum(["pagado", "pendiente", "vencido"]),
  tipo_pago: z.enum(["mensual", "unico", "prepago"]),
  descripcion: z.string().optional(),
  checkout_dias: z.coerce.number().optional(),
});

export const servicioSchema = z.object({
  cliente_id: z.string().uuid("Cliente requerido"),
  tipo: z.enum(
    [
      "traslado",
      "servicios_de_calle",
      "capilla_ardiente",
      "servicio_de_sala",
      "tramite_registro",
      "cremacion",
    ],
    {
      errorMap: () => ({ message: "Seleccioná un tipo de servicio" }),
    },
  ),
  fecha: z.string().min(1, "Fecha requerida"),
  estado: z.enum(["pendiente", "en_proceso", "completado", "cancelado"]),
  observaciones: z.string().optional(),
});

export const convenioSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  tipo: z.enum(["empresa", "sindicato", "municipio", "residencia_adultos"], {
    errorMap: () => ({ message: "Seleccioná un tipo de convenio" }),
  }),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  servicios_prepagos: z.coerce.number().min(0),
  saldo_favor: z.coerce.number().min(0),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
export type FamiliarInput = z.infer<typeof familiarSchema>;
export type PagoInput = z.infer<typeof pagoSchema>;
export type ServicioInput = z.infer<typeof servicioSchema>;
export type ConvenioInput = z.infer<typeof convenioSchema>;
