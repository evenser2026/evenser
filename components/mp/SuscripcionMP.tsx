"use client";

import {
  cancelarSuscripcion,
  pausarSuscripcion,
  reactivarSuscripcion,
} from "@/lib/actions/suscripciones";
import {
  CreditCard,
  XCircle,
  CheckCircle,
  Clock,
  PauseCircle,
  PlayCircle,
  Copy,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SuscripcionMP } from "@/types";
import { useState } from "react";

interface Props {
  clienteId: string;
  clienteNombre: string;
  tieneObraSocial: boolean;
  suscripcion: SuscripcionMP | null;
  montoConObraSocial: number;
  montoSinObraSocial: number;
  onUpdate: () => void;
}

const estadoConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
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

const APP_URL = "https://evenser.vercel.app";

export default function SuscripcionMP({
  clienteId,
  suscripcion,
  onUpdate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(APP_URL);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handlePausar = async () => {
    if (!suscripcion || !confirm("¿Pausar la suscripción?")) return;
    setLoading(true);
    await pausarSuscripcion(suscripcion.mp_preapproval_id, clienteId);
    setLoading(false);
    onUpdate();
  };

  const handleReactivar = async () => {
    if (!suscripcion || !confirm("¿Reactivar la suscripción?")) return;
    setLoading(true);
    await reactivarSuscripcion(suscripcion.mp_preapproval_id, clienteId);
    setLoading(false);
    onUpdate();
  };

  const handleCancelar = async () => {
    if (!suscripcion || !confirm("¿Cancelar la suscripción? No se puede deshacer.")) return;
    setLoading(true);
    await cancelarSuscripcion(suscripcion.mp_preapproval_id, clienteId);
    setLoading(false);
    onUpdate();
  };

  const estado = suscripcion ? estadoConfig[suscripcion.estado] : null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={18} className="text-brand-700" />
        <h3 className="font-semibold text-gray-900 text-sm">Suscripción mensual MP</h3>
      </div>

      {/* Sin suscripción */}
      {!suscripcion && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Este cliente no tiene suscripción activa. Enviále el link de la web para que se afilie.
          </p>
          <button
            onClick={handleCopiarLink}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Copy size={14} />
            {copiado ? "¡Link copiado!" : "Copiar link de afiliación"}
          </button>
          <p className="text-xs text-gray-400">{APP_URL}</p>
        </div>
      )}

      {/* Suscripción existente */}
      {suscripcion && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${estado?.color}`}>
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
            {suscripcion.estado === "activa" && (
              <button
                onClick={handlePausar}
                disabled={loading}
                className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                <PauseCircle size={12} />
                {loading ? "Pausando..." : "Pausar"}
              </button>
            )}

            {suscripcion.estado === "pausada" && (
              <button
                onClick={handleReactivar}
                disabled={loading}
                className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                <PlayCircle size={12} />
                {loading ? "Reactivando..." : "Reactivar"}
              </button>
            )}

            {["activa", "pausada", "pendiente"].includes(suscripcion.estado) && (
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
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Suscripción cancelada. Para reactivar, el cliente debe afiliarse nuevamente desde la web.
                </p>
                <button
                  onClick={handleCopiarLink}
                  className="btn-secondary flex items-center gap-2 text-xs"
                >
                  <Copy size={12} />
                  {copiado ? "¡Link copiado!" : "Copiar link de afiliación"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
