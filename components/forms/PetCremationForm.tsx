"use client";
import { useState } from "react";

type PetCremationInput = {
  duenio_nombre: string;
  duenio_telefono: string;
  duenio_dni?: string;
  mascota_nombre: string;
  especie: string;
  raza?: string;
  peso_kg?: number;
  fecha: string;
  monto: number;
  metodo_pago: "efectivo" | "transferencia" | "mercado_pago";
  estado: "pagado" | "pendiente";
  observaciones?: string;
};

type Props = {
  onSubmit: (data: PetCremationInput) => Promise<void>;
  onCancel: () => void;
};

export default function PetCremationForm({ onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PetCremationInput>({
    duenio_nombre: "",
    duenio_telefono: "",
    duenio_dni: "",
    mascota_nombre: "",
    especie: "perro",
    raza: "",
    peso_kg: undefined,
    fecha: new Date().toISOString().split("T")[0],
    monto: 0,
    metodo_pago: "efectivo",
    estado: "pagado",
    observaciones: "",
  });

  const set = (k: keyof PetCremationInput, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Datos del dueño */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Datos del dueño
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre completo</label>
            <input
              className="input"
              required
              value={form.duenio_nombre}
              onChange={(e) => set("duenio_nombre", e.target.value)}
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input
              className="input"
              required
              value={form.duenio_telefono}
              onChange={(e) => set("duenio_telefono", e.target.value)}
              placeholder="3624000000"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="label">DNI (opcional)</label>
          <input
            className="input"
            value={form.duenio_dni}
            onChange={(e) => set("duenio_dni", e.target.value)}
            placeholder="12345678"
          />
        </div>
      </div>

      {/* Datos de la mascota */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Datos de la mascota
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre</label>
            <input
              className="input"
              required
              value={form.mascota_nombre}
              onChange={(e) => set("mascota_nombre", e.target.value)}
              placeholder="Rex"
            />
          </div>
          <div>
            <label className="label">Especie</label>
            <select
              className="input"
              value={form.especie}
              onChange={(e) => set("especie", e.target.value)}
            >
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="ave">Ave</option>
              <option value="conejo">Conejo</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="label">Raza (opcional)</label>
            <input
              className="input"
              value={form.raza}
              onChange={(e) => set("raza", e.target.value)}
              placeholder="Labrador"
            />
          </div>
          <div>
            <label className="label">Peso en kg (opcional)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="input"
              value={form.peso_kg ?? ""}
              onChange={(e) =>
                set(
                  "peso_kg",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
              placeholder="5.5"
            />
          </div>
        </div>
      </div>

      {/* Pago */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pago
        </p>
        <div className="grid grid-cols-2 gap-4">
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
            <label className="label">Monto</label>
            <input
              type="number"
              className="input"
              required
              min={0}
              step={0.01}
              value={form.monto || ""}
              onChange={(e) => set("monto", parseFloat(e.target.value) || 0)}
              placeholder="15000"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="label">Método de pago</label>
            <select
              className="input"
              value={form.metodo_pago}
              onChange={(e) => set("metodo_pago", e.target.value as any)}
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="mercado_pago">Mercado Pago</option>
            </select>
          </div>
          <div>
            <label className="label">Estado del pago</label>
            <select
              className="input"
              value={form.estado}
              onChange={(e) => set("estado", e.target.value as any)}
            >
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Observaciones (opcional)</label>
        <textarea
          className="input"
          rows={2}
          value={form.observaciones}
          onChange={(e) => set("observaciones", e.target.value)}
          placeholder="Notas adicionales..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando..." : "Registrar cremación"}
        </button>
      </div>
    </form>
  );
}
