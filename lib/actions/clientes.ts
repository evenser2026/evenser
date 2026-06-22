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

export async function eliminarCliente(id: string) {
  const supabase = createClient()
  // Nullificar FKs sin CASCADE antes de borrar
  const tablasSinCascade = [
    { tabla: 'deceased_records', campo: 'cliente_id' },
    { tabla: 'pet_cremations', campo: 'cliente_id' },
    { tabla: 'contract_modifications', campo: 'cliente_id' },
    { tabla: 'suscripciones_mp', campo: 'cliente_id' },
    { tabla: 'push_subscriptions', campo: 'cliente_id' },
    { tabla: 'accounting_entries', campo: 'cliente_id' },
  ]
  for (const { tabla, campo } of tablasSinCascade) {
    await supabase.from(tabla).update({ [campo]: null }).eq(campo, id)
  }
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/clientes')
  return { success: true }
}

export async function activarPortalCliente(id: string, dni: string) {
  const { createAdminClient } = await import('@/lib/supabase/server')
  const supabaseAdmin = createAdminClient()
  const email = `${dni}@evenser.internal`

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: dni,
    email_confirm: true,
  })
  if (authError) {
    if (!authError.message.includes('already')) return { error: authError.message }
    const { data: list } = await supabaseAdmin.auth.admin.listUsers()
    const existing = list?.users?.find((u) => u.email === email)
    if (!existing) return { error: 'Usuario ya existe pero no se pudo recuperar' }
    const { error: updateError } = await supabaseAdmin
      .from('clients')
      .update({ portal_activo: true, portal_user_id: existing.id })
      .eq('id', id)
    if (updateError) return { error: updateError.message }
    revalidatePath(`/admin/clientes/${id}`)
    return { success: true }
  }

  const { error: updateError } = await supabaseAdmin
    .from('clients')
    .update({ portal_activo: true, portal_user_id: authUser.user.id })
    .eq('id', id)
  if (updateError) return { error: updateError.message }
  revalidatePath(`/admin/clientes/${id}`)
  return { success: true }
}

export async function desactivarPortalCliente(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('clients')
    .update({ portal_activo: false })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/admin/clientes/${id}`)
  return { success: true }
}
