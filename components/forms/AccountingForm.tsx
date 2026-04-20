"use client";
import { useState } from "react";

const CATEGORIAS_INGRESO = [
  "Cuota mensual",
  "Pago único",
  "Convenio",
  "Servicio funerario",
  "Cremación mascota",
  "Otro ingreso",
];
const CATEGORIAS_EGRESO = [
  "Sueldos",
  "Servicios (luz, agua, gas)",
  "Alquiler",
  "Mantenimiento",
  "Publicidad",
  "Otro egreso",
];

type AccountingEntryInput = {
  tipo: "ingreso" | "egreso";
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
};

type Props = {
  onSubmit: (data: AccountingEntryInput) => Promise<void>;
  onCancel: () => void;
};

export default function AccountingForm({ onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AccountingEntryInput>({
    tipo: "ingreso",
    categoria: "",
    descripcion: "",
    monto: 0,
    fecha: new Date().toISOString().split("T")[0],
  });

  const set = (k: keyof AccountingEntryInput, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const categorias =
    form.tipo === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Tipo</label>
        <div className="flex gap-3">
          {(["ingreso", "egreso"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("tipo", t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                form.tipo === t
                  ? t === "ingreso"
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-red-50 border-red-300 text-red-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t === "ingreso" ? "↑ Ingreso" : "↓ Egreso"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Categoría</label>
        <select
          className="input"
          required
          value={form.categoria}
          onChange={(e) => set("categoria", e.target.value)}
        >
          <option value="">— Seleccioná una categoría —</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Monto</label>
        <input
          type="number"
          className="input"
          required
          min={0}
          step={0.01}
          value={form.monto || ""}
          onChange={(e) => set("monto", parseFloat(e.target.value) || 0)}
        />
      </div>

      <div>
        <label className="label">Fecha</label>
        <input
          type="date"
          className="input"
          required
          value={form.fecha}
          onChange={(e) => set("fecha", e.target.value)}
        />
      </div>

      <div>
        <label className="label">Descripción (opcional)</label>
        <input
          type="text"
          className="input"
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Detalle del movimiento..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando..." : "Registrar movimiento"}
        </button>
      </div>
    </form>
  );
}
