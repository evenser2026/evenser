"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getDeceasedRecords,
  createDeceased,
  updateDeceasedEstado,
} from "@/lib/actions/fallecidos";
import { getConvenios } from "@/lib/actions/convenios";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import FallecidoForm from "@/components/forms/FallecidoForm";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { DeceasedRecord, Convenio } from "@/types";

const estadoVariant: Record<string, "blue" | "green" | "red"> = {
  en_proceso: "blue",
  completado: "green",
  cancelado: "red",
};

export default function FallecidosPage() {
  const [records, setRecords] = useState<DeceasedRecord[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () =>
    start(async () => {
      const [r, c] = await Promise.all([getDeceasedRecords(), getConvenios()]);
      setRecords(r as DeceasedRecord[]);
      setConvenios(c as Convenio[]);
    });

  useEffect(() => {
    load();
  }, []);

  if (isPending && !records.length)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fallecidos</h1>
          <p className="text-sm text-gray-500">
            Registro de servicios funerarios
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nuevo registro
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
            title="Sin registros"
            description="Registrá el primer fallecimiento"
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Fallecido</th>
                <th>Fecha</th>
                <th>Afiliado</th>
                <th>Convenio</th>
                <th>Servicios</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const servicios = [
                  r.cubre_traslado && "Traslado",
                  r.cubre_capilla && "Capilla",
                  r.cubre_sala && "Sala",
                  r.cubre_tramite && "Trámite",
                  r.cubre_cremacion && "Cremación",
                  r.cubre_serv_calle && "Serv. calle",
                ].filter(Boolean);
                return (
                  <tr key={r.id}>
                    <td className="font-medium">
                      {r.apellido_fallecido}, {r.nombre_fallecido}
                    </td>
                    <td className="text-gray-500">
                      {formatDate(r.fecha_fallecimiento)}
                    </td>
                    <td className="text-gray-500">
                      {r.cliente
                        ? `${r.cliente.apellido}, ${r.cliente.nombre}`
                        : "—"}
                    </td>
                    <td className="text-gray-500">
                      {(r as any).convenio?.nombre ?? "—"}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {servicios.length ? (
                          servicios.map((s) => (
                            <span
                              key={s as string}
                              className="text-xs bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">Ninguno</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge variant={estadoVariant[r.estado]}>
                        {r.estado.replace("_", " ")}
                      </Badge>
                    </td>
                    <td>
                      {r.estado === "en_proceso" && (
                        <button
                          onClick={async () => {
                            const res = await updateDeceasedEstado(
                              r.id,
                              "completado",
                            );
                            if (res?.error) setError(res.error);
                            else load();
                          }}
                          className="text-xs text-green-600 hover:text-green-800 font-medium"
                        >
                          Completar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          setError("");
        }}
        title="Registrar fallecimiento"
      >
        <FallecidoForm
          convenios={convenios}
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
