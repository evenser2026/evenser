-- ============================================================
-- EVENSER - Schema SQL para Supabase
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE localidad_enum AS ENUM (
  'Col. Elisa', 'La Escondida', 'Tirol',
  'La Verde', 'Colonias Unidas', 'Las Garcitas', 'Otra'
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

-- ============================================================
-- TABLA: clients
-- ============================================================
CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre        TEXT NOT NULL,
  apellido      TEXT NOT NULL,
  dni           TEXT NOT NULL,
  telefono      TEXT NOT NULL,
  ocupacion     TEXT,
  obra_social   TEXT,
  localidad     localidad_enum NOT NULL,
  carpeta_nacimiento TEXT,
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_localidad ON clients(localidad);
CREATE INDEX idx_clients_activo    ON clients(activo);
CREATE INDEX idx_clients_apellido  ON clients(apellido);

-- ============================================================
-- TABLA: family_members
-- ============================================================
CREATE TABLE family_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  dni         TEXT NOT NULL,
  edad        INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 120),
  parentesco  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_family_cliente ON family_members(cliente_id);

-- ============================================================
-- TABLA: payments
-- ============================================================
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  monto          NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  fecha          DATE NOT NULL,
  metodo_pago    metodo_pago_enum NOT NULL,
  estado         estado_pago_enum NOT NULL DEFAULT 'pagado',
  tipo_pago      tipo_pago_enum NOT NULL DEFAULT 'mensual',
  descripcion    TEXT,
  checkout_dias  INTEGER DEFAULT 35,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_cliente  ON payments(cliente_id);
CREATE INDEX idx_payments_estado   ON payments(estado);
CREATE INDEX idx_payments_fecha    ON payments(fecha DESC);

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

CREATE INDEX idx_services_cliente ON services(cliente_id);
CREATE INDEX idx_services_tipo    ON services(tipo);
CREATE INDEX idx_services_estado  ON services(estado);
CREATE INDEX idx_services_fecha   ON services(fecha DESC);

-- ============================================================
-- TABLA: agreements (convenios)
-- ============================================================
CREATE TABLE agreements (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre              TEXT NOT NULL,
  tipo                tipo_convenio_enum NOT NULL,
  contacto            TEXT,
  telefono            TEXT,
  servicios_prepagos  INTEGER NOT NULL DEFAULT 0 CHECK (servicios_prepagos >= 0),
  servicios_usados    INTEGER NOT NULL DEFAULT 0 CHECK (servicios_usados >= 0),
  saldo_favor         NUMERIC(12,2) NOT NULL DEFAULT 0,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agreements_activo ON agreements(activo);

-- ============================================================
-- FUNCIÓN: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_agreements_updated_at
  BEFORE UPDATE ON agreements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements     ENABLE ROW LEVEL SECURITY;

-- Política: solo usuarios autenticados pueden acceder
CREATE POLICY "Authenticated users only" ON clients
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated users only" ON family_members
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated users only" ON payments
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated users only" ON services
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated users only" ON agreements
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
