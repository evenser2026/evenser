"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClienteById, updateCliente } from "@/lib/actions/clientes";
import { createFamiliar, deleteFamiliar } from "@/lib/actions/familiares";
import { createPago } from "@/lib/actions/pagos";
import { createServicio } from "@/lib/actions/servicios";
import { getSuscripcionByCliente } from "@/lib/actions/suscripciones";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import ClienteForm from "@/components/forms/ClienteForm";
import FamiliarForm from "@/components/forms/FamiliarForm";
import PagoForm from "@/components/forms/PagoForm";
import ServicioForm from "@/components/forms/ServicioForm";
import SuscripcionMP from "@/components/mp/SuscripcionMP";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, UserPlus, Plus, Trash2 } from "lucide-react";

const estadoPagoVariant: Record<string, "green" | "amber" | "red"> = {
  pagado: "green",
  pendiente: "amber",
  vencido: "red",
};
const estadoServicioVariant: Record<
  string,
  "green" | "blue" | "amber" | "red"
> = {
  completado: "green",
  en_proceso: "blue",
  pendiente: "amber",
  cancelado: "red",
};

type Tab = "info" | "familia" | "pagos" | "servicios";
type Modals = {
  edit: boolean;
  familiar: boolean;
  pago: boolean;
  servicio: boolean;
};

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [suscripcion, setSuscripcion] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("info");
  const [modals, setModals] = useState<Modals>({
    edit: false,
    familiar: false,
    pago: false,
    servicio: false,
  });
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () =>
    start(async () => {
      const [data, sub] = await Promise.all([
        getClienteById(id),
        getSuscripcionByCliente(id),
      ]);
      setCliente(data);
      setSuscripcion(sub);
    });

  useEffect(() => {
    load();
  }, [id]);

  if (isPending && !cliente)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  if (!cliente)
    return (
      <div className="p-8 text-center text-gray-400">
        Cliente no encontrado.
      </div>
    );

  const closeAll = () => {
    setModals({ edit: false, familiar: false, pago: false, servicio: false });
    setError("");
  };
  const openModal = (key: keyof Modals) =>
    setModals((m) => ({ ...m, [key]: true }));

  const handleEdit = async (data: any) => {
    const res = await updateCliente(id, data);
    if (res?.error) {
      setError(res.error);
      return;
    }
    closeAll();
    load();
  };

  const handleFamiliar = async (data: any) => {
    const res = await createFamiliar(id, data);
    if (res?.error) {
      setError(res.error);
      return;
    }
    closeAll();
    load();
  };

  const handleDeleteFamiliar = async (familiarId: string) => {
    if (!window.confirm("¿Eliminar este familiar?")) return;
    const res = await deleteFamiliar(familiarId, id);
    if (res?.error) {
      setError(res.error);
      return;
    }
    load();
  };

  const handlePago = async (data: any) => {
    const res = await createPago(data);
    if (res?.error) {
      setError(res.error);
      return;
    }
    closeAll();
    load();
  };

  const handleServicio = async (data: any) => {
    const res = await createServicio(data);
    if (res?.error) {
      setError(res.error);
      return;
    }
    closeAll();
    load();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "info", label: "Info" },
    { key: "familia", label: "Grupo familiar" },
    { key: "pagos", label: `Pagos (${cliente.payments?.length ?? 0})` },
    { key: "servicios", label: `Servicios (${cliente.services?.length ?? 0})` },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="page-title">
            {cliente.apellido}, {cliente.nombre}
          </h1>
          <p className="text-sm text-gray-500">
            DNI {cliente.dni} · {cliente.localidad}
          </p>
        </div>
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
          {/* Datos personales */}
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
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Suscripción MP — separado, fuera del map */}
          <SuscripcionMP
            clienteId={id}
            clienteNombre={`${cliente.nombre} ${cliente.apellido}`}
            suscripcion={suscripcion}
            onUpdate={load}
          />
        </div>
      )}

      {/* Familia */}
      {tab === "familia" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openModal("familiar")}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus size={16} /> Agregar familiar
            </button>
          </div>
          <div className="card">
            {!cliente.family_members?.length ? (
              <EmptyState
                title="Sin familiares"
                description="Agregá integrantes del grupo familiar"
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Edad</th>
                    <th>Parentesco</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cliente.family_members.map((f: any) => (
                    <tr key={f.id}>
                      <td className="font-medium">
                        {f.apellido}, {f.nombre}
                      </td>
                      <td className="text-gray-500">{f.dni}</td>
                      <td>{f.edad} años</td>
                      <td>{f.parentesco}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteFamiliar(f.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Eliminar"
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
            <button
              onClick={() => openModal("pago")}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Registrar pago
            </button>
          </div>
          <div className="card">
            {!cliente.payments?.length ? (
              <EmptyState
                title="Sin pagos"
                description="Registrá el primer pago para este cliente"
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {cliente.payments.map((p: any) => (
                    <tr key={p.id}>
                      <td>{formatDate(p.fecha)}</td>
                      <td className="font-semibold">
                        {formatCurrency(p.monto)}
                      </td>
                      <td className="capitalize">
                        {p.metodo_pago.replace("_", " ")}
                      </td>
                      <td className="capitalize">{p.tipo_pago}</td>
                      <td>
                        <Badge variant={estadoPagoVariant[p.estado]}>
                          {p.estado}
                        </Badge>
                      </td>
                      <td className="text-gray-500 max-w-xs truncate text-xs">
                        {p.descripcion || "—"}
                      </td>
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
            <button
              onClick={() => openModal("servicio")}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Registrar servicio
            </button>
          </div>
          <div className="card">
            {!cliente.services?.length ? (
              <EmptyState
                title="Sin servicios"
                description="No hay servicios registrados para este cliente"
              />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cliente.services.map((s: any) => (
                    <tr key={s.id}>
                      <td>{formatDate(s.fecha)}</td>
                      <td className="capitalize">
                        {s.tipo.replace(/_/g, " ")}
                      </td>
                      <td>
                        <Badge variant={estadoServicioVariant[s.estado]}>
                          {s.estado.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="text-gray-500 max-w-xs truncate">
                        {s.observaciones || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal open={modals.edit} onClose={closeAll} title="Editar cliente">
        <ClienteForm
          defaultValues={cliente}
          onSubmit={handleEdit}
          onCancel={closeAll}
          submitLabel="Guardar cambios"
        />
      </Modal>
      <Modal open={modals.familiar} onClose={closeAll} title="Agregar familiar">
        <FamiliarForm onSubmit={handleFamiliar} onCancel={closeAll} />
      </Modal>
      <Modal open={modals.pago} onClose={closeAll} title="Registrar pago">
        <PagoForm
          defaultClienteId={id}
          onSubmit={handlePago}
          onCancel={closeAll}
        />
      </Modal>
      <Modal
        open={modals.servicio}
        onClose={closeAll}
        title="Registrar servicio"
      >
        <ServicioForm
          defaultClienteId={id}
          onSubmit={handleServicio}
          onCancel={closeAll}
        />
      </Modal>
    </div>
  );
}
