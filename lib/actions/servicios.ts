'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ServicioInput = {
  cliente_id: string
  tipo:
    | 'traslado'
    | 'servicios_de_calle'
    | 'capilla_ardiente'
    | 'servicio_de_sala'
    | 'tramite_registro'
    | 'cremacion'
  fecha: string
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
  observaciones?: string | null
  imagen_url?: string | null
}

export async function getServicios() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('services')
    .select(
      `
      id,
      cliente_id,
      tipo,
      fecha,
      estado,
      observaciones,
      imagen_url,
      created_at,
      clients (
        id,
        nombre,
        apellido
      )
    `
    )
    .order('fecha', { ascending: false })

  if (error) {
    console.error('Error al obtener servicios:', error.message)
    return []
  }

  return data ?? []
}

export async function createServicio(input: ServicioInput) {
  const supabase = createClient()

  const payload = {
    cliente_id: input.cliente_id,
    tipo: input.tipo,
    fecha: input.fecha,
    estado: input.estado ?? 'pendiente',
    observaciones: input.observaciones ?? null,
    imagen_url: input.imagen_url ?? null,
  }

  const { error } = await supabase.from('services').insert(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/servicios')

  return { success: true }
}

export async function updateServicio(id: string, input: Partial<ServicioInput>) {
  const supabase = createClient()

  const payload = {
    ...(input.cliente_id !== undefined ? { cliente_id: input.cliente_id } : {}),
    ...(input.tipo !== undefined ? { tipo: input.tipo } : {}),
    ...(input.fecha !== undefined ? { fecha: input.fecha } : {}),
    ...(input.estado !== undefined ? { estado: input.estado } : {}),
    ...(input.observaciones !== undefined
      ? { observaciones: input.observaciones ?? null }
      : {}),
    ...(input.imagen_url !== undefined ? { imagen_url: input.imagen_url ?? null } : {}),
  }

  const { error } = await supabase.from('services').update(payload).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/servicios')

  return { success: true }
}

export async function deleteServicio(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/servicios')

  return { success: true }
}