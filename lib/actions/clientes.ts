'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ClienteInput } from '@/lib/validations'

export async function getClientes(localidad?: string) {
  const supabase = createClient()
  let query = supabase
    .from('clients')
    .select('*')
    .eq('activo', true)
    .order('apellido')
  if (localidad) query = query.eq('localidad', localidad)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getClienteById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*, family_members(*), payments(*), services(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCliente(input: ClienteInput) {
  const supabase = createClient()
  const { error } = await supabase.from('clients').insert(input)
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  return { success: true }
}

export async function updateCliente(id: string, input: ClienteInput) {
  const supabase = createClient()
  const { error } = await supabase.from('clients').update(input).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  revalidatePath(`/admin/clientes/${id}`)
  return { success: true }
}

export async function deleteCliente(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('clients').update({ activo: false }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  return { success: true }
}
