"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { convenioSchema, type ConvenioInput } from "@/lib/validations";
import { FormField } from "@/components/ui";
import type { Convenio } from "@/types";

interface Props {
  defaultValues?: Partial<Convenio>;
  onSubmit: (data: ConvenioInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function ConvenioForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading: externalLoading,
  submitLabel = "Guardar convenio",
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading ?? internalLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvenioInput>({
    resolver: zodResolver(convenioSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      tipo: defaultValues?.tipo ?? ("" as any),
      contacto: defaultValues?.contacto ?? "",
      telefono: defaultValues?.telefono ?? "",
      servicios_prepagos: defaultValues?.servicios_prepagos ?? 0,
      saldo_favor: defaultValues?.saldo_favor ?? 0,
    },
  });

  const handleFormSubmit = async (data: ConvenioInput) => {
    setInternalLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        label="Nombre de la organización"
        error={errors.nombre?.message}
        required
      >
        <input
          {...register("nombre")}
          className="input"
          placeholder="Municipalidad de La Escondida..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tipo" error={errors.tipo?.message} required>
          <select {...register("tipo")} className="input">
            <option value="">Seleccionar...</option>
            <option value="empresa">Empresa</option>
            <option value="sindicato">Sindicato</option>
            <option value="municipio">Municipio</option>
            <option value="residencia_adultos">
              Residencia adultos mayores
            </option>
          </select>
        </FormField>

        <FormField label="Teléfono" error={errors.telefono?.message}>
          <input
            {...register("telefono")}
            className="input"
            placeholder="3624000000"
          />
        </FormField>
      </div>

      <FormField label="Contacto" error={errors.contacto?.message}>
        <input
          {...register("contacto")}
          className="input"
          placeholder="Nombre del responsable"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Servicios prepagos"
          error={errors.servicios_prepagos?.message}
          required
        >
          <input
            type="number"
            {...register("servicios_prepagos")}
            className="input"
            min={0}
            placeholder="0"
          />
        </FormField>
        <FormField
          label="Saldo a favor ($)"
          error={errors.saldo_favor?.message}
          required
        >
          <input
            type="number"
            step="0.01"
            {...register("saldo_favor")}
            className="input"
            min={0}
            placeholder="0.00"
          />
        </FormField>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
