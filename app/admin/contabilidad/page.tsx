"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getAccountingSummary,
  createAccountingEntry,
  deleteAccountingEntry,
  getAccountingAnual,
} from "@/lib/actions/contabilidad";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import AccountingForm from "@/components/forms/AccountingForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import type { AccountingEntry } from "@/types";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

type Vista = "mensual" | "anual";

export default function ContabilidadPage() {
  const now = new Date();
  const [vista, setVista] = useState<Vista>("mensual");
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());
  const [summary, setSummary] = useState<{
    ingresos: number; egresos: number; balance: number; entries: AccountingEntry[];
  } | null>(null);
  const [anual, setAnual] = useState<{
    meses: { mes: number; ingresos: number; egresos: number; balance: number }[];
    totalIngresos: number; totalEgresos: number; totalBalance: number;
  } | null>(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const load = () => start(async () => {
    if (vista === "mensual") {
      const s = await getAccountingSummary(mes, anio);
      setSummary(s as any);
    } else {
      const a = await getAccountingAnual(anio);
      setAnual(a as any);
    }
  });

  useEffect(() => { load(); }, [mes, anio, vista]);

  const entries = summary?.entries ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contabilidad</h1>
          <p className="text-sm text-gray-500">Ingresos y egresos del sistema</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {/* Tabs vista */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setVista("mensual")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${vista === "mensual" ? "bg-brand-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setVista("anual")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${vista === "anual" ? "bg-brand-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Anual
            </button>
          </div>

          {vista === "mensual" && (
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="input py-1.5 text-sm w-36">
              {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          )}
          <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="input py-1.5 text-sm w-24">
            {[now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {vista === "mensual" && (
            <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Registrar
            </button>
          )}
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      {isPending && <div className="py-8"><LoadingSpinner /></div>}

      {/* ── VISTA MENSUAL ── */}
      {!isPending && vista === "mensual" && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Ingresos</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(summary?.ingresos ?? 0)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Egresos</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(summary?.egresos ?? 0)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${(summary?.balance ?? 0) >= 0 ? "text-brand-700" : "text-red-600"}`}>
                {formatCurrency(summary?.balance ?? 0)}
              </p>
            </div>
          </div>

          <div className="card">
            {!entries.length ? (
              <EmptyState title="Sin movimientos" description={`No hay registros en ${MESES[mes - 1]} ${anio}`} />
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
                      <td className="font-medium capitalize">{e.categoria.replace(/_/g, " ")}</td>
                      <td className="text-gray-500 text-sm">{e.descripcion || "—"}</td>
                      <td className={`font-semibold ${e.tipo === "ingreso" ? "text-green-700" : "text-red-600"}`}>
                        {e.tipo === "ingreso" ? "+" : "-"}{formatCurrency(e.monto)}
                      </td>
                      <td>
                        <button
                          onClick={async () => {
                            if (!window.confirm("¿Eliminar este movimiento?")) return;
                            const res = await deleteAccountingEntry(e.id);
                            if (res?.error) setError(res.error); else load();
                          }}
                          className="text-xs text-red-400 hover:text-red-600"
                        >×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── VISTA ANUAL ── */}
      {!isPending && vista === "anual" && anual && (
        <>
          {/* Totales del año */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total ingresos {anio}</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(anual.totalIngresos)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total egresos {anio}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(anual.totalEgresos)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Balance anual</p>
              <p className={`text-2xl font-bold mt-1 ${anual.totalBalance >= 0 ? "text-brand-700" : "text-red-600"}`}>
                {formatCurrency(anual.totalBalance)}
              </p>
            </div>
          </div>

          {/* Tabla por mes */}
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Ingresos</th>
                  <th>Egresos</th>
                  <th>Balance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {anual.meses.map((m) => {
                  const esMesActual = m.mes === now.getMonth() + 1 && anio === now.getFullYear();
                  return (
                    <tr key={m.mes} className={esMesActual ? "bg-brand-50" : ""}>
                      <td className="font-medium">
                        {MESES[m.mes - 1]}
                        {esMesActual && <span className="ml-2 text-xs text-brand-600 font-normal">actual</span>}
                      </td>
                      <td className="text-green-700 font-medium">
                        {m.ingresos > 0 ? formatCurrency(m.ingresos) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="text-red-600 font-medium">
                        {m.egresos > 0 ? formatCurrency(m.egresos) : <span className="text-gray-300">—</span>}
                      </td>
                      <td>
                        <span className={`font-semibold flex items-center gap-1 ${m.balance >= 0 ? "text-brand-700" : "text-red-600"}`}>
                          {m.balance >= 0
                            ? <TrendingUp size={14} />
                            : <TrendingDown size={14} />}
                          {formatCurrency(Math.abs(m.balance))}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => { setVista("mensual"); setMes(m.mes); }}
                          className="text-xs text-brand-600 hover:text-brand-800"
                        >
                          Ver detalle →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-gray-200">
                <tr className="font-bold">
                  <td>Total {anio}</td>
                  <td className="text-green-700">{formatCurrency(anual.totalIngresos)}</td>
                  <td className="text-red-600">{formatCurrency(anual.totalEgresos)}</td>
                  <td className={anual.totalBalance >= 0 ? "text-brand-700" : "text-red-600"}>
                    {formatCurrency(anual.totalBalance)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      <Modal open={modal} onClose={() => { setModal(false); setError(""); }} title="Registrar movimiento">
        <AccountingForm
          onSubmit={async (data) => {
            const res = await createAccountingEntry(data);
            if (res?.error) { setError(res.error); return; }
            setModal(false);
            load();
          }}
          onCancel={() => setModal(false)}
        />
      </Modal>
    </div>
  );
}
