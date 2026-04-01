import { getClientes } from '@/lib/actions/clientes'
import { getPagos } from '@/lib/actions/pagos'
import { getServicios } from '@/lib/actions/servicios'
import { Badge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function ReportesPage() {
  const [clientes, pagos, servicios] = await Promise.all([
    getClientes(),
    getPagos(),
    getServicios(),
  ])

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

  const pagosMes = pagos.filter((p: any) => new Date(p.fecha) >= inicioMes)
  const ingresosMes = pagosMes
    .filter((p: any) => p.estado === 'pagado')
    .reduce((s: number, p: any) => s + p.monto, 0)

  const morosos = pagos.filter((p: any) => p.estado === 'vencido')
  const idsMorosos = new Set(morosos.map((p: any) => p.cliente_id))

  const porLocalidad = clientes.reduce((acc: Record<string, number>, c: any) => {
    acc[c.localidad] = (acc[c.localidad] || 0) + 1
    return acc
  }, {})

  const porTipoServicio = servicios.reduce((acc: Record<string, number>, s: any) => {
    acc[s.tipo] = (acc[s.tipo] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="text-sm text-gray-500">Resumen ejecutivo del sistema</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Ingresos del mes */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ingresos del mes actual</h2>
          <p className="text-3xl font-bold text-green-700">{formatCurrency(ingresosMes)}</p>
          <p className="text-sm text-gray-500 mt-1">{pagosMes.length} pagos registrados en el mes</p>
          <div className="mt-4 space-y-2">
            {(['pagado','pendiente','vencido'] as const).map(e => {
              const v: Record<string, 'green'|'amber'|'red'> = { pagado:'green', pendiente:'amber', vencido:'red' }
              const count = pagosMes.filter((p: any) => p.estado === e).length
              return (
                <div key={e} className="flex items-center justify-between text-sm">
                  <Badge variant={v[e]}>{e}</Badge>
                  <span className="text-gray-700 font-medium">{count} pagos</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Clientes por localidad */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Clientes por localidad</h2>
          <div className="space-y-3">
            {Object.entries(porLocalidad)
              .sort(([,a],[,b]) => b - a)
              .map(([loc, count]) => (
                <div key={loc}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{loc}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-brand-600 h-1.5 rounded-full"
                      style={{ width: `${(count / clientes.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Servicios por tipo */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Servicios por tipo</h2>
          {Object.keys(porTipoServicio).length === 0 ? (
            <p className="text-gray-400 text-sm">Sin servicios registrados</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(porTipoServicio)
                .sort(([,a],[,b]) => b - a)
                .map(([tipo, count]) => (
                  <div key={tipo} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700 capitalize">{tipo.replace(/_/g,' ')}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Clientes morosos */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Clientes con pagos vencidos
            <span className="ml-2 text-red-600 font-bold">{idsMorosos.size}</span>
          </h2>
          {idsMorosos.size === 0 ? (
            <p className="text-green-600 text-sm font-medium">✓ Sin clientes morosos</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {morosos.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {(p as any).clients?.apellido}, {(p as any).clients?.nombre}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(p.fecha)}</p>
                  </div>
                  <span className="font-semibold text-red-600">{formatCurrency(p.monto)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Servicios recientes */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Últimos 10 servicios</h2>
        {servicios.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin servicios registrados</p>
        ) : (
          <div className="table-wrapper rounded-none border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {servicios.slice(0, 10).map((s: any) => (
                  <tr key={s.id}>
                    <td className="font-medium">{s.clients?.apellido}, {s.clients?.nombre}</td>
                    <td className="capitalize text-gray-600">{s.tipo.replace(/_/g,' ')}</td>
                    <td className="text-gray-500">{formatDate(s.fecha)}</td>
                    <td>
                      <Badge variant={
                        s.estado === 'completado' ? 'green' :
                        s.estado === 'en_proceso' ? 'blue' :
                        s.estado === 'pendiente' ? 'amber' : 'red'
                      }>
                        {s.estado.replace('_',' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
