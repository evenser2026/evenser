-- ============================================================
-- EVENSER — Schema real exportado de Supabase (2026-06-10)
-- Fuente: information_schema.columns + pg_enum
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE localidad_enum AS ENUM (
  'Col. Elisa', 'La Escondida', 'Tirol', 'La Verde',
  'Colonias Unidas', 'Las Garcitas', 'Lapachito', 'Capitán Solari', 'Otra'
);

CREATE TYPE metodo_pago_enum AS ENUM ('efectivo', 'transferencia', 'mercado_pago');
CREATE TYPE estado_pago_enum AS ENUM ('pagado', 'pendiente', 'vencido');
CREATE TYPE tipo_pago_enum AS ENUM ('mensual', 'unico', 'prepago');

CREATE TYPE tipo_servicio_enum AS ENUM (
  'traslado', 'servicios_de_calle', 'capilla_ardiente',
  'servicio_de_sala', 'tramite_registro', 'cremacion'
);
CREATE TYPE estado_servicio_enum AS ENUM ('pendiente', 'en_proceso', 'completado', 'cancelado');
CREATE TYPE tipo_convenio_enum AS ENUM ('empresa', 'sindicato', 'municipio', 'residencia_adultos');

CREATE TYPE tipo_evento_enum AS ENUM (
  'empresarial', 'recepcion', 'social', 'cumpleanos', 'casamiento', 'otro'
);
CREATE TYPE estado_evento_enum AS ENUM ('borrador', 'publicado', 'archivado');
CREATE TYPE tipo_servicio_evento_enum AS ENUM (
  'sonido', 'iluminacion', 'foto', 'video', 'catering', 'decoracion'
);
CREATE TYPE estado_consulta_enum AS ENUM ('nueva', 'en_contacto', 'presupuestada', 'confirmada', 'cancelada');
CREATE TYPE estado_inquiry_enum AS ENUM ('nueva', 'en_seguimiento', 'confirmada', 'cancelada');

CREATE TYPE estado_deceased_enum AS ENUM ('en_proceso', 'completado', 'cancelado');
CREATE TYPE estado_parcela_enum AS ENUM ('libre', 'reservado', 'ocupado', 'mantenimiento');

CREATE TYPE especie_enum AS ENUM ('perro', 'gato', 'ave', 'conejo', 'otro');

CREATE TYPE tipo_movimiento_enum AS ENUM ('ingreso', 'egreso');
CREATE TYPE estado_contabilidad_enum AS ENUM ('ingreso', 'egreso');
CREATE TYPE categoria_movimiento_enum AS ENUM (
  'cuota_mensual', 'servicio_funerario', 'cremacion_mascota',
  'convenio', 'insumo', 'salario', 'alquiler', 'impuesto', 'evento', 'otro'
);

CREATE TYPE categoria_insumo_enum AS ENUM (
  'ataud', 'urna', 'flores', 'velas', 'ropa', 'higiene', 'papeleria', 'ferreteria', 'otro'
);

CREATE TYPE tipo_modificacion_enum AS ENUM (
  'cambio_plan', 'cambio_localidad', 'cambio_obra_social',
  'alta_familiar', 'baja_familiar', 'cambio_telefono', 'otro'
);

CREATE TYPE estado_suministro_enum AS ENUM ('activo', 'inactivo');

-- ============================================================
-- TABLA: clients
-- ============================================================
CREATE TABLE clients (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre             TEXT NOT NULL,
  apellido           TEXT NOT NULL,
  dni                TEXT NOT NULL,
  telefono           TEXT NOT NULL,
  ocupacion          TEXT,
  obra_social        TEXT,
  obra_social_nro_credencial TEXT,
  portal_activo      BOOLEAN NOT NULL DEFAULT FALSE,
  portal_user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  localidad          localidad_enum NOT NULL,
  carpeta_nacimiento TEXT,
  activo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: family_members
-- ============================================================
CREATE TABLE family_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  dni         TEXT NOT NULL,
  edad        INTEGER NOT NULL,
  parentesco  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: payments
-- ============================================================
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  monto          NUMERIC(12,2) NOT NULL,
  fecha          DATE NOT NULL,
  metodo_pago    metodo_pago_enum NOT NULL,
  estado         estado_pago_enum NOT NULL DEFAULT 'pagado',
  tipo_pago      tipo_pago_enum NOT NULL DEFAULT 'mensual',
  descripcion    TEXT,
  checkout_dias  INTEGER DEFAULT 35,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_vence    DATE,
  insep_numero   TEXT,
  mp_payment_id  TEXT
);

-- ============================================================
-- TABLA: services
-- ============================================================
CREATE TABLE services (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tipo          tipo_servicio_enum NOT NULL,
  fecha         DATE NOT NULL,
  estado        estado_servicio_enum NOT NULL DEFAULT 'pendiente',
  observaciones TEXT,
  imagen_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: agreements
-- ============================================================
CREATE TABLE agreements (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre             TEXT NOT NULL,
  tipo               tipo_convenio_enum NOT NULL,
  contacto           TEXT,
  telefono           TEXT,
  servicios_prepagos INTEGER NOT NULL DEFAULT 0,
  servicios_usados   INTEGER NOT NULL DEFAULT 0,
  saldo_favor        NUMERIC(12,2) NOT NULL DEFAULT 0,
  activo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  descripcion        TEXT,
  cubre_traslado     BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_tramite      BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_pompas       BOOLEAN NOT NULL DEFAULT FALSE,
  localidad          localidad_enum,
  direccion          TEXT,
  email              TEXT
);

-- ============================================================
-- TABLA: deceased_records
-- ============================================================
CREATE TABLE deceased_records (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id            UUID NOT NULL REFERENCES clients(id),
  familiar_id           UUID REFERENCES family_members(id),
  es_titular            BOOLEAN NOT NULL DEFAULT FALSE,
  nombre_fallecido      TEXT NOT NULL,
  apellido_fallecido    TEXT NOT NULL,
  dni_fallecido         TEXT,
  fecha_fallecimiento   DATE NOT NULL,
  lugar_fallecimiento   TEXT,
  causa                 TEXT,
  cubre_traslado        BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_capilla         BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_sala            BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_tramite         BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_servicios_calle BOOLEAN NOT NULL DEFAULT FALSE,
  cubre_cremacion       BOOLEAN NOT NULL DEFAULT FALSE,
  estado_tramite        estado_servicio_enum NOT NULL DEFAULT 'pendiente',
  observaciones         TEXT,
  convenio_id           UUID REFERENCES agreements(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: pet_cremations
-- ============================================================
CREATE TABLE pet_cremations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id       UUID REFERENCES clients(id),
  duenio_nombre    TEXT NOT NULL,
  duenio_telefono  TEXT NOT NULL,
  duenio_dni       TEXT,
  mascota_nombre   TEXT NOT NULL,
  especie          especie_enum NOT NULL,
  raza             TEXT,
  peso_kg          NUMERIC,
  fecha_servicio   DATE NOT NULL DEFAULT CURRENT_DATE,
  monto            NUMERIC(12,2) NOT NULL,
  metodo_pago      metodo_pago_enum NOT NULL DEFAULT 'efectivo',
  estado           estado_servicio_enum NOT NULL DEFAULT 'pendiente',
  observaciones    TEXT,
  imagen_url       TEXT,
  certificado_url  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha            DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================
-- TABLA: accounting_entries
-- ============================================================
CREATE TABLE accounting_entries (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo             tipo_movimiento_enum NOT NULL,
  categoria        categoria_movimiento_enum NOT NULL,
  monto            NUMERIC(12,2) NOT NULL,
  fecha            DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion      TEXT NOT NULL,
  comprobante_url  TEXT,
  cliente_id       UUID REFERENCES clients(id),
  pago_id          UUID REFERENCES payments(id),
  servicio_id      UUID REFERENCES services(id),
  convenio_id      UUID REFERENCES agreements(id),
  evento_id        UUID,
  created_by       UUID,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: contract_modifications
-- ============================================================
CREATE TABLE contract_modifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id      UUID NOT NULL REFERENCES clients(id),
  tipo            tipo_modificacion_enum NOT NULL,
  descripcion     TEXT NOT NULL,
  campo_anterior  TEXT,
  campo_nuevo     TEXT,
  usuario_id      UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: events
-- ============================================================
CREATE TABLE events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo       TEXT NOT NULL,
  tipo         tipo_evento_enum NOT NULL,
  fecha        DATE NOT NULL,
  hora         TIME,
  lugar        TEXT,
  descripcion  TEXT,
  capacidad    INTEGER,
  estado       estado_evento_enum NOT NULL DEFAULT 'borrador',
  portada_url  TEXT,
  destacado    BOOLEAN NOT NULL DEFAULT FALSE,
  precio_desde NUMERIC,
  created_by   UUID,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: event_images
-- ============================================================
CREATE TABLE event_images (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  public_id  TEXT,
  caption    TEXT,
  orden      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: event_services
-- ============================================================
CREATE TABLE event_services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  tipo        tipo_servicio_evento_enum NOT NULL,
  descripcion TEXT,
  proveedor   TEXT,
  incluido    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: event_inquiries
-- ============================================================
CREATE TABLE event_inquiries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id          UUID REFERENCES events(id),
  tipo_evento_req   tipo_evento_enum,
  nombre            TEXT NOT NULL,
  telefono          TEXT NOT NULL,
  email             TEXT,
  mensaje           TEXT,
  fecha_estimada    DATE,
  cantidad_personas INTEGER,
  estado            estado_consulta_enum NOT NULL DEFAULT 'nueva',
  notas_internas    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: cemetery_sections
-- ============================================================
CREATE TABLE cemetery_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  orden       INTEGER NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: cemetery_plots
-- ============================================================
CREATE TABLE cemetery_plots (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seccion_id       UUID NOT NULL REFERENCES cemetery_sections(id),
  fila             INTEGER NOT NULL,
  columna          INTEGER NOT NULL,
  numero           TEXT NOT NULL,
  estado           estado_parcela_enum NOT NULL DEFAULT 'libre',
  deceased_id      UUID REFERENCES deceased_records(id),
  nombre_difunto   TEXT,
  fecha_inhumacion DATE,
  cliente_id       UUID REFERENCES clients(id),
  precio           NUMERIC,
  observaciones    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: supplies
-- ============================================================
CREATE TABLE supplies (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre           TEXT NOT NULL,
  categoria        categoria_insumo_enum NOT NULL,
  descripcion      TEXT,
  stock_actual     INTEGER NOT NULL DEFAULT 0,
  stock_minimo     INTEGER NOT NULL DEFAULT 1,
  precio_unitario  NUMERIC,
  proveedor        TEXT,
  activo           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estado           TEXT NOT NULL DEFAULT 'activo'
);

-- ============================================================
-- TABLA: supply_movements
-- ============================================================
CREATE TABLE supply_movements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supply_id   UUID NOT NULL REFERENCES supplies(id),
  tipo        TEXT NOT NULL,
  cantidad    INTEGER NOT NULL,
  motivo      TEXT,
  servicio_id UUID REFERENCES services(id),
  deceased_id UUID REFERENCES deceased_records(id),
  created_by  UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: suscripciones_mp
-- ============================================================
CREATE TABLE suscripciones_mp (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id        UUID NOT NULL REFERENCES clients(id),
  mp_preapproval_id TEXT NOT NULL,
  monto             NUMERIC(12,2) NOT NULL,
  estado            TEXT NOT NULL DEFAULT 'pendiente',
  init_point        TEXT NOT NULL,
  ultimo_pago       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nombre_plan       TEXT,
  fecha_inicio      DATE,
  fecha_vence       DATE,
  insep_numero      TEXT,
  alerta_enviada    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: push_subscriptions
-- ============================================================
CREATE TABLE push_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  UUID REFERENCES clients(id),
  endpoint    TEXT NOT NULL,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: profiles
-- ============================================================
CREATE TABLE profiles (
  id         UUID PRIMARY KEY,
  nombre     TEXT,
  rol        TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: app_config
-- ============================================================
CREATE TABLE app_config (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave       TEXT NOT NULL,
  valor       TEXT NOT NULL,
  descripcion TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
