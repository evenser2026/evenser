'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { familiarSchema, type FamiliarInput } from '@/lib/validations'
import { FormField } from '@/components/ui'

interface Props {
  onSubmit: (data: FamiliarInput) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function FamiliarForm({ onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FamiliarInput>({
    resolver: zodResolver(familiarSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.nombre?.message} required>
          <input {...register('nombre')} className="input" />
        </FormField>
        <FormField label="Apellido" error={errors.apellido?.message} required>
          <input {...register('apellido')} className="input" />
        </FormField>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="DNI" error={errors.dni?.message} required>
          <input {...register('dni')} className="input" />
        </FormField>
        <FormField label="Edad" error={errors.edad?.message} required>
          <input type="number" {...register('edad')} className="input" />
        </FormField>
        <FormField label="Parentesco" error={errors.parentesco?.message} required>
          <input {...register('parentesco')} className="input" placeholder="Cónyuge, hijo..." />
        </FormField>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Agregar familiar'}
        </button>
      </div>
    </form>
  )
}
