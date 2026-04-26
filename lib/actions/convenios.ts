'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ConvenioInput } from '@/lib/validations'

export async function getConvenios() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('agreements')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data
}

export async function createConvenio(input: ConvenioInput) {
  const supabase = createClient()
  const { error } = await supabase.from('agreements').insert({
    ...input,
    servicios_usados: 0,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/convenios')
  return { success: true }
}

export async function updateConvenio(id: string, input: Partial<ConvenioInput>) {
  const supabase = createClient()
  const { error } = await supabase.from('agreements').update(input).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/convenios')
  return { success: true }
}

export async function toggleConvenioActivo(id: string, activo: boolean) {
  const supabase = createClient()
  const { error } = await supabase.from('agreements').update({ activo }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/convenios')
  return { success: true }
}
