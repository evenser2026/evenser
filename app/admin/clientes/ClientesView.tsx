"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCliente, deleteCliente } from "@/lib/actions/clientes";
import { Modal, Badge, EmptyState, ConfirmDialog } from "@/components/ui";
import ClienteForm from "@/components/forms/ClienteForm";
import { localidades } from "@/lib/validations";
import type { Cliente } from "@/types";
import type { ClienteInput } from "@/lib/validations";
import { Plus, Search, Eye, Trash2 } from "lucide-react";

export default function ClientesView({
  initialClientes,
}: {
  initialClientes: Cliente[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Filtrado local sobre los datos del servidor — sin re-fetch
  const filtered = initialClientes.filter((c) => {
    const matchLocalidad = !localidad || c.localidad === localidad;
    const matchSearch =
      !search ||
      `${c.nombre} ${c.apellido} ${c.dni}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchLocalidad && matchSearch;
  });

  const handleCreate = async (data: ClienteInput) => {
    const res = await createCliente(data);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setModal(false);
    setError("");
    // router.refresh() re-fetches server data sin recargar la página completa
    router.refresh();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const res = await deleteCliente(deleteId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setDeleteId(null);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="text-sm text-gray-500">
            {initialClientes.length} clientes activos
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nuevo cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Buscar por nombre o DNI..."
          />
        </div>
        <select
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          className="input sm:w-48"
        >
          <option value="">Todas las localidades</option>
          {localidades.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            title="Sin clientes"
            description={
              search || localidad
                ? "No hay clientes que coincidan con el filtro"
                : "Agregá el primer cliente con el botón superior"
            }
          />
        ) : (
          <div className="table-wrapper rounded-none border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Apellido y nombre</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Localidad</th>
                  <th>Obra social</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-gray-900">
                      {c.apellido}, {c.nombre}
                    </td>
                    <td className="text-gray-500">{c.dni}</td>
                    <td>{c.telefono}</td>
                    <td>
                      <Badge variant="gray">{c.localidad}</Badge>
                    </td>
                    <td className="text-gray-500">{c.obra_social || "—"}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/clientes/${c.id}`}
                          className="text-brand-700 hover:text-brand-900"
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Eliminar cliente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nuevo cliente */}
      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          setError("");
        }}
        title="Nuevo cliente"
      >
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        <ClienteForm
          onSubmit={handleCreate}
          onCancel={() => {
            setModal(false);
            setError("");
          }}
        />
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar cliente"
        message="¿Estás seguro? Se desactivará el cliente. Esta acción no se puede deshacer."
        loading={isPending}
      />
    </div>
  );
}
