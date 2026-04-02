"use client";

import { useState } from "react";
import {
  crearSuscripcionMP,
  cancelarSuscripcion,
} from "@/lib/actions/suscripciones";
import {
  CreditCard,
  ExternalLink,
  XCircle,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SuscripcionMP } from "@/types";

interface Props {
  clienteId: string;
  clienteNombre: string;
  tieneObraSocial: boolean; // nuevo: viene del cliente
  suscripcion: SuscripcionMP | null;
  montoConObraSocial: number; // viene de app_config
  montoSinObraSocial: number; // viene de app_config
  onUpdate: () => void;
}

const estadoConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pendiente: {
    label: "Pendiente de pago",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    icon: <Clock size={14} />,
  },
  activa: {
    label: "Activa",
    color: "text-green-700 bg-green-50 border-green-200",
    icon: <CheckCircle size={14} />,
  },
  pausada: {
    label: "Pausada",
    color: "text-gray-600 bg-gray-50 border-gray-200",
    icon: <Clock size={14} />,
  },
  cancelada: {
    label: "Cancelada",
    color: "text-red-700 bg-red-50 border-red-200",
    icon: <XCircle size={14} />,
  },
};

export default function SuscripcionMP({
  clienteId,
  clienteNombre,
  tieneObraSocial,
  suscripcion,
  montoConObraSocial,
  montoSinObraSocial,
  onUpdate,
}: Props) {
  // Monto sugerido automáticamente según obra social
  const montoSugerido = tieneObraSocial
    ? montoConObraSocial
    : montoSinObraSocial;

  const [loading, setLoading] = useState(false);
  const [monto, setMonto] = useState(montoSugerido);
  const [error, setError] = useState("");
  const [linkGenerado, setLinkGenerado] = useState<string | null>(null);

  const handleCrear = async () => {
    setLoading(true);
    setError("");
    const res = await crearSuscripcionMP(clienteId, monto);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    if (res?.init_point) {
      setLinkGenerado(res.init_point);
      onUpdate();
    }
  };

  const handleCancelar = async () => {
    if (!suscripcion) return;
    if (!window.confirm("¿Cancelar la suscripción de este cliente?")) return;
    setLoading(true);
    await cancelarSuscripcion(suscripcion.mp_preapproval_id, clienteId);
    setLoading(false);
    onUpdate();
  };

  const handleCopiarLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copiado al portapapeles");
  };

  const estado = suscripcion ? estadoConfig[suscripcion.estado] : null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={18} className="text-brand-700" />
        <h3 className="font-semibold text-gray-900 text-sm">
          Suscripción mensual MP
        </h3>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {/* Sin suscripción activa */}
      {!suscripcion && !linkGenerado && (
        <div className="space-y-3">
          {/* Aviso automático de obra social */}
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
            <Info size={13} className="mt-0.5 shrink-0 text-brand-600" />
            <span>
              Monto sugerido automáticamente:{" "}
              <strong className="text-gray-700">
                {formatCurrency(montoSugerido)}/mes
              </strong>{" "}
              — cliente{" "}
              {tieneObraSocial ? (
                <span className="text-green-700 font-medium">
                  con obra social
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  sin obra social
                </span>
              )}
            </span>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
              Monto mensual (ARS)
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="input w-40 text-sm"
              min={100}
              step={100}
            />
          </div>

          <button
            onClick={handleCrear}
            disabled={loading}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <CreditCard size={15} />
            {loading ? "Generando link..." : "Generar link de suscripción"}
          </button>
        </div>
      )}

      {/* Link recién generado */}
      {linkGenerado && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 mb-1">
              ✅ Link generado para {clienteNombre}
            </p>
            <p className="text-xs text-green-600 mb-3">
              Enviá este link al cliente para que complete el primer pago. Los
              cobros siguientes son automáticos cada mes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopiarLink(linkGenerado)}
                className="btn-secondary text-xs"
              >
                Copiar link
              </button>
              <a
                href={linkGenerado}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs flex items-center gap-1"
              >
                Abrir link <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Suscripción existente */}
      {suscripcion && !linkGenerado && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${estado?.color}`}
            >
              {estado?.icon}
              {estado?.label}
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(suscripcion.monto)}/mes
            </span>
          </div>

          {suscripcion.ultimo_pago && (
            <p className="text-xs text-gray-400">
              Último pago: {formatDate(suscripcion.ultimo_pago)}
            </p>
          )}

          <div className="flex gap-2 pt-1 flex-wrap">
            {suscripcion.estado === "pendiente" && (
              <button
                onClick={() => handleCopiarLink(suscripcion.init_point)}
                className="btn-secondary text-xs flex items-center gap-1"
              >
                <ExternalLink size={12} /> Copiar link de pago
              </button>
            )}

            {["activa", "pausada", "pendiente"].includes(
              suscripcion.estado,
            ) && (
              <button
                onClick={handleCancelar}
                disabled={loading}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <XCircle size={12} />
                {loading ? "Cancelando..." : "Cancelar suscripción"}
              </button>
            )}

            {suscripcion.estado === "cancelada" && (
              <button
                onClick={handleCrear}
                disabled={loading}
                className="btn-primary text-xs"
              >
                {loading ? "Generando..." : "Nueva suscripción"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
