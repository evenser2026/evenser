export type Localidad =
  | "Col. Elisa"
  | "La Escondida"
  | "Tirol"
  | "La Verde"
  | "Colonias Unidas"
  | "Las Garcitas"
  | "Otra";

export type MetodoPago = "efectivo" | "transferencia" | "mercado_pago";
export type EstadoPago = "pagado" | "pendiente" | "vencido";
export type TipoPago = "mensual" | "unico" | "prepago";

export type TipoServicio =
  | "traslado"
  | "servicios_de_calle"
  | "capilla_ardiente"
  | "servicio_de_sala"
  | "tramite_registro"
  | "cremacion";

export type EstadoServicio =
  | "pendiente"
  | "en_proceso"
  | "completado"
  | "cancelado";
export type TipoConvenio =
  | "empresa"
  | "sindicato"
  | "municipio"
  | "residencia_adultos";
export type EstadoSuscripcion =
  | "pendiente"
  | "activa"
  | "pausada"
  | "cancelada";

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  ocupacion?: string;
  obra_social?: string;
  localidad: Localidad;
  carpeta_nacimiento?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamiliarIntegrante {
  id: string;
  cliente_id: string;
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  parentesco: string;
  created_at: string;
}

export interface Pago {
  id: string;
  cliente_id: string;
  monto: number;
  fecha: string;
  metodo_pago: MetodoPago;
  estado: EstadoPago;
  tipo_pago: TipoPago;
  descripcion?: string;
  checkout_dias?: number;
  created_at: string;
  cliente?: Cliente;
}

export interface Servicio {
  id: string;
  cliente_id: string;
  tipo: TipoServicio;
  fecha: string;
  estado: EstadoServicio;
  observaciones?: string;
  imagen_url?: string;
  created_at: string;
  cliente?: Cliente;
}

export interface Convenio {
  id: string;
  nombre: string;
  tipo: TipoConvenio;
  contacto?: string;
  telefono?: string;
  servicios_prepagos: number;
  servicios_usados: number;
  saldo_favor: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  clientes_activos: number;
  clientes_morosos: number;
  ingresos_mes: number;
  servicios_recientes: number;
}

export interface SuscripcionMP {
  id: string;
  cliente_id: string;
  mp_preapproval_id: string;
  monto: number;
  estado: EstadoSuscripcion;
  init_point: string;
  ultimo_pago?: string;
  created_at: string;
  updated_at: string;
}
