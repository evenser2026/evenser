"use client";

import { useEffect, useState, useTransition } from "react";
import { getAppConfig, updateAppConfig } from "@/lib/actions/config";
import type { AppConfig } from "@/lib/actions/config";
import {
  Settings,
  DollarSign,
  Building2,
  Phone,
  Mail,
  Clock,
  Save,
} from "lucide-react";
import { FormField } from "@/components/ui";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  useEffect(() => {
    getAppConfig().then(setConfig);
  }, []);

  const handleChange = (key: keyof AppConfig, value: string | number) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const handleSave = () => {
    if (!config) return;
    setError("");
    start(async () => {
      const res = await updateAppConfig({
        monto_con_obra_social: String(config.monto_con_obra_social),
        monto_sin_obra_social: String(config.monto_sin_obra_social),
        checkout_dias: String(config.checkout_dias),
        nombre_empresa: config.nombre_empresa,
        whatsapp_contacto: config.whatsapp_contacto,
        email_contacto: config.email_contacto,
      });
      if (res?.error) {
        setError("Error al guardar");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  if (!config)
    return (
      <div className="p-8 text-center text-gray-400">
        Cargando configuración...
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Settings size={20} /> Configuración
          </h1>
          <p className="text-sm text-gray-500">
            Parámetros generales del sistema
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          ✅ Configuración guardada correctamente
        </div>
      )}
      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Suscripciones MP */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
            <DollarSign size={18} className="text-brand-700" />
            <h2 className="font-semibold text-gray-900">
              Montos de suscripción mensual
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="Monto con obra social (ARS)" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={config.monto_con_obra_social}
                  onChange={(e) =>
                    handleChange(
                      "monto_con_obra_social",
                      Number(e.target.value),
                    )
                  }
                  className="input pl-7"
                  min={0}
                  step={100}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Se aplica automáticamente a clientes que tienen obra social
                registrada
              </p>
            </FormField>

            <FormField label="Monto sin obra social (ARS)" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={config.monto_sin_obra_social}
                  onChange={(e) =>
                    handleChange(
                      "monto_sin_obra_social",
                      Number(e.target.value),
                    )
                  }
                  className="input pl-7"
                  min={0}
                  step={100}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Se aplica automáticamente a clientes sin obra social
              </p>
            </FormField>
          </div>

          {/* Preview */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 mb-1">Con obra social</p>
              <p className="text-xl font-bold text-green-800">
                ${Number(config.monto_con_obra_social).toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-green-500">por mes</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-600 mb-1">Sin obra social</p>
              <p className="text-xl font-bold text-amber-800">
                ${Number(config.monto_sin_obra_social).toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-amber-500">por mes</p>
            </div>
          </div>
        </div>

        {/* Pagos */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
            <Clock size={18} className="text-brand-700" />
            <h2 className="font-semibold text-gray-900">
              Configuración de pagos
            </h2>
          </div>
          <div className="max-w-xs">
            <FormField label="Días de gracia (checkout Mercado Pago)">
              <input
                type="number"
                value={config.checkout_dias}
                onChange={(e) =>
                  handleChange("checkout_dias", Number(e.target.value))
                }
                className="input"
                min={1}
                max={90}
              />
              <p className="text-xs text-gray-400 mt-1">
                Días hasta que un pago pendiente se marca como vencido
              </p>
            </FormField>
          </div>
        </div>

        {/* Empresa */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
            <Building2 size={18} className="text-brand-700" />
            <h2 className="font-semibold text-gray-900">Datos de la empresa</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <FormField label="Nombre de la empresa">
              <input
                value={config.nombre_empresa}
                onChange={(e) => handleChange("nombre_empresa", e.target.value)}
                className="input"
                placeholder="Evenser"
              />
            </FormField>
            <FormField label="WhatsApp de contacto">
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={config.whatsapp_contacto}
                  onChange={(e) =>
                    handleChange("whatsapp_contacto", e.target.value)
                  }
                  className="input pl-8"
                  placeholder="3624000000"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Sin espacios ni +</p>
            </FormField>
            <FormField label="Email de contacto">
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={config.email_contacto}
                  onChange={(e) =>
                    handleChange("email_contacto", e.target.value)
                  }
                  className="input pl-8"
                  placeholder="contacto@evenser.com"
                />
              </div>
            </FormField>
          </div>
        </div>
      </div>

      {/* Botón abajo también */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
