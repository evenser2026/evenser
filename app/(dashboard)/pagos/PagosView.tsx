"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPago, deletePago, updateEstadoPago } from "@/lib/actions/pagos";
import { Modal, Badge, EmptyState, ConfirmDialog } from "@/components/ui";
import PagoForm from "@/components/forms/PagoForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Cliente, Pago } from "@/types";
import { Plus, Trash2, RefreshCw } from "lucide-react";

interface Props {
  initialPagos: any[];
  clientes: Cliente[];
}

const estadoVariant: Record<string, "green" | "amber" | "red"> = {
  pagado: "green",
  pendiente: "amber",
  vencido: "red",
};

const metodoLabel: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  mercado_pago: "Mercado Pago",
};

const tipoLabel: Record<string, string> = {
  mensual: "Mensual",
  unico: "Único",
  prepago: "Prepago",
};

const ESTADOS = ["", "pagado", "pendiente", "vencido"] as const;
const ESTADO_LABEL: Record<string, string> = {
  "": "Todos",
  pagado: "Pagados",
  pendiente: "Pendientes",
  vencido: "Vencidos",
};

export default function PagosView({ initialPagos, clientes }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const filtered = filter
    ? initialPagos.filter((p) => p.estado === filter)
    : initialPagos;

  // Totales por estado para el resumen
  const totales = {
    pagado: initialPagos
      .filter((p) => p.estado === "pagado")
      .reduce((s, p) => s + Number(p.monto || 0), 0),
    pendiente: initialPagos
      .filter((p) => p.estado === "pendiente")
      .reduce((s, p) => s + Number(p.monto || 0), 0),
    vencido: initialPagos
      .filter((p) => p.estado === "vencido")
      .reduce((s, p) => s + Number(p.monto || 0), 0),
  };

  const handleCreate = async (data: any) => {
    const res = await createPago(data);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setModal(false);
    setError("");
    router.refresh();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    start(async () => {
      const res = await deletePago(deleteId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setDeleteId(null);
      router.refresh();
    });
  };

  const handleCambiarEstado = (id: string, estadoActual: string) => {
    // Ciclo: pagado → pendiente → vencido → pagado
    const ciclo: Record<string, string> = {
      pagado: "pendiente",
      pendiente: "vencido",
      vencido: "pagado",
    };
    const nuevoEstado = ciclo[estadoActual] || "pendiente";
    start(async () => {
      await updateEstadoPago(id, nuevoEstado);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pagos</h1>
          <p className="text-sm text-gray-500">
            {initialPagos.length} registros
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Registrar pago
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Resumen de totales */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setFilter(filter === "pagado" ? "" : "pagado")}
          className={`card p-4 text-center cursor-pointer transition-all hover:shadow-md ${filter === "pagado" ? "ring-2 ring-green-400" : ""}`}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Cobrado
          </p>
          <p className="text-xl font-bold text-green-700">
            {formatCurrency(totales.pagado)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {initialPagos.filter((p) => p.estado === "pagado").length} pagos
          </p>
        </div>
        <div
          onClick={() => setFilter(filter === "pendiente" ? "" : "pendiente")}
          className={`card p-4 text-center cursor-pointer transition-all hover:shadow-md ${filter === "pendiente" ? "ring-2 ring-amber-400" : ""}`}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Pendiente
          </p>
          <p className="text-xl font-bold text-amber-700">
            {formatCurrency(totales.pendiente)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {initialPagos.filter((p) => p.estado === "pendiente").length} pagos
          </p>
        </div>
        <div
          onClick={() => setFilter(filter === "vencido" ? "" : "vencido")}
          className={`card p-4 text-center cursor-pointer transition-all hover:shadow-md ${filter === "vencido" ? "ring-2 ring-red-400" : ""}`}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Vencido
          </p>
          <p className="text-xl font-bold text-red-700">
            {formatCurrency(totales.vencido)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {initialPagos.filter((p) => p.estado === "vencido").length} pagos
          </p>
        </div>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 mb-4">
        {ESTADOS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? "bg-brand-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {ESTADO_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            title="Sin pagos"
            description={
              filter
                ? `No hay pagos con estado "${ESTADO_LABEL[filter]}"`
                : "No hay pagos registrados aún"
            }
          />
        ) : (
          <div className="table-wrapper rounded-none border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id}>
                    <td className="font-medium text-gray-900">
                      {p.clients?.apellido}, {p.clients?.nombre}
                    </td>
                    <td className="text-gray-500">{formatDate(p.fecha)}</td>
                    <td className="font-semibold">{formatCurrency(p.monto)}</td>
                    <td className="text-gray-600">
                      {metodoLabel[p.metodo_pago] ?? p.metodo_pago}
                    </td>
                    <td className="text-gray-600">
                      {tipoLabel[p.tipo_pago] ?? p.tipo_pago}
                    </td>
                    <td>
                      {/* Click en el badge para cambiar estado rápido */}
                      <button
                        onClick={() => handleCambiarEstado(p.id, p.estado)}
                        title="Click para cambiar estado"
                        className="hover:opacity-70 transition-opacity"
                      >
                        <Badge variant={estadoVariant[p.estado]}>
                          {p.estado}
                        </Badge>
                      </button>
                    </td>
                    <td className="text-gray-400 text-xs max-w-[140px] truncate">
                      {p.descripcion || "—"}
                    </td>
                    <td>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="text-red-400 hover:text-red-600"
                        title="Eliminar pago"
                      >
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

      {/* Modal nuevo pago */}
      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          setError("");
        }}
        title="Registrar pago"
      >
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        <PagoForm
          clientes={clientes}
          onCancel={() => {
            setModal(false);
            setError("");
          }}
          onSubmit={handleCreate}
        />
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar pago"
        message="¿Seguro que querés eliminar este registro? Esta acción no se puede deshacer."
        loading={isPending}
      />
    </div>
  );
}
