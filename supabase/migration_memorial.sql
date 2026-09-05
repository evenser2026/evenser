-- ============================================================
-- Memorial Virtual — Concepto B
-- Ejecutar manualmente en el SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- TABLA: memorials
-- Un memorial público por cada fallecido cargado por el staff
-- ============================================================
CREATE TABLE memorials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deceased_id UUID NOT NULL UNIQUE REFERENCES deceased_records(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL UNIQUE,
  foto_url    TEXT,
  frase       TEXT,
  biografia   TEXT,
  velas_count INTEGER NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memorials_deceased ON memorials(deceased_id);
CREATE INDEX idx_memorials_slug ON memorials(slug);

-- ============================================================
-- TABLA: memorial_messages
-- Mensajes de condolencias públicos, con moderación básica
-- ============================================================
CREATE TABLE memorial_messages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id  UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  autor_nombre TEXT NOT NULL,
  mensaje      TEXT NOT NULL,
  estado       TEXT NOT NULL DEFAULT 'visible' CHECK (estado IN ('visible', 'oculto')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memorial_messages_memorial ON memorial_messages(memorial_id);

-- ============================================================
-- FUNCIÓN: increment_velas
-- Incremento atómico para evitar condiciones de carrera cuando
-- varios visitantes encienden una vela al mismo tiempo
-- ============================================================
CREATE OR REPLACE FUNCTION increment_velas(memorial_id_input UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  nuevo_valor INTEGER;
BEGIN
  UPDATE memorials
  SET velas_count = velas_count + 1
  WHERE id = memorial_id_input
  RETURNING velas_count INTO nuevo_valor;

  RETURN nuevo_valor;
END;
$$;
