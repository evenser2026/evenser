-- Migración: agregar columna email a clients
-- Necesaria para el aviso automático de alta (email a Ángel + cliente)
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE clients ADD COLUMN IF NOT EXISTS email TEXT;
