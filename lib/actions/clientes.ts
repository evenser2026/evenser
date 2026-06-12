'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ClienteInput } from '@/lib/validations'
import { sendTelegram } from '@/lib/telegram'

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

function siguienteFechaVence(desde: Date): string {
  const dia = desde.getDate()
  const siguiente = new Date(desde)
  siguiente.setMonth(siguiente.getMonth() + 1)
  if (siguiente.getDate() !== dia) siguiente.setDate(0)
  return siguiente.toISOString().split('T')[0]
}
export async function createCliente(input: ClienteInput) {
  const supabase = createClient()
  const { data: novo, error } = await supabase
    .from('clients')
    .insert(input)
    .select('id, nombre, apellido, metodo_cobro')
    .single()
  if (error) return { error: error.message }

  if (novo && novo.metodo_cobro === 'manual') {
    const hoy = new Date()
    const fechaVence = siguienteFechaVence(hoy)
    await supabase.from('payments').insert({
      cliente_id: novo.id,
      monto: 0,
      fecha: hoy.toISOString().split('T')[0],
      metodo_pago: 'efectivo',
      estado: 'pendiente',
      tipo_pago: 'mensual',
      descripcion: 'Cuota mensual',
      fecha_vence: fechaVence,
    })
  }

  await sendTelegram(`🆕 Nuevo cliente: ${novo?.apellido} ${novo?.nombre} (${input.metodo_cobro === 'mp' ? 'Mercado Pago' : 'Manual'})`)
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
