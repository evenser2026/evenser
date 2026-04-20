"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClienteById, updateCliente } from "@/lib/actions/clientes";
import { createFamiliar, deleteFamiliar } from "@/lib/actions/familiares";
import { createPago } from "@/lib/actions/pagos";
import { createServicio } from "@/lib/actions/servicios";
import { getSuscripcionByCliente } from "@/lib/actions/suscripciones";
import { getAppConfig } from "@/lib/actions/config";
import { getConvenios } from "@/lib/actions/convenios";
import {
  getContractModifications,
  registerContractModification,
} from "@/lib/actions/contratos_insumos";
import { createDeceased } from "@/lib/actions/fallecidos";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import ClienteForm from "@/components/forms/ClienteForm";
import FamiliarForm from "@/components/forms/FamiliarForm";
import PagoForm from "@/components/forms/PagoForm";
import ServicioForm from "@/components/forms/ServicioForm";
import FallecidoForm from "@/components/forms/FallecidoForm";
import SuscripcionMP from "@/components/mp/SuscripcionMP";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, UserPlus, Plus, Trash2, HeartPulse, FileText } from "lucide-react";
import type { SuscripcionMP as SuscripcionMPType } from "@/types";
import type { AppConfig } from "@/lib/actions/config";
import type { ClienteInput } from "@/lib/validations";

const estadoPagoVariant: Record<string, "green" | "amber" | "red"> = {
  pagado: "green",
  pendiente: "amber",
  vencido: "red",
};
const estadoServicioVariant: Record<string, "green" | "blue" | "amber" | "red"> = {
  completado: "green",
  en_proceso: "blue",
  pendiente: "amber",
  cancelado: "red",
};

// Campos legibles para el historial de modificaciones
const CAMPO_LABEL: Record<string, string> = {
  nombre: "Nombre",
  apellido: "Apellido",
  dni: "DNI",
  telefono: "Teléfono",
  ocupacion: "Ocupación",
  obra_social: "Obra social",
  localidad: "Localidad",
  carpeta_nacimiento: "Carpeta / Ref.",
};

type Tab = "info" | "familia" | "pagos" | "servicios" | "historial";
type Modals = {
  edit: boolean;
  familiar: boolean;
  pago: boolean;
  servicio: boolean;
  fallecido: boolean;
};

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [suscripcion, setSuscripcion] = useState<SuscripcionMPType | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [convenios, setConvenios] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>("info");
  const [modals, setModals] = useState<Modals>({
    edit: false,
    familiar: false,
    pago: false,
    servicio: false,
    fallecido: false,
  });
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () =>
    start(async () => {
      const [data, sub, cfg, cvs, hist] = await Promise.all([
        getClienteById(id),
        getSuscripcionByCliente(id),
        getAppConfig(),
        getConvenios(),
        getContractModifications(id),
      ]);
      setCliente(data);
      setSuscripcion(sub);
      setAppConfig(cfg);
      setConvenios(cvs);
      setHistorial(hist);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [id]);

  if (isPending && !cliente)
    return <div className="p-8"><LoadingSpinner /></div>;
  if (!cliente)
    return <div className="p-8 text-center text-gray-400">Cliente no encontrado.</div>;

  const closeAll = () => {
    setModals({ edit: false, familiar: false, pago: false, servicio: false, fallecido: false });
    setError("");
  };
  const openModal = (key: keyof Modals) => setModals((m) => ({ ...m, [key]: true }));

  // Al editar, detectar cambios y registrar en historial
  const handleUpdateCliente = async (data: ClienteInput) => {
    // Detectar cambios
    const changes: Array<{ campo: string; valor_anterior: string; valor_nuevo: string }> = [];
    for (const key of Object.keys(data) as Array<keyof ClienteInput>) {
      const anterior = String(cliente[key] ?? "");
      const nuevo = String(data[key] ?? "");
      if (anterior !== nuevo) {
        changes.push({
          campo: key,
          valor_anterior: anterior,
          valor_nuevo: nuevo,
        });
      }
    }

    const res = await updateCliente(id, data);
    if (res?.error) { setError(res.error); return; }

    if (changes.length > 0) {
      await registerContractModification(id, changes);
    }
    closeAll();
    load();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "info", label: "Info" },
    { key: "familia", label: "Grupo familiar" },
    { key: "pagos", label: `Pagos (${cliente.payments?.length ?? 0})` },
    { key: "servicios", label: `Servicios (${cliente.services?.length ?? 0})` },
    { key: "historial", label: "Historial" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="page-title">{cliente.apellido}, {cliente.nombre}</h1>
          <p className="text-sm text-gray-500">DNI {cliente.dni} · {cliente.localidad}</p>
        </div>
        <button
          onClick={() => openModal("fallecido")}
          className="btn-secondary flex items-center gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50"
        >
          <HeartPulse size={15} /> Registrar fallecimiento
        </button>
        <button onClick={() => openModal("edit")} className="btn-secondary">
          Editar
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? "border-brand-700 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Info */}
      {tab === "info" && (
        <div className="space-y-4">
          <div className="card p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              ["Nombre completo", `${cliente.nombre} ${cliente.apellido}`],
              ["DNI", cliente.dni],
              ["Teléfono", cliente.telefono],
              ["Ocupación", cliente.ocupacion || "—"],
              ["Obra social", cliente.obra_social || "—"],
              ["Localidad", cliente.localidad],
              ["Carpeta / Ref.", cliente.carpeta_nacimiento || "—"],
              ["Alta en sistema", formatDate(cliente.created_at)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          <SuscripcionMP
            clienteId={id}
            clienteNombre={`${cliente.nombre} ${cliente.apellido}`}
            tieneObraSocial={!!cliente.obra_social}
            suscripcion={suscripcion}
            montoConObraSocial={appConfig?.monto_con_obra_social ?? 20000}
            montoSinObraSocial={appConfig?.monto_sin_obra_social ?? 25000}
            onUpdate={load}
          />
        </div>
      )}

      {/* Familia */}
      {tab === "familia" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal("familiar")} className="btn-primary flex items-center gap-2">
              <UserPlus size={16} /> Agregar familiar
            </button>
          </div>
          <div className="card">
            {!cliente.family_members?.length ? (
              <EmptyState title="Sin familiares" description="Agregá integrantes del grupo familiar" />
            ) : (
              <table className="table">
                <thead>
                  <tr><th>Nombre</th><th>DNI</th><th>Edad</th><th>Parentesco</th><th></th></tr>
                </thead>
                <tbody>
                  {cliente.family_members.map((f: any) => (
                    <tr key={f.id}>
                      <td className="font-medium">{f.apellido}, {f.nombre}</td>
                      <td className="text-gray-500">{f.dni}</td>
                      <td>{f.edad} años</td>
                      <td>{f.parentesco}</td>
                      <td>
                        <button
                          onClick={async () => {
                            if (!window.confirm("¿Eliminar este familiar?")) return;
                            const res = await deleteFamiliar(f.id, id);
                            if (res?.error) setError(res.error);
                            else load();
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Pagos */}
      {tab === "pagos" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal("pago")} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Registrar pago
            </button>
          </div>
          <div className="card">
            {!cliente.payments?.length ? (
              <EmptyState title="Sin pagos" description="Registrá el primer pago para este cliente" />
            ) : (
              <table className="table">
                <thead>
                  <tr><th>Fecha</th><th>Monto</th><th>Método</th><th>Tipo</th><th>Estado</th><th>Descripción</th></tr>
                </thead>
                <tbody>
                  {cliente.payments.map((p: any) => (
                    <tr key={p.id}>
                      <td>{formatDate(p.fecha)}</td>
                      <td className="font-semibold">{formatCurrency(p.monto)}</td>
                      <td className="capitalize">{p.metodo_pago.replace("_", " ")}</td>
                      <td className="capitalize">{p.tipo_pago}</td>
                      <td><Badge variant={estadoPagoVariant[p.estado]}>{p.estado}</Badge></td>
                      <td className="text-gray-500 max-w-xs truncate text-xs">{p.descripcion || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Servicios */}
      {tab === "servicios" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal("servicio")} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Registrar servicio
            </button>
          </div>
          <div className="card">
            {!cliente.services?.length ? (
              <EmptyState title="Sin servicios" description="No hay servicios registrados para este cliente" />
            ) : (
              <table className="table">
                <thead>
                  <tr><th>Fecha</th><th>Tipo</th><th>Estado</th><th>Observaciones</th></tr>
                </thead>
                <tbody>
                  {cliente.services.map((s: any) => (
                    <tr key={s.id}>
                      <td>{formatDate(s.fecha)}</td>
                      <td className="capitalize">{s.tipo.replace(/_/g, " ")}</td>
                      <td><Badge variant={estadoServicioVariant[s.estado]}>{s.estado.replace("_", " ")}</Badge></td>
                      <td className="text-gray-500 max-w-xs truncate">{s.observaciones || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Historial de modificaciones */}
      {tab === "historial" && (
        <div className="card">
          {!historial.length ? (
            <EmptyState
              title="Sin modificaciones"
              description="Los cambios al contrato de este cliente aparecerán aquí"
            />
          ) : (
            <div className="divide-y divide-gray-50">
              {historial.map((h: any) => (
                <div key={h.id} className="p-4 flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={14} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {CAMPO_LABEL[h.campo] ?? h.campo}
                      </p>
                      {h.usuario_nombre && (
                        <span className="text-xs text-gray-400">por {h.usuario_nombre}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 line-through">{h.valor_anterior || "—"}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-900 font-medium">{h.valor_nuevo || "—"}</span>
                    </div>
                    {h.motivo && (
                      <p className="text-xs text-gray-500 mt-1">Motivo: {h.motivo}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">{formatDate(h.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal open={modals.edit} onClose={closeAll} title="Editar cliente">
        <ClienteForm
          defaultValues={cliente}
          onSubmit={handleUpdateCliente}
          onCancel={closeAll}
          submitLabel="Guardar cambios"
        />
      </Modal>

      <Modal open={modals.familiar} onClose={closeAll} title="Agregar familiar">
        <FamiliarForm
          onSubmit={async (data) => {
            const res = await createFamiliar(id, data);
            if (res?.error) { setError(res.error); return; }
            closeAll();
            load();
          }}
          onCancel={closeAll}
        />
      </Modal>

      <Modal open={modals.pago} onClose={closeAll} title="Registrar pago">
        <PagoForm
          defaultClienteId={id}
          onSubmit={async (data) => {
            const res = await createPago(data);
            if (res?.error) { setError(res.error); return; }
            closeAll();
            load();
          }}
          onCancel={closeAll}
        />
      </Modal>

      <Modal open={modals.servicio} onClose={closeAll} title="Registrar servicio">
        <ServicioForm
          defaultClienteId={id}
          onSubmit={async (data) => {
            const res = await createServicio(data);
            if (res?.error) { setError(res.error); return; }
            closeAll();
            load();
          }}
          onCancel={closeAll}
        />
      </Modal>

      <Modal open={modals.fallecido} onClose={closeAll} title="Registrar fallecimiento">
        <FallecidoForm
          clientes={cliente ? [{ id: cliente.id, nombre: cliente.nombre, apellido: cliente.apellido }] : []}
          convenios={convenios}
          defaultClienteId={id}
          onSubmit={async (data) => {
            const res = await createDeceased({
              ...data,
              estado: "en_proceso",
              cubre_traslado: data.cubre_traslado ?? false,
              cubre_capilla: data.cubre_capilla ?? false,
              cubre_sala: data.cubre_sala ?? false,
              cubre_tramite: data.cubre_tramite ?? false,
              cubre_cremacion: data.cubre_cremacion ?? false,
              cubre_serv_calle: data.cubre_serv_calle ?? false,
            });
            if (res?.error) { setError(res.error); return; }
            closeAll();
          }}
          onCancel={closeAll}
        />
      </Modal>
    </div>
  );
}