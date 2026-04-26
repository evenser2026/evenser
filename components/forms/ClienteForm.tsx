"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clienteSchema,
  type ClienteInput,
} from "@/lib/validations";
import { FormField } from "@/components/ui";
import type { Cliente } from "@/types";

const DEFAULT_LOCALIDADES = [
  "Col. Elisa",
  "La Escondida",
  "Tirol",
  "La Verde",
  "Colonias Unidas",
  "Las Garcitas",
  "Otra",
] as const;

interface Props {
  defaultValues?: Partial<Cliente>;
  onSubmit: (data: ClienteInput) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  localidades?: string[];
}

export default function ClienteForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading: externalLoading,
  submitLabel = "Guardar cliente",
  localidades: localidadesProp,
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const localidades = localidadesProp ?? DEFAULT_LOCALIDADES;
  const isLoading = externalLoading ?? internalLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      apellido: defaultValues?.apellido ?? "",
      dni: defaultValues?.dni ?? "",
      telefono: defaultValues?.telefono ?? "",
      ocupacion: defaultValues?.ocupacion ?? "",
      obra_social: defaultValues?.obra_social ?? "",
      localidad: defaultValues?.localidad ?? ("" as any),
      carpeta_nacimiento: defaultValues?.carpeta_nacimiento ?? "",
    },
  });

  const handleFormSubmit = async (data: ClienteInput) => {
    setInternalLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.nombre?.message} required>
          <input {...register("nombre")} className="input" placeholder="Juan" />
        </FormField>
        <FormField label="Apellido" error={errors.apellido?.message} required>
          <input
            {...register("apellido")}
            className="input"
            placeholder="Pérez"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="DNI" error={errors.dni?.message} required>
          <input
            {...register("dni")}
            className="input"
            placeholder="28000000"
          />
        </FormField>
        <FormField label="Teléfono" error={errors.telefono?.message} required>
          <input
            {...register("telefono")}
            className="input"
            placeholder="3624000000"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ocupación" error={errors.ocupacion?.message}>
          <input
            {...register("ocupacion")}
            className="input"
            placeholder="Empleado"
          />
        </FormField>
        <FormField label="Obra social" error={errors.obra_social?.message}>
          <input
            {...register("obra_social")}
            className="input"
            placeholder="OSDE / INSEP"
          />
        </FormField>
      </div>

      <FormField label="Localidad" error={errors.localidad?.message} required>
        <select {...register("localidad")} className="input">
          <option value="">Seleccionar...</option>
          {(localidades ?? DEFAULT_LOCALIDADES).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Carpeta / Ref. documental"
        error={errors.carpeta_nacimiento?.message}
      >
        <input
          {...register("carpeta_nacimiento")}
          className="input"
          placeholder="Nro. carpeta o referencia"
        />
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary"
          >
            Cancelar
          </button>
        )}
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}