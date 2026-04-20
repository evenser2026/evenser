// ============================================================
// EVENSER — Tipos TypeScript
// ============================================================

// ── Enums base ────────────────────────────────────────────────
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

// Nuevos
export type EstadoDeceased = "en_proceso" | "completado" | "cancelado";
export type TipoContabilidad = "ingreso" | "egreso";

// ── Entidades existentes ──────────────────────────────────────
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
  fecha_vence?: string; // nuevo
  insep_numero?: string; // nuevo
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
  cubre_traslado: boolean; // nuevo
  cubre_tramite: boolean; // nuevo
  cubre_pompas: boolean; // nuevo
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

// ── Nuevas entidades ──────────────────────────────────────────

export interface DeceasedRecord {
  id: string;
  cliente_id?: string;
  familiar_id?: string;
  nombre_fallecido: string;
  apellido_fallecido: string;
  dni_fallecido?: string;
  fecha_fallecimiento: string;
  causa?: string;
  convenio_id?: string;
  cubre_traslado: boolean;
  cubre_capilla: boolean;
  cubre_sala: boolean;
  cubre_tramite: boolean;
  cubre_cremacion: boolean;
  cubre_serv_calle: boolean;
  estado: EstadoDeceased;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // joins opcionales
  cliente?: Pick<Cliente, "id" | "nombre" | "apellido">;
  convenio?: Pick<Convenio, "id" | "nombre">;
}

export interface PetCremation {
  id: string;
  duenio_nombre: string;
  duenio_telefono: string;
  duenio_dni?: string;
  mascota_nombre: string;
  mascota_especie: string;
  mascota_raza?: string;
  mascota_peso_kg?: number;
  fecha: string;
  monto: number;
  metodo_pago: MetodoPago;
  estado_pago: EstadoPago;
  foto_url?: string;
  certificado_url?: string;
  observaciones?: string;
  created_at: string;
}

export interface AccountingEntry {
  id: string;
  tipo: TipoContabilidad;
  categoria: string;
  descripcion?: string;
  monto: number;
  fecha: string;
  comprobante_url?: string;
  cliente_id?: string;
  cerrado: boolean;
  created_at: string;
  cliente?: Pick<Cliente, "id" | "nombre" | "apellido">;
}

export interface ContractModification {
  id: string;
  cliente_id: string;
  campo: string;
  valor_anterior?: string;
  valor_nuevo: string;
  motivo?: string;
  usuario_email?: string;
  created_at: string;
}

