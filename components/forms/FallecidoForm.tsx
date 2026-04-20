'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/ui'

const fallecidoSchema = z.object({
  nombre_fallecido: z.string().min(1, 'Nombre requerido'),
  apellido_fallecido: z.string().min(1, 'Apellido requerido'),
  fecha_fallecimiento: z.string().min(1, 'Fecha requerida'),
  cliente_id: z.string().optional(),
  convenio_id: z.string().optional(),
  cubre_traslado: z.boolean().optional(),
  cubre_capilla: z.boolean().optional(),
  cubre_sala: z.boolean().optional(),
  cubre_tramite: z.boolean().optional(),
  cubre_cremacion: z.boolean().optional(),
  cubre_serv_calle: z.boolean().optional(),
})

type FallecidoInput = z.infer<typeof fallecidoSchema>

interface Props {
  convenios: { id: string; nombre: string }[]
  clientes?: { id: string; nombre: string; apellido: string }[]
  defaultClienteId?: string
  onSubmit: (data: FallecidoInput) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function FallecidoForm({
  convenios,
  clientes,
  defaultClienteId,
  onSubmit,
  onCancel,
  loading: externalLoading,
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading ?? internalLoading

  const showClienteSelector = !!clientes && clientes.length > 0 && !defaultClienteId

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FallecidoInput>({
    resolver: zodResolver(fallecidoSchema),
    defaultValues: {
      nombre_fallecido: '',
      apellido_fallecido: '',
      fecha_fallecimiento: new Date().toISOString().split('T')[0],
      cubre_traslado: false,
      cubre_capilla: false,
      cubre_sala: false,
      cubre_tramite: false,
      cubre_cremacion: false,
      cubre_serv_calle: false,
    },
  })

  const handleFormSubmit = async (data: FallecidoInput) => {
    setInternalLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setInternalLoading(false)
    }
  }

  const servicios = watch()

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.nombre_fallecido?.message} required>
          <input {...register('nombre_fallecido')} className="input" placeholder="Nombre del fallecido" />
        </FormField>
        <FormField label="Apellido" error={errors.apellido_fallecido?.message} required>
          <input {...register('apellido_fallecido')} className="input" placeholder="Apellido del fallecido" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha de fallecimiento" error={errors.fecha_fallecimiento?.message} required>
          <input type="date" {...register('fecha_fallecimiento')} className="input" />
        </FormField>
        {showClienteSelector ? (
          <FormField label="Cliente" error={errors.cliente_id?.message}>
            <select {...register('cliente_id')} className="input">
              <option value="">Sin cliente vinculado</option>
              {clientes!.map((c) => (
                <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>
              ))}
            </select>
          </FormField>
        ) : defaultClienteId ? (
          <input type="hidden" {...register('cliente_id')} value={defaultClienteId} />
        ) : null}
      </div>

      {convenios && convenios.length > 0 && (
        <FormField label="Convenio" error={errors.convenio_id?.message}>
          <select {...register('convenio_id')} className="input">
            <option value="">Sin convenio</option>
            {convenios.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </FormField>
      )}

      <div className="border-t pt-4 mt-4">
        <p className="label mb-3">Servicios incluidos</p>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('cubre_traslado')} />
            <span className="text-sm">Traslado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('cubre_capilla')} />
            <span className="text-sm">Capilla</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('cubre_sala')} />
            <span className="text-sm">Sala</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('cubre_tramite')} />
            <span className="text-sm">Trámite</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('cubre_cremacion')} />
            <span className="text-sm">Cremación</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('cubre_serv_calle')} />
            <span className="text-sm">Serv. Calle</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Guardando...' : 'Registrar'}
        </button>
      </div>
    </form>
  )
}