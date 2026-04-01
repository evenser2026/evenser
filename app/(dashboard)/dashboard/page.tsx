import { getDashboardStats } from '@/lib/actions/dashboard'
import { getServicios } from '@/lib/actions/servicios'
import { StatCard, Badge } from '@/components/ui'
import { Users, AlertTriangle, DollarSign, Briefcase } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const tipoLabel: Record<string, string> = {
  traslado: 'Traslado',
  servicios_de_calle: 'Servicios de calle',
  capilla_ardiente: 'Capilla ardiente',
  servicio_de_sala: 'Servicio de sala',
  tramite_registro: 'Trámite registro',
  cremacion: 'Cremación',
}

const estadoVariant: Record<string, 'green' | 'amber' | 'blue' | 'gray' | 'red'> = {
  completado: 'green',
  en_proceso: 'blue',
  pendiente: 'amber',
  cancelado: 'red',
}

export default async function DashboardPage() {
  const [stats, servicios] = await Promise.all([
    getDashboardStats(),
    getServicios(),
  ])

  const recientes = servicios.slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500">Resumen general del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Clientes activos"
          value={stats.clientes_activos}
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          title="Morosos"
          value={stats.clientes_morosos}
          icon={<AlertTriangle size={18} />}
          color="red"
        />
        <StatCard
          title="Ingresos del mes"
          value={formatCurrency(stats.ingresos_mes)}
          icon={<DollarSign size={18} />}
          color="green"
        />
        <StatCard
          title="Servicios (30d)"
          value={stats.servicios_recientes}
          icon={<Briefcase size={18} />}
          color="amber"
        />
      </div>

      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Servicios recientes</h2>
        </div>
        {recientes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Sin servicios registrados</div>
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
                {recientes.map((s: any) => (
                  <tr key={s.id}>
                    <td className="font-medium text-gray-900">
                      {s.clients?.apellido}, {s.clients?.nombre}
                    </td>
                    <td>{tipoLabel[s.tipo] || s.tipo}</td>
                    <td className="text-gray-500">{formatDate(s.fecha)}</td>
                    <td>
                      <Badge variant={estadoVariant[s.estado] || 'gray'}>
                        {s.estado.replace('_', ' ')}
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
