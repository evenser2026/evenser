'use client'
import { useEffect, useState, useTransition } from 'react'
import { getConvenios, createConvenio, toggleConvenioActivo } from '@/lib/actions/convenios'
import { Modal, Badge, EmptyState } from '@/components/ui'
import ConvenioForm from '@/components/forms/ConvenioForm'
import { formatCurrency } from '@/lib/utils'
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react'

const tipoLabel: Record<string, string> = {
  empresa: 'Empresa',
  sindicato: 'Sindicato',
  municipio: 'Municipio',
  residencia_adultos: 'Residencia Adultos Mayores',
}
const tipoVariant: Record<string, 'blue'|'purple'|'amber'|'green'> = {
  empresa: 'blue', sindicato: 'purple', municipio: 'amber', residencia_adultos: 'green'
}

export default function ConveniosPage() {
  const [convenios, setConvenios] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [isPending, start] = useTransition()

  const load = () => start(async () => {
    const data = await getConvenios()
    setConvenios(data || [])
  })

  useEffect(() => { load() }, [])

  const handleToggle = async (id: string, activo: boolean) => {
    await toggleConvenioActivo(id, !activo)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Convenios</h1>
          <p className="text-sm text-gray-500">{convenios.filter(c => c.activo).length} activos</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo convenio
        </button>
      </div>

      {isPending ? (
        <div className="p-8 text-center text-gray-400">Cargando...</div>
      ) : convenios.length === 0 ? (
        <div className="card">
          <EmptyState title="Sin convenios" description="Registrá el primer convenio con organizaciones o municipios" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {convenios.map((c: any) => (
            <div key={c.id} className={`card p-5 ${!c.activo ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.nombre}</h3>
                  {c.contacto && <p className="text-sm text-gray-500 mt-0.5">{c.contacto}</p>}
                  {c.telefono && <p className="text-sm text-gray-500">{c.telefono}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tipoVariant[c.tipo]}>{tipoLabel[c.tipo]}</Badge>
                  <button
                    onClick={() => handleToggle(c.id, c.activo)}
                    className={`text-${c.activo ? 'green' : 'gray'}-500 hover:opacity-80 transition-opacity`}
                    title={c.activo ? 'Desactivar' : 'Activar'}
                  >
                    {c.activo ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Prepagos</p>
                  <p className="text-lg font-bold text-gray-900">{c.servicios_prepagos}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Usados</p>
                  <p className="text-lg font-bold text-gray-900">{c.servicios_usados}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Saldo</p>
                  <p className="text-lg font-bold text-green-700">{formatCurrency(c.saldo_favor)}</p>
                </div>
              </div>

              {c.servicios_prepagos > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-brand-700 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (c.servicios_usados / c.servicios_prepagos) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {c.servicios_usados}/{c.servicios_prepagos} servicios utilizados
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo convenio">
        <ConvenioForm
          onCancel={() => setModal(false)}
          onSubmit={async data => { await createConvenio(data); setModal(false); load() }}
        />
      </Modal>
    </div>
  )
}
