'use client'
import { useEffect, useState, useTransition } from 'react'
import { getServicios, createServicio, deleteServicio } from '@/lib/actions/servicios'
import { getClientes } from '@/lib/actions/clientes'
import { Modal, Badge, EmptyState, ConfirmDialog } from '@/components/ui'
import ServicioForm from '@/components/forms/ServicioForm'
import { formatDate } from '@/lib/utils'
import type { Cliente } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

const estadoVariant: Record<string, 'green'|'blue'|'amber'|'red'> = {
  completado: 'green', en_proceso: 'blue', pendiente: 'amber', cancelado: 'red'
}
const tipoLabel: Record<string, string> = {
  traslado: 'Traslado',
  servicios_de_calle: 'Servicios de calle',
  capilla_ardiente: 'Capilla ardiente',
  servicio_de_sala: 'Servicio de sala',
  tramite_registro: 'Trámite registro',
  cremacion: 'Cremación',
}

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [modal, setModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [isPending, start] = useTransition()

  const load = () => start(async () => {
    const [s, c] = await Promise.all([getServicios(), getClientes()])
    setServicios(s || [])
    setClientes(c || [])
  })

  useEffect(() => { load() }, [])

  const filtered = servicios.filter(s => {
    if (filterTipo && s.tipo !== filterTipo) return false
    if (filterEstado && s.estado !== filterEstado) return false
    return true
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Servicios</h1>
          <p className="text-sm text-gray-500">{servicios.length} registros</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={filterTipo}
          onChange={e => setFilterTipo(e.target.value)}
          className="input sm:w-52"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(tipoLabel).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          className="input sm:w-44"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="card">
        {isPending ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Sin servicios" description="No hay servicios con ese filtro" />
        ) : (
          <div className="table-wrapper rounded-none border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any) => (
                  <tr key={s.id}>
                    <td className="font-medium text-gray-900">
                      {s.clients?.apellido}, {s.clients?.nombre}
                    </td>
                    <td>{tipoLabel[s.tipo] || s.tipo}</td>
                    <td className="text-gray-500">{formatDate(s.fecha)}</td>
                    <td>
                      <Badge variant={estadoVariant[s.estado]}>
                        {s.estado.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="text-gray-500 max-w-xs truncate text-sm">
                      {s.observaciones || '—'}
                    </td>
                    <td>
                      <button onClick={() => setDeleteId(s.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Registrar servicio">
        <ServicioForm
          clientes={clientes}
          onCancel={() => setModal(false)}
          onSubmit={async data => { await createServicio(data); setModal(false); load() }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) { await deleteServicio(deleteId); setDeleteId(null); load() }
        }}
        title="Eliminar servicio"
        message="¿Seguro que querés eliminar este servicio?"
      />
    </div>
  )
}
