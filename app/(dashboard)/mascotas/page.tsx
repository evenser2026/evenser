"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getPetCremations,
  createPetCremation,
  deletePetCremation,
} from "@/lib/actions/mascotas";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import PetCremationForm from "@/components/forms/PetCremationForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type { PetCremation } from "@/types";

const pagoVariant: Record<string, "green" | "amber" | "red"> = {
  pagado: "green",
  pendiente: "amber",
  vencido: "red",
};

export default function MascotasPage() {
  const [records, setRecords] = useState<PetCremation[]>([]);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () =>
    start(async () => setRecords((await getPetCremations()) as PetCremation[]));
  useEffect(() => {
    load();
  }, []);

  if (isPending && !records.length)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );

  const totalMes = records
    .filter((r) => {
      const d = new Date(r.fecha);
      const n = new Date();
      return (
        d.getMonth() === n.getMonth() &&
        d.getFullYear() === n.getFullYear() &&
        r.estado_pago === "pagado"
      );
    })
    .reduce((s, r) => s + r.monto, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cremación de mascotas</h1>
          <p className="text-sm text-gray-500">
            Servicios del mes: {formatCurrency(totalMes)}
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nueva cremación
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="card">
        {!records.length ? (
          <EmptyState
            title="Sin cremaciones"
            description="Registrá el primer servicio"
          />
        ) : (
          <>
            {/* Tabla escritorio */}
            <div className="hidden sm:block">
              <table className="table">
                <thead>
                  <tr>
                    <th>Dueño</th>
                    <th>Mascota</th>
                    <th>Especie / Raza</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Pago</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <p className="font-medium">{r.duenio_nombre}</p>
                        <p className="text-xs text-gray-400">
                          {r.duenio_telefono}
                        </p>
                      </td>
                      <td className="font-medium">{r.mascota_nombre}</td>
                      <td className="text-gray-500 capitalize">
                        {r.mascota_especie}
                        {r.mascota_raza ? ` / ${r.mascota_raza}` : ""}
                      </td>
                      <td className="text-gray-500">{formatDate(r.fecha)}</td>
                      <td className="font-semibold">
                        {formatCurrency(r.monto)}
                      </td>
                      <td className="capitalize text-gray-500">
                        {r.metodo_pago.replace("_", " ")}
                      </td>
                      <td>
                        <Badge variant={pagoVariant[r.estado_pago]}>
                          {r.estado_pago}
                        </Badge>
                      </td>
                      <td>
                        <button
                          onClick={async () => {
                            if (!window.confirm("¿Eliminar este registro?"))
                              return;
                            const res = await deletePetCremation(r.id);
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
            </div>
            {/* Cards mobile */}
            <div className="sm:hidden divide-y divide-gray-100">
              {records.map((r) => (
                <div key={r.id} className="p-4 flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">
                      {r.mascota_nombre}{" "}
                      <span className="text-gray-400 capitalize">
                        ({r.mascota_especie})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {r.duenio_nombre} · {formatDate(r.fecha)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatCurrency(r.monto)}
                    </p>
                    <Badge variant={pagoVariant[r.estado_pago]}>
                      {r.estado_pago}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          setError("");
        }}
        title="Nueva cremación de mascota"
      >
        <PetCremationForm
          onSubmit={async (data) => {
            const res = await createPetCremation(data);
            if (res?.error) {
              setError(res.error);
              return;
            }
            setModal(false);
            load();
          }}
          onCancel={() => setModal(false)}
        />
      </Modal>
    </div>
  );
}
