"use client";
import { useEffect, useState, useTransition } from "react";
import { getAllSuscripciones, cancelarSuscripcion, pausarSuscripcion, reactivarSuscripcion } from "@/lib/actions/suscripciones";
import { Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PauseCircle, PlayCircle, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const estadoVariant: Record<string, "green" | "amber" | "gray" | "red"> = {
  activa: "green",
  pendiente: "amber",
  pausada: "gray",
  cancelada: "red",
};

const estadoLabel: Record<string, string> = {
  activa: "Activa",
  pendiente: "Pendiente",
  pausada: "Pausada",
  cancelada: "Cancelada",
};

export default function SuscripcionesPage() {
  const [suscripciones, setSuscripciones] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () => start(async () => setSuscripciones(await getAllSuscripciones()));
  useEffect(() => { load(); }, []);

  const filtered = suscripciones.filter(s => !filtro || s.estado === filtro);

  const stats = {
    activas: suscripciones.filter(s => s.estado === "activa").length,
    pendientes: suscripciones.filter(s => s.estado === "pendiente").length,
    pausadas: suscripciones.filter(s => s.estado === "pausada").length,
    canceladas: suscripciones.filter(s => s.estado === "cancelada").length,
  };

  const handleAccion = async (accion: string, s: any) => {
    const mensajes: Record<string, string> = {
      pausar: "¿Pausar esta suscripción?",
      reactivar: "¿Reactivar esta suscripción?",
      cancelar: "¿Cancelar esta suscripción? No se puede deshacer.",
    };
    if (!confirm(mensajes[accion])) return;
    if (accion === "pausar") await pausarSuscripcion(s.mp_preapproval_id, s.cliente_id);
    if (accion === "reactivar") await reactivarSuscripcion(s.mp_preapproval_id, s.cliente_id);
    if (accion === "cancelar") await cancelarSuscripcion(s.mp_preapproval_id, s.cliente_id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Suscripciones MP</h1>
          <p className="text-sm text-gray-500">{suscripciones.length} total · {stats.activas} activas</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Activas", value: stats.activas, color: "text-green-700 bg-green-50 border-green-200" },
          { label: "Pendientes", value: stats.pendientes, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Pausadas", value: stats.pausadas, color: "text-gray-600 bg-gray-50 border-gray-200" },
          { label: "Canceladas", value: stats.canceladas, color: "text-red-700 bg-red-50 border-red-200" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border px-4 py-3 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["", "activa", "pendiente", "pausada", "cancelada"].map(e => (
          <button key={e} onClick={() => setFiltro(e)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${filtro === e ? "bg-brand-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {e === "" ? "Todas" : estadoLabel[e]}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      {isPending && !suscripciones.length ? <LoadingSpinner /> :
       !filtered.length ? <EmptyState title="Sin suscripciones" description="No hay suscripciones con este filtro" /> : (
        <>
          {/* Tabla desktop */}
          <div className="card hidden sm:block">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Localidad</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Último pago</th>
                  <th>Creada</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/admin/clientes/${s.cliente_id}`} className="font-medium hover:text-brand-700">
                        {s.cliente?.apellido}, {s.cliente?.nombre}
                      </Link>
                      <p className="text-xs text-gray-400">{s.cliente?.telefono}</p>
                    </td>
                    <td className="text-gray-500 capitalize">{s.cliente?.localidad ?? "—"}</td>
                    <td className="font-semibold">{formatCurrency(s.monto)}/mes</td>
                    <td><Badge variant={estadoVariant[s.estado]}>{estadoLabel[s.estado]}</Badge></td>
                    <td className="text-gray-500">{s.ultimo_pago ? formatDate(s.ultimo_pago) : "—"}</td>
                    <td className="text-gray-400">{formatDate(s.created_at)}</td>
                    <td>
                      <div className="flex gap-2 items-center">
                        {s.estado === "pendiente" && (
                          <a href={s.init_point} target="_blank" rel="noopener noreferrer"
                            className="text-gray-400 hover:text-brand-700" title="Abrir link de pago">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {s.estado === "activa" && (
                          <button onClick={() => handleAccion("pausar", s)}
                            className="text-gray-400 hover:text-amber-600" title="Pausar">
                            <PauseCircle size={14} />
                          </button>
                        )}
                        {s.estado === "pausada" && (
                          <button onClick={() => handleAccion("reactivar", s)}
                            className="text-gray-400 hover:text-green-600" title="Reactivar">
                            <PlayCircle size={14} />
                          </button>
                        )}
                        {["activa", "pausada", "pendiente"].includes(s.estado) && (
                          <button onClick={() => handleAccion("cancelar", s)}
                            className="text-gray-400 hover:text-red-600" title="Cancelar">
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards mobile */}
          <div className="sm:hidden space-y-3">
            {filtered.map(s => (
              <div key={s.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/admin/clientes/${s.cliente_id}`} className="font-medium text-sm hover:text-brand-700">
                    {s.cliente?.apellido}, {s.cliente?.nombre}
                  </Link>
                  <Badge variant={estadoVariant[s.estado]}>{estadoLabel[s.estado]}</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-1">{s.cliente?.telefono} · {s.cliente?.localidad}</p>
                <p className="font-semibold text-sm mb-3">{formatCurrency(s.monto)}/mes</p>
                <div className="flex gap-3">
                  {s.estado === "activa" && (
                    <button onClick={() => handleAccion("pausar", s)} className="text-xs text-amber-600 flex items-center gap-1">
                      <PauseCircle size={12} /> Pausar
                    </button>
                  )}
                  {s.estado === "pausada" && (
                    <button onClick={() => handleAccion("reactivar", s)} className="text-xs text-green-600 flex items-center gap-1">
                      <PlayCircle size={12} /> Reactivar
                    </button>
                  )}
                  {["activa", "pausada", "pendiente"].includes(s.estado) && (
                    <button onClick={() => handleAccion("cancelar", s)} className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle size={12} /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
