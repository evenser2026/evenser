"use client";
import { useEffect, useState, useTransition, useMemo } from "react";
import {
  getSecciones,
  createSeccion,
  getParcelas,
  generarParcelas,
  updateParcela,
  buscarParcelas,
} from "@/lib/actions/cementerio";
import { getClientes } from "@/lib/actions/clientes";
import { Modal, EmptyState, LoadingSpinner, FormField, Select } from "@/components/ui";
import { Plus, Search, Grid3x3, X } from "lucide-react";
import type { CemeterySection, CemeteryPlot, EstadoParcela, Cliente } from "@/types";

const ESTADOS: { value: EstadoParcela; label: string; cell: string; dot: string }[] = [
  { value: "libre", label: "Libre", cell: "bg-emerald-500 hover:bg-emerald-600", dot: "bg-emerald-500" },
  { value: "ocupado", label: "Ocupado", cell: "bg-rose-500 hover:bg-rose-600", dot: "bg-rose-500" },
  { value: "reservado", label: "Reservado", cell: "bg-amber-500 hover:bg-amber-600", dot: "bg-amber-500" },
  { value: "mantenimiento", label: "Mantenimiento", cell: "bg-gray-400 hover:bg-gray-500", dot: "bg-gray-400" },
];
const estadoInfo = (e: EstadoParcela) => ESTADOS.find((s) => s.value === e)!;

export default function CementerioPage() {
  const [secciones, setSecciones] = useState<CemeterySection[]>([]);
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  const [parcelas, setParcelas] = useState<CemeteryPlot[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<CemeteryPlot[]>([]);
  const [modal, setModal] = useState<"seccion" | "generar" | "parcela" | null>(null);
  const [selected, setSelected] = useState<CemeteryPlot | null>(null);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();
  const [loadingParcelas, setLoadingParcelas] = useState(false);

  useEffect(() => {
    start(async () => {
      const s = await getSecciones();
      setSecciones(s);
      if (s.length && !seccionActiva) setSeccionActiva(s[0].id);
    });
    getClientes().then(setClientes).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!seccionActiva) return;
    setLoadingParcelas(true);
    getParcelas(seccionActiva)
      .then(setParcelas)
      .finally(() => setLoadingParcelas(false));
  }, [seccionActiva]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim().length >= 2) {
        buscarParcelas(query).then(setResultados);
      } else {
        setResultados([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const reloadSecciones = () =>
    start(async () => setSecciones(await getSecciones()));
  const reloadParcelas = () => {
    if (seccionActiva) getParcelas(seccionActiva).then(setParcelas);
  };

  const { cols, rows } = useMemo(() => {
    const cols = parcelas.reduce((m, p) => Math.max(m, p.columna), 0);
    const rows = parcelas.reduce((m, p) => Math.max(m, p.fila), 0);
    return { cols, rows };
  }, [parcelas]);

  const grid = useMemo(() => {
    const map = new Map<string, CemeteryPlot>();
    parcelas.forEach((p) => map.set(`${p.fila}-${p.columna}`, p));
    return map;
  }, [parcelas]);

  const stats = useMemo(() => {
    const total = parcelas.length;
    const porEstado = Object.fromEntries(
      ESTADOS.map((e) => [e.value, parcelas.filter((p) => p.estado === e.value).length]),
    );
    return { total, porEstado };
  }, [parcelas]);

  const seccionActual = secciones.find((s) => s.id === seccionActiva);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cementerio</h1>
          <p className="text-sm text-gray-500">
            {secciones.length} secciones · {stats.total} parcelas en {seccionActual?.nombre ?? "—"}
          </p>
        </div>
        <button onClick={() => setModal("seccion")} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nueva sección
        </button>
      </div>

      {/* buscador */}
      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Buscar por nombre de fallecido o Nº de parcela"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
        {resultados.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
            {resultados.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSeccionActiva(p.seccion_id);
                  setSelected(p);
                  setModal("parcela");
                  setQuery("");
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.numero} — {p.nombre_difunto || "Sin asignar"}</p>
                  <p className="text-xs text-gray-500">Sección {(p as any).seccion?.nombre ?? ""}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${estadoInfo(p.estado).cell.split(" ")[0]}`}>
                  {estadoInfo(p.estado).label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      {isPending && !secciones.length ? (
        <LoadingSpinner />
      ) : !secciones.length ? (
        <EmptyState title="Sin secciones" description="Creá la primera sección para empezar a mapear el cementerio" />
      ) : (
        <>
          {/* tabs de secciones */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {secciones.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeccionActiva(s.id)}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  seccionActiva === s.id
                    ? "bg-brand-700 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s.nombre}
              </button>
            ))}
          </div>

          {/* leyenda */}
          <div className="flex gap-4 mb-4 flex-wrap">
            {ESTADOS.map((e) => (
              <div key={e.value} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className={`w-3 h-3 rounded ${e.dot}`} />
                {e.label}
              </div>
            ))}
          </div>

          {loadingParcelas ? (
            <LoadingSpinner />
          ) : !parcelas.length ? (
            <div className="card p-8 text-center">
              <Grid3x3 size={28} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium mb-1">Esta sección todavía no tiene parcelas</p>
              <p className="text-gray-400 text-sm mb-4">Generá una grilla de filas y columnas para empezar a asignarlas</p>
              <button onClick={() => setModal("generar")} className="btn-primary">
                Generar parcelas
              </button>
            </div>
          ) : (
            <div className="card p-5 overflow-x-auto">
              <div
                className="grid gap-2 w-max"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(56px, 1fr))` }}
              >
                {Array.from({ length: rows }).map((_, ri) =>
                  Array.from({ length: cols }).map((__, ci) => {
                    const p = grid.get(`${ri + 1}-${ci + 1}`);
                    if (!p) return <div key={`${ri}-${ci}`} className="w-14 h-14" />;
                    const info = estadoInfo(p.estado);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelected(p);
                          setModal("parcela");
                        }}
                        title={p.nombre_difunto || p.numero}
                        className={`w-14 h-14 rounded-lg text-white text-[11px] font-semibold flex items-center justify-center transition-colors ${info.cell}`}
                      >
                        {p.numero}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* modal nueva seccion */}
      <Modal open={modal === "seccion"} onClose={() => setModal(null)} title="Nueva sección">
        <SeccionForm
          onSubmit={async (data) => {
            const res = await createSeccion(data);
            if (res?.error) { setError(res.error); return; }
            setModal(null);
            reloadSecciones();
          }}
          onCancel={() => setModal(null)}
        />
      </Modal>

      {/* modal generar parcelas */}
      <Modal open={modal === "generar"} onClose={() => setModal(null)} title={`Generar parcelas — ${seccionActual?.nombre ?? ""}`}>
        {seccionActiva && (
          <GenerarForm
            seccionId={seccionActiva}
            onSubmit={async (data) => {
              const res = await generarParcelas(data);
              if (res?.error) { setError(res.error); return; }
              setModal(null);
              reloadParcelas();
            }}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      {/* modal editar parcela */}
      <Modal open={modal === "parcela"} onClose={() => setModal(null)} title={`Parcela ${selected?.numero ?? ""}`}>
        {selected && (
          <ParcelaForm
            parcela={selected}
            clientes={clientes}
            onSubmit={async (data) => {
              const res = await updateParcela(selected.id, data);
              if (res?.error) { setError(res.error); return; }
              setModal(null);
              reloadParcelas();
            }}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function SeccionForm({ onSubmit, onCancel }: {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", orden: 0 });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false); }} className="space-y-4">
      <FormField label="Nombre" required>
        <input className="input" required value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Sección A" />
      </FormField>
      <FormField label="Descripción (opcional)">
        <textarea className="input" rows={2} value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
      </FormField>
      <FormField label="Orden">
        <input type="number" min={0} className="input" value={form.orden} onChange={(e) => set("orden", parseInt(e.target.value) || 0)} />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  );
}

function GenerarForm({ seccionId, onSubmit, onCancel }: {
  seccionId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ seccion_id: seccionId, filas: 6, columnas: 10, prefijo: "A" });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false); }} className="space-y-4">
      <p className="text-sm text-gray-500">
        Se van a crear {form.filas * form.columnas} parcelas numeradas {form.prefijo}-1 a {form.prefijo}-{form.filas * form.columnas}.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Filas" required>
          <input type="number" min={1} max={50} className="input" value={form.filas} onChange={(e) => set("filas", parseInt(e.target.value) || 1)} />
        </FormField>
        <FormField label="Columnas" required>
          <input type="number" min={1} max={50} className="input" value={form.columnas} onChange={(e) => set("columnas", parseInt(e.target.value) || 1)} />
        </FormField>
        <FormField label="Prefijo" required>
          <input className="input" maxLength={6} value={form.prefijo} onChange={(e) => set("prefijo", e.target.value.toUpperCase())} />
        </FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Generando..." : "Generar"}</button>
      </div>
    </form>
  );
}

function ParcelaForm({ parcela, clientes, onSubmit, onCancel }: {
  parcela: CemeteryPlot;
  clientes: Cliente[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    estado: parcela.estado,
    nombre_difunto: parcela.nombre_difunto ?? "",
    fecha_inhumacion: parcela.fecha_inhumacion ?? "",
    cliente_id: parcela.cliente_id ?? "",
    precio: parcela.precio ?? "",
    observaciones: parcela.observaciones ?? "",
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false); }} className="space-y-4">
      <FormField label="Estado" required>
        <Select value={form.estado} onChange={(e) => set("estado", e.target.value)}>
          {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
        </Select>
      </FormField>
      <FormField label="Nombre del fallecido (opcional)">
        <input className="input" value={form.nombre_difunto} onChange={(e) => set("nombre_difunto", e.target.value)} placeholder="Juan Pérez" />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha de inhumación">
          <input type="date" className="input" value={form.fecha_inhumacion} onChange={(e) => set("fecha_inhumacion", e.target.value)} />
        </FormField>
        <FormField label="Precio (opcional)">
          <input type="number" step="0.01" min="0" className="input" value={form.precio} onChange={(e) => set("precio", e.target.value)} />
        </FormField>
      </div>
      <FormField label="Cliente asociado (opcional)">
        <Select value={form.cliente_id} onChange={(e) => set("cliente_id", e.target.value)}>
          <option value="">Sin asociar</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>)}
        </Select>
      </FormField>
      <FormField label="Observaciones (opcional)">
        <textarea className="input" rows={2} value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} />
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  );
}
