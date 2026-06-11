"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getSupplies, createSupply, updateSupply, deleteSupply, registerMovement,
} from "@/lib/actions/insumos";
import { Modal, Badge, EmptyState, LoadingSpinner } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import type { Supply } from "@/types";

const CATEGORIAS = ["ataud","urna","flores","velas","ropa","higiene","papeleria","ferreteria","otro"];

const catLabel: Record<string, string> = {
  ataud:"Ataúd", urna:"Urna", flores:"Flores", velas:"Velas",
  ropa:"Ropa", higiene:"Higiene", papeleria:"Papelería",
  ferreteria:"Ferretería", otro:"Otro",
};

export default function InsumosPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [modal, setModal] = useState<"create"|"edit"|"movement"|null>(null);
  const [selected, setSelected] = useState<Supply | null>(null);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [isPending, start] = useTransition();

  const load = () => start(async () => setSupplies(await getSupplies()));
  useEffect(() => { load(); }, []);

  const filtered = supplies.filter(s =>
    !filtro || s.categoria === filtro
  );
  const alertas = supplies.filter(s => s.stock_actual <= s.stock_minimo);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Insumos</h1>
          <p className="text-sm text-gray-500">{supplies.length} productos · {alertas.length} con stock bajo</p>
        </div>
        <button onClick={() => { setSelected(null); setModal("create"); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo insumo
        </button>
      </div>

      {/* Alertas stock bajo */}
      {alertas.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Stock bajo ({alertas.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertas.map(s => (
              <span key={s.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">
                {s.nombre} — {s.stock_actual}/{s.stock_minimo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFiltro("")} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${!filtro ? "bg-brand-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          Todos
        </button>
        {CATEGORIAS.map(c => (
          <button key={c} onClick={() => setFiltro(c)} className={`text-sm px-3 py-1.5 rounded-lg transition-colors capitalize ${filtro === c ? "bg-brand-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {catLabel[c]}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      {isPending && !supplies.length ? <LoadingSpinner /> :
       !filtered.length ? <EmptyState title="Sin insumos" description="Agregá el primer insumo para llevar el control de stock" /> : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Mín.</th>
                <th>Precio</th>
                <th>Proveedor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="font-medium">{s.nombre}</td>
                  <td className="text-gray-500 capitalize">{catLabel[s.categoria]}</td>
                  <td>
                    <span className={`font-semibold ${s.stock_actual <= s.stock_minimo ? "text-amber-600" : "text-gray-900"}`}>
                      {s.stock_actual}
                      {s.stock_actual <= s.stock_minimo && <AlertTriangle size={12} className="inline ml-1 text-amber-500" />}
                    </span>
                  </td>
                  <td className="text-gray-400">{s.stock_minimo}</td>
                  <td className="text-gray-500">{s.precio_unitario ? formatCurrency(s.precio_unitario) : "—"}</td>
                  <td className="text-gray-500 max-w-xs truncate">{s.proveedor || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelected(s); setModal("movement"); }} className="text-gray-400 hover:text-brand-700" title="Registrar movimiento">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => { setSelected(s); setModal("edit"); }} className="text-gray-400 hover:text-brand-700">
                        <Pencil size={14} />
                      </button>
                      <button onClick={async () => {
                        if (!confirm("¿Eliminar este insumo?")) return;
                        const res = await deleteSupply(s.id);
                        if (res?.error) setError(res.error); else load();
                      }} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal
        open={modal === "create" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "edit" ? "Editar insumo" : "Nuevo insumo"}
      >
        <SupplyForm
          defaultValues={modal === "edit" ? selected ?? undefined : undefined}
          onSubmit={async (data) => {
            const res = modal === "edit" && selected
              ? await updateSupply(selected.id, data)
              : await createSupply(data);
            if (res?.error) { setError(res.error); return; }
            setModal(null); load();
          }}
          onCancel={() => setModal(null)}
        />
      </Modal>

      {/* Modal movimiento */}
      <Modal
        open={modal === "movement"}
        onClose={() => setModal(null)}
        title={`Movimiento — ${selected?.nombre}`}
      >
        {selected && (
          <MovementForm
            supplyId={selected.id}
            stockActual={selected.stock_actual}
            onSubmit={async (data) => {
              const res = await registerMovement(data);
              if (res?.error) { setError(res.error); return; }
              setModal(null); load();
            }}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function SupplyForm({ defaultValues, onSubmit, onCancel }: {
  defaultValues?: Partial<Supply>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: defaultValues?.nombre ?? "",
    categoria: defaultValues?.categoria ?? "otro",
    descripcion: defaultValues?.descripcion ?? "",
    stock_minimo: defaultValues?.stock_minimo ?? 1,
    precio_unitario: defaultValues?.precio_unitario ?? "",
    proveedor: defaultValues?.proveedor ?? "",
  });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={async e => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Nombre</label>
          <input className="input" required value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ataúd modelo básico" />
        </div>
        <div>
          <label className="label">Categoría</label>
          <select className="input" value={form.categoria} onChange={e => set("categoria", e.target.value)}>
            {CATEGORIAS.map(c => <option key={c} value={c}>{catLabel[c]}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Stock mínimo</label>
          <input type="number" className="input" min={0} value={form.stock_minimo} onChange={e => set("stock_minimo", parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="label">Precio unitario (opcional)</label>
          <input type="number" step="0.01" min="0" className="input" value={form.precio_unitario} onChange={e => set("precio_unitario", e.target.value)} placeholder="15000" />
        </div>
        <div>
          <label className="label">Proveedor (opcional)</label>
          <input className="input" value={form.proveedor} onChange={e => set("proveedor", e.target.value)} placeholder="Proveedor SA" />
        </div>
        <div className="col-span-2">
          <label className="label">Descripción (opcional)</label>
          <textarea className="input" rows={2} value={form.descripcion} onChange={e => set("descripcion", e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  );
}

function MovementForm({ supplyId, stockActual, onSubmit, onCancel }: {
  supplyId: string;
  stockActual: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ supply_id: supplyId, tipo: "entrada" as "entrada"|"salida", cantidad: 1, motivo: "" });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={async e => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false); }} className="space-y-4">
      <p className="text-sm text-gray-500">Stock actual: <span className="font-semibold text-gray-900">{stockActual}</span></p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Tipo</label>
          <select className="input" value={form.tipo} onChange={e => set("tipo", e.target.value)}>
            <option value="entrada">Entrada ↑</option>
            <option value="salida">Salida ↓</option>
          </select>
        </div>
        <div>
          <label className="label">Cantidad</label>
          <input type="number" min={1} className="input" value={form.cantidad} onChange={e => set("cantidad", parseInt(e.target.value) || 1)} />
        </div>
        <div className="col-span-2">
          <label className="label">Motivo (opcional)</label>
          <input className="input" value={form.motivo} onChange={e => set("motivo", e.target.value)} placeholder="Compra a proveedor / Servicio #123" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Registrando..." : "Registrar"}</button>
      </div>
    </form>
  );
}
