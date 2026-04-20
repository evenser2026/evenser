"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getAccountingSummary,
  createAccountingEntry,
  deleteAccountingEntry,
  cerrarMesContable,
} from "@/lib/actions/contabilidad";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import AccountingForm from "@/components/forms/AccountingForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Lock } from "lucide-react";
import type { AccountingEntry } from "@/types";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function ContabilidadPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());
  const [summary, setSummary] = useState<{
    ingresos: number;
    egresos: number;
    balance: number;
    entries: AccountingEntry[];
  } | null>(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () =>
    start(async () => {
      const s = await getAccountingSummary(mes, anio);
      setSummary(s as any);
    });

  useEffect(() => {
    load();
  }, [mes, anio]);

  if (isPending && !summary)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );

  const entries = summary?.entries ?? [];
  const mesCerrado = entries.length > 0 && entries.every((e) => e.cerrado);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contabilidad</h1>
          <p className="text-sm text-gray-500">
            Ingresos y egresos del sistema
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="input py-1.5 text-sm w-36"
          >
            {MESES.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="input py-1.5 text-sm w-24"
          >
            {[
              now.getFullYear() - 1,
              now.getFullYear(),
              now.getFullYear() + 1,
            ].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button
            onClick={() => setModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Registrar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Ingresos
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {formatCurrency(summary?.ingresos ?? 0)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Egresos
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {formatCurrency(summary?.egresos ?? 0)}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Balance
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${(summary?.balance ?? 0) >= 0 ? "text-brand-700" : "text-red-600"}`}
          >
            {formatCurrency(summary?.balance ?? 0)}
          </p>
        </div>
      </div>

      {/* Cierre mensual */}
      {entries.length > 0 && !mesCerrado && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={async () => {
              if (
                !window.confirm(
                  `¿Cerrar el mes de ${MESES[mes - 1]} ${anio}? No se podrán modificar los registros.`,
                )
              )
                return;
              const res = await cerrarMesContable(mes, anio);
              if (res?.error) setError(res.error);
              else load();
            }}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Lock size={14} /> Cerrar mes
          </button>
        </div>
      )}
      {mesCerrado && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Lock size={14} /> Mes cerrado — solo lectura
        </div>
      )}

      <div className="card">
        {!entries.length ? (
          <EmptyState
            title="Sin movimientos"
            description={`No hay registros en ${MESES[mes - 1]} ${anio}`}
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="text-gray-500">{formatDate(e.fecha)}</td>
                  <td>
                    <Badge variant={e.tipo === "ingreso" ? "green" : "red"}>
                      {e.tipo === "ingreso" ? "↑ Ingreso" : "↓ Egreso"}
                    </Badge>
                  </td>
                  <td className="font-medium">{e.categoria}</td>
                  <td className="text-gray-500 text-sm">
                    {e.descripcion || "—"}
                  </td>
                  <td
                    className={`font-semibold ${e.tipo === "ingreso" ? "text-green-700" : "text-red-600"}`}
                  >
                    {e.tipo === "ingreso" ? "+" : "-"}
                    {formatCurrency(e.monto)}
                  </td>
                  <td>
                    {!e.cerrado && (
                      <button
                        onClick={async () => {
                          if (!window.confirm("¿Eliminar este movimiento?"))
                            return;
                          const res = await deleteAccountingEntry(e.id);
                          if (res?.error) setError(res.error);
                          else load();
                        }}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
        title="Registrar movimiento"
      >
        <AccountingForm
          onSubmit={async (data) => {
            const res = await createAccountingEntry(data);
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
