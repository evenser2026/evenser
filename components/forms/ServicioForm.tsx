"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { servicioSchema, type ServicioInput } from "@/lib/validations";
import { FormField } from "@/components/ui";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { Cliente } from "@/types";

interface Props {
  clientes?: Cliente[];
  defaultClienteId?: string;
  onSubmit: (data: ServicioInput & { imagen_url?: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ServicioForm({
  clientes,
  defaultClienteId,
  onSubmit,
  onCancel,
  loading: externalLoading,
}: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading ?? internalLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicioInput>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      cliente_id: defaultClienteId ?? "",
      tipo: "" as any,
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
      observaciones: "",
    },
  });

  const handleFormSubmit = async (data: ServicioInput) => {
    setInternalLoading(true);
    let imagen_url: string | undefined;
    if (imageFile) {
      setUploading(true);
      try {
        imagen_url = await uploadToCloudinary(imageFile);
      } catch {
        // imagen opcional, continuar sin ella
      }
      setUploading(false);
    }
    try {
      await onSubmit({ ...data, imagen_url });
    } finally {
      setInternalLoading(false);
    }
  };

  const showClienteSelector =
    !!clientes && clientes.length > 0 && !defaultClienteId;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {showClienteSelector && (
        <FormField label="Cliente" error={errors.cliente_id?.message} required>
          <select {...register("cliente_id")} className="input">
            <option value="">Seleccionar cliente...</option>
            {clientes!.map((c) => (
              <option key={c.id} value={c.id}>
                {c.apellido}, {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
      )}

      {defaultClienteId && <input type="hidden" {...register("cliente_id")} />}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Tipo de servicio"
          error={errors.tipo?.message}
          required
        >
          <select {...register("tipo")} className="input">
            <option value="">Seleccionar...</option>
            <option value="traslado">Traslado</option>
            <option value="servicios_de_calle">Servicios de calle</option>
            <option value="capilla_ardiente">Capilla ardiente</option>
            <option value="servicio_de_sala">Servicio de sala</option>
            <option value="tramite_registro">Trámite registro</option>
            <option value="cremacion">Cremación</option>
          </select>
        </FormField>

        <FormField label="Estado" error={errors.estado?.message} required>
          <select {...register("estado")} className="input">
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </FormField>
      </div>

      <FormField label="Fecha" error={errors.fecha?.message} required>
        <input type="date" {...register("fecha")} className="input" />
      </FormField>

      <FormField label="Observaciones" error={errors.observaciones?.message}>
        <textarea
          {...register("observaciones")}
          className="input min-h-[80px] resize-none"
          rows={3}
          placeholder="Detalles del servicio..."
        />
      </FormField>

      <FormField label="Imagen (opcional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="input py-1.5"
        />
        {imageFile && (
          <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>
        )}
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="btn-primary"
        >
          {uploading
            ? "Subiendo imagen..."
            : isLoading
              ? "Guardando..."
              : "Registrar servicio"}
        </button>
      </div>
    </form>
  );
}
