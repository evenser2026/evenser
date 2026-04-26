import { getDashboardStats } from "@/lib/actions/dashboard";
import { getPagos } from "@/lib/actions/pagos";
import { StatCard, Badge } from "@/components/ui";
import { Users, AlertTriangle, DollarSign, Briefcase } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const metodoLabel: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  mercado_pago: "Mercado Pago",
};

const estadoVariant: Record<string, "green" | "amber" | "red"> = {
  pagado: "green",
  pendiente: "amber",
  vencido: "red",
};

const tipoLabel: Record<string, string> = {
  mensual: "Mensual",
  unico: "Único",
  prepago: "Prepago",
};

export default async function DashboardPage() {
  const [stats, pagos] = await Promise.all([getDashboardStats(), getPagos()]);

  const recientes = pagos?.slice(0, 8) ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500">Resumen general del sistema</p>
        </div>
      </div>

      {/* Stats — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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

      {/* Últimos pagos */}
      <div className="card">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Últimos pagos</h2>
        </div>

        {recientes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Sin pagos registrados
          </div>
        ) : (
          <>
            {/* Tabla — solo visible en sm+ */}
            <div className="hidden sm:block table-wrapper rounded-none border-0">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes.map((p: any) => (
                    <tr key={p.id}>
                      <td className="font-medium text-gray-900">
                        {p.clients?.apellido}, {p.clients?.nombre}
                      </td>
                      <td className="text-gray-500">{formatDate(p.fecha)}</td>
                      <td className="font-semibold">
                        {formatCurrency(p.monto)}
                      </td>
                      <td className="text-gray-600">
                        {metodoLabel[p.metodo_pago] ?? p.metodo_pago}
                      </td>
                      <td className="text-gray-600">
                        {tipoLabel[p.tipo_pago] ?? p.tipo_pago}
                      </td>
                      <td>
                        <Badge variant={estadoVariant[p.estado] ?? "gray"}>
                          {p.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards — solo visible en mobile */}
            <div className="sm:hidden divide-y divide-gray-100">
              {recientes.map((p: any) => (
                <div
                  key={p.id}
                  className="p-4 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {p.clients?.apellido}, {p.clients?.nombre}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(p.fecha)} ·{" "}
                      {metodoLabel[p.metodo_pago] ?? p.metodo_pago}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(p.monto)}
                    </p>
                    <div className="mt-1">
                      <Badge variant={estadoVariant[p.estado] ?? "gray"}>
                        {p.estado}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
