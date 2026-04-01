'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pagoSchema, type PagoInput } from '@/lib/validations'
import { FormField } from '@/components/ui'
import type { Cliente } from '@/types'

interface Props {
  clientes?: Cliente[]
  defaultClienteId?: string
  onSubmit: (data: PagoInput) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function PagoForm({
  clientes,
  defaultClienteId,
  onSubmit,
  onCancel,
  loading: externalLoading,
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isLoading = externalLoading ?? internalLoading

  const { register, handleSubmit, formState: { errors } } = useForm<PagoInput>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      cliente_id:   defaultClienteId ?? '',
      monto:        undefined,
      fecha:        new Date().toISOString().split('T')[0],
      metodo_pago:  'efectivo',
      estado:       'pagado',
      tipo_pago:    'mensual',
      descripcion:  '',
      checkout_dias: 35,
    },
  })

  const handleFormSubmit = async (data: PagoInput) => {
    setInternalLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setInternalLoading(false)
    }
  }

  const showClienteSelector = !!clientes && clientes.length > 0 && !defaultClienteId

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

      {showClienteSelector && (
        <FormField label="Cliente" error={errors.cliente_id?.message} required>
          <select {...register('cliente_id')} className="input">
            <option value="">Seleccionar cliente...</option>
            {clientes!.map((c) => (
              <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>
            ))}
          </select>
        </FormField>
      )}

      {defaultClienteId && (
        <input type="hidden" {...register('cliente_id')} />
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Monto ($)" error={errors.monto?.message} required>
          <input
            type="number"
            step="0.01"
            {...register('monto')}
            className="input"
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Fecha" error={errors.fecha?.message} required>
          <input type="date" {...register('fecha')} className="input" />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Método" error={errors.metodo_pago?.message} required>
          <select {...register('metodo_pago')} className="input">
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="mercado_pago">Mercado Pago</option>
          </select>
        </FormField>

        <FormField label="Estado" error={errors.estado?.message} required>
          <select {...register('estado')} className="input">
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>
        </FormField>

        <FormField label="Tipo" error={errors.tipo_pago?.message} required>
          <select {...register('tipo_pago')} className="input">
            <option value="mensual">Mensual</option>
            <option value="unico">Único</option>
            <option value="prepago">Prepago</option>
          </select>
        </FormField>
      </div>

      <FormField label="Descripción (opcional)" error={errors.descripcion?.message}>
        <input
          {...register('descripcion')}
          className="input"
          placeholder="Cuota diciembre 2024..."
        />
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Guardando...' : 'Registrar pago'}
        </button>
      </div>
    </form>
  )
}