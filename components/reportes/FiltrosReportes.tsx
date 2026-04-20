"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const LOCALIDADES = [
  "Col. Elisa",
  "La Escondida",
  "Tirol",
  "La Verde",
  "Colonias Unidas",
  "Las Garcitas",
];

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

export default function FiltrosReportes() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const set = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  const limpiar = () => router.push(pathname);

  const mesActual = String(new Date().getMonth() + 1);
  const anioActual = String(new Date().getFullYear());

  const mes = params.get("mes") || mesActual;
  const anio = params.get("anio") || anioActual;
  const localidad = params.get("localidad") || "";

  const anios = Array.from({ length: 3 }, (_, i) =>
    String(new Date().getFullYear() - i),
  );

  const hayFiltros =
    params.has("mes") || params.has("anio") || params.has("localidad");

  return (
    <div className="card p-4 mb-6 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 uppercase tracking-wider">
          Mes
        </label>
        <select
          value={mes}
          onChange={(e) => set("mes", e.target.value)}
          className="input py-1.5 text-sm"
        >
          {MESES.map((m, i) => (
            <option key={i} value={String(i + 1)}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 uppercase tracking-wider">
          Año
        </label>
        <select
          value={anio}
          onChange={(e) => set("anio", e.target.value)}
          className="input py-1.5 text-sm"
        >
          {anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 uppercase tracking-wider">
          Localidad
        </label>
        <select
          value={localidad}
          onChange={(e) => set("localidad", e.target.value)}
          className="input py-1.5 text-sm"
        >
          <option value="">Todas</option>
          {LOCALIDADES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {hayFiltros && (
        <button
          onClick={limpiar}
          className="text-sm text-gray-400 hover:text-gray-700 underline self-end pb-1.5"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
