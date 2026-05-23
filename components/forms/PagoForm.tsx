"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pagoSchema, type PagoInput } from "@/lib/validations";
import { FormField } from "@/components/ui";
import type { Cliente } from "@/types";

interface Props {
  clientes?: Cliente[];
  defaultClienteId?: string;
  onSubmit: (data: PagoInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PagoForm({
  clientes,
  defaultClienteId,
  onSubmit,
  onCancel,
  loading: externalLoading,
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading ?? internalLoading;

  // Estados para el combobox de búsqueda
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PagoInput>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      cliente_id: defaultClienteId ?? "",
      monto: undefined,
      fecha: new Date().toISOString().split("T")[0],
      metodo_pago: "efectivo",
      estado: "pagado",
      tipo_pago: "mensual",
      descripcion: "",
      checkout_dias: 35,
    },
  });

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        // Si el usuario escribió pero no seleccionó, restaurar el texto del seleccionado
        if (selectedCliente) {
          setSearchText(
            `${selectedCliente.apellido}, ${selectedCliente.nombre}`,
          );
        } else {
          setSearchText("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCliente]);

  const clientesFiltrados = (clientes ?? []).filter((c) =>
    `${c.apellido} ${c.nombre} ${c.dni}`
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  const handleSelectCliente = (c: Cliente) => {
    setSelectedCliente(c);
    setSearchText(`${c.apellido}, ${c.nombre}`);
    setValue("cliente_id", c.id, { shouldValidate: true });
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowDropdown(true);
    if (e.target.value === "") {
      setSelectedCliente(null);
      setValue("cliente_id", "", { shouldValidate: false });
    }
  };

  const handleFormSubmit = async (data: PagoInput) => {
    setInternalLoading(true);
    try {
      await onSubmit(data);
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
          {/* Input oculto para react-hook-form */}
          <input type="hidden" {...register("cliente_id")} />

          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar por apellido, nombre o DNI..."
              className="input w-full"
              autoComplete="off"
            />

            {showDropdown && (
              <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-52 overflow-y-auto">
                {clientesFiltrados.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-gray-400">
                    Sin resultados
                  </li>
                ) : (
                  clientesFiltrados.map((c) => (
                    <li
                      key={c.id}
                      onMouseDown={() => handleSelectCliente(c)}
                      className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
                    >
                      <span>
                        <span className="font-medium">{c.apellido}</span>,{" "}
                        {c.nombre}
                      </span>
                      <span className="text-xs text-gray-400">{c.dni}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </FormField>
      )}

      {defaultClienteId && <input type="hidden" {...register("cliente_id")} />}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Monto ($)" error={errors.monto?.message} required>
          <input
            type="number"
            step="0.01"
            {...register("monto")}
            className="input"
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Fecha" error={errors.fecha?.message} required>
          <input type="date" {...register("fecha")} className="input" />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Método" error={errors.metodo_pago?.message} required>
          <select {...register("metodo_pago")} className="input">
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="mercado_pago">Mercado Pago</option>
          </select>
        </FormField>

        <FormField label="Estado" error={errors.estado?.message} required>
          <select {...register("estado")} className="input">
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>
        </FormField>

        <FormField label="Tipo" error={errors.tipo_pago?.message} required>
          <select {...register("tipo_pago")} className="input">
            <option value="mensual">Mensual</option>
            <option value="unico">Único</option>
            <option value="prepago">Prepago</option>
          </select>
        </FormField>
      </div>

      <FormField
        label="Descripción (opcional)"
        error={errors.descripcion?.message}
      >
        <input
          {...register("descripcion")}
          className="input"
          placeholder="Cuota diciembre 2024..."
        />
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
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Guardando..." : "Registrar pago"}
        </button>
      </div>
    </form>
  );
}
