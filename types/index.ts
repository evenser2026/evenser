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
  | "Lapachito"
  | "Capitán Solari"
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

export type EstadoDeceased = "en_proceso" | "completado" | "cancelado";
export type TipoContabilidad = "ingreso" | "egreso";

// Nuevos enums
export type TipoEvento =
  | "empresarial"
  | "recepcion"
  | "social"
  | "cumpleanos"
  | "casamiento"
  | "otro";

export type EstadoEvento = "borrador" | "publicado" | "archivado";

export type TipoServicioEvento =
  | "sonido"
  | "iluminacion"
  | "foto"
  | "video"
  | "catering"
  | "decoracion";

export type EstadoConsulta =
  | "nueva"
  | "en_contacto"
  | "presupuestada"
  | "confirmada"
  | "cancelada";

export type EstadoParcela = "libre" | "reservado" | "ocupado" | "mantenimiento";

export type EspecieMascota = "perro" | "gato" | "ave" | "conejo" | "otro";

export type TipoMovimientoStock = "entrada" | "salida";

export type CategoriaInsumo =
  | "ataud"
  | "urna"
  | "flores"
  | "velas"
  | "ropa"
  | "higiene"
  | "papeleria"
  | "ferreteria"
  | "otro";

export type CategoriaMovimiento =
  | "cuota_mensual"
  | "servicio_funerario"
  | "cremacion_mascota"
  | "convenio"
  | "insumo"
  | "salario"
  | "alquiler"
  | "impuesto"
  | "evento"
  | "otro";

export type TipoModificacion =
  | "cambio_plan"
  | "cambio_localidad"
  | "cambio_obra_social"
  | "alta_familiar"
  | "baja_familiar"
  | "cambio_telefono"
  | "otro";

// ── Entidades ──────────────────────────────────────────────────

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string;
  ocupacion?: string;
  obra_social?: string;
  obra_social_nro_credencial?: string;
  portal_activo?: boolean;
  portal_user_id?: string;
  localidad: Localidad;
  carpeta_nacimiento?: string;
  activo: boolean;
  metodo_cobro: 'mp' | 'manual';
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
  fecha_vence?: string;
  insep_numero?: string;
  mp_payment_id?: string;
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
  descripcion?: string;
  localidad?: Localidad;
  direccion?: string;
  email?: string;
  servicios_prepagos: number;
  servicios_usados: number;
  saldo_favor: number;
  activo: boolean;
  cubre_traslado: boolean;
  cubre_tramite: boolean;
  cubre_pompas: boolean;
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
  alerta_enviada?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeceasedRecord {
  id: string;
  cliente_id: string;
  familiar_id?: string;
  es_titular: boolean;
  nombre_fallecido: string;
  apellido_fallecido: string;
  dni_fallecido?: string;
  fecha_fallecimiento: string;
  lugar_fallecimiento?: string;
  causa?: string;
  convenio_id?: string;
  cubre_traslado: boolean;
  cubre_capilla: boolean;
  cubre_sala: boolean;
  cubre_tramite: boolean;
  cubre_servicios_calle: boolean;
  cubre_cremacion: boolean;
  estado_tramite: EstadoServicio;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // joins opcionales
  cliente?: Pick<Cliente, "id" | "nombre" | "apellido">;
  convenio?: Pick<Convenio, "id" | "nombre">;
}

export interface PetCremation {
  id: string;
  cliente_id?: string;
  duenio_nombre: string;
  duenio_telefono: string;
  duenio_dni?: string;
  mascota_nombre: string;
  especie: EspecieMascota;
  raza?: string;
  peso_kg?: number;
  fecha_servicio: string;
  fecha: string;
  monto: number;
  metodo_pago: MetodoPago;
  estado: EstadoServicio;
  foto_url?: string;
  certificado_url?: string;
  observaciones?: string;
  imagen_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountingEntry {
  id: string;
  tipo: TipoContabilidad;
  categoria: CategoriaMovimiento;
  descripcion: string;
  monto: number;
  fecha: string;
  comprobante_url?: string;
  cliente_id?: string;
  pago_id?: string;
  servicio_id?: string;
  convenio_id?: string;
  evento_id?: string;
  created_by?: string;
  created_at: string;
  cliente?: Pick<Cliente, "id" | "nombre" | "apellido">;
}

export interface ContractModification {
  id: string;
  cliente_id: string;
  tipo: TipoModificacion;
  descripcion: string;
  campo_anterior?: string;
  campo_nuevo?: string;
  usuario_id?: string;
  created_at: string;
}

// ── Eventos ───────────────────────────────────────────────────





// ── Cementerio ────────────────────────────────────────────────

export interface CemeterySection {
  id: string;
  nombre: string;
  descripcion?: string;
  orden: number;
  activo: boolean;
  created_at: string;
  // joins opcionales
  parcelas?: CemeteryPlot[];
}

export interface CemeteryPlot {
  id: string;
  seccion_id: string;
  fila: number;
  columna: number;
  numero: string;
  estado: EstadoParcela;
  deceased_id?: string;
  nombre_difunto?: string;
  fecha_inhumacion?: string;
  cliente_id?: string;
  precio?: number;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // joins opcionales
  seccion?: Pick<CemeterySection, "id" | "nombre">;
  cliente?: Pick<Cliente, "id" | "nombre" | "apellido">;
}

// ── Insumos ───────────────────────────────────────────────────

export interface Supply {
  id: string;
  nombre: string;
  categoria: CategoriaInsumo;
  descripcion?: string;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario?: number;
  proveedor?: string;
  activo: boolean;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface SupplyMovement {
  id: string;
  supply_id: string;
  tipo: TipoMovimientoStock;
  cantidad: number;
  motivo?: string;
  servicio_id?: string;
  deceased_id?: string;
  created_by?: string;
  created_at: string;
  // joins opcionales
  supply?: Pick<Supply, "id" | "nombre" | "categoria">;
}
