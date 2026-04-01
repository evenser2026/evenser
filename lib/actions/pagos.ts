'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PagoInput } from '@/lib/validations'

export async function getPagos(clienteId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('payments')
    .select('*, clients(nombre, apellido)')
    .order('fecha', { ascending: false })
  if (clienteId) query = query.eq('cliente_id', clienteId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createPago(input: PagoInput) {
  const supabase = createClient()
  const { error } = await supabase.from('payments').insert(input)
  if (error) return { error: error.message }
  revalidatePath('/pagos')
  revalidatePath(`/clientes/${input.cliente_id}`)
  return { success: true }
}

export async function updateEstadoPago(id: string, estado: string) {
  const supabase = createClient()
  const { error } = await supabase.from('payments').update({ estado }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/pagos')
  return { success: true }
}

export async function deletePago(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('payments').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/pagos')
  return { success: true }
}

export async function getIngresosDelMes() {
  const supabase = createClient()
  const inicio = new Date()
  inicio.setDate(1)
  inicio.setHours(0, 0, 0, 0)
  const { data, error } = await supabase
    .from('payments')
    .select('monto')
    .eq('estado', 'pagado')
    .gte('fecha', inicio.toISOString())
  if (error) return 0
  return data.reduce((sum, p) => sum + (p.monto || 0), 0)
}
