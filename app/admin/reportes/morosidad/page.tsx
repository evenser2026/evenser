import { getClientes } from "@/lib/actions/clientes";
import { getPagos } from "@/lib/actions/pagos";
import { Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

function diasVencido(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default async function MorosidadPage() {
  const [clientes, pagos] = await Promise.all([getClientes(), getPagos()]);

  // Agrupar pagos vencidos por cliente
  const vencidos = (pagos ?? []).filter((p: any) => p.estado === "vencido");

  type DeudorInfo = {
    cliente: any;
    pagos: any[];
    total: number;
    diasMax: number;
  };

  const porCliente: Record<string, DeudorInfo> = {};
  for (const p of vencidos) {
    if (!porCliente[p.cliente_id]) {
      const cliente = (clientes ?? []).find((c: any) => c.id === p.cliente_id);
      if (!cliente) continue;
      porCliente[p.cliente_id] = { cliente, pagos: [], total: 0, diasMax: 0 };
    }
    porCliente[p.cliente_id].pagos.push(p);
    porCliente[p.cliente_id].total += p.monto;
    const dias = diasVencido(p.fecha);
    if (dias > porCliente[p.cliente_id].diasMax) {
      porCliente[p.cliente_id].diasMax = dias;
    }
  }

  const deudores = Object.values(porCliente).sort((a, b) => b.total - a.total);
  const totalDeuda = deudores.reduce((s, d) => s + d.total, 0);

  function gravedad(dias: number): "amber" | "red" {
    return dias > 60 ? "red" : "amber";
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reporte de morosidad</h1>
          <p className="text-sm text-gray-500">
            {deudores.length} cliente{deudores.length !== 1 ? "s" : ""} con
            pagos vencidos ·{" "}
            <span className="text-red-600 font-medium">
              {formatCurrency(totalDeuda)} total
            </span>
          </p>
        </div>
      </div>

      {deudores.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="text-green-700 font-semibold">Sin clientes morosos</p>
          <p className="text-gray-400 text-sm mt-1">
            Todos los pagos están al día
          </p>
        </div>
      ) : (
        <>
          {/* Resumen rápido */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Deudores totales
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {deudores.length}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Deuda total
              </p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(totalDeuda)}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Críticos (+60 días)
              </p>
              <p className="text-2xl font-bold text-red-700">
                {deudores.filter((d) => d.diasMax > 60).length}
              </p>
            </div>
          </div>

          {/* Tabla de deudores */}
          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Localidad</th>
                    <th>Pagos vencidos</th>
                    <th>Total deuda</th>
                    <th>Días vencido (máx.)</th>
                    <th>Gravedad</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {deudores.map(({ cliente, pagos: ps, total, diasMax }) => (
                    <tr key={cliente.id}>
                      <td className="font-medium">
                        {cliente.apellido}, {cliente.nombre}
                        <span className="block text-xs text-gray-400">
                          DNI {cliente.dni}
                        </span>
                      </td>
                      <td className="text-gray-500">{cliente.localidad}</td>
                      <td>
                        <div className="space-y-1">
                          {ps.map((p: any) => (
                            <div
                              key={p.id}
                              className="text-xs text-gray-600 flex items-center gap-1"
                            >
                              <Clock size={10} className="text-red-400" />
                              {formatDate(p.fecha)} — {formatCurrency(p.monto)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="font-bold text-red-600">
                        {formatCurrency(total)}
                      </td>
                      <td>
                        <span
                          className={`font-semibold ${diasMax > 60 ? "text-red-600" : "text-amber-600"}`}
                        >
                          {diasMax} días
                        </span>
                      </td>
                      <td>
                        <Badge variant={gravedad(diasMax)}>
                          {diasMax > 60 ? "Crítico" : "Advertencia"}
                        </Badge>
                      </td>
                      <td>
                        <Link
                          href={`/admin/clientes/${cliente.id}`}
                          className="text-xs text-brand-700 hover:underline font-medium"
                        >
                          Ver ficha
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
