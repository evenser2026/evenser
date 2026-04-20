"use client";

import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import {
  downloadCsv,
  downloadExcel,
  prepareClientesSheet,
  preparePagosSheet,
  prepareServiciosSheet,
  prepareFamiliaresSheet,
} from "@/lib/utils/exportCsv";

interface Props {
  clientes: any[];
  pagos: any[];
  servicios: any[];
  familiares?: any[];
}

export default function ExportButtons({
  clientes,
  pagos,
  servicios,
  familiares = [],
}: Props) {
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingXlsx, setLoadingXlsx] = useState(false);

  const fecha = new Date().toISOString().slice(0, 10);

  const handleCsv = () => {
    setLoadingCsv(true);
    try {
      downloadCsv(
        prepareClientesSheet(clientes),
        `evenser_clientes_${fecha}.csv`,
      );
    } finally {
      setLoadingCsv(false);
    }
  };

  const handleExcel = async () => {
    setLoadingXlsx(true);
    try {
      await downloadExcel(
        [
          { name: "Clientes", rows: prepareClientesSheet(clientes) },
          { name: "Familiares", rows: prepareFamiliaresSheet(familiares) },
          { name: "Pagos", rows: preparePagosSheet(pagos) },
          { name: "Servicios", rows: prepareServiciosSheet(servicios) },
        ],
        `evenser_reporte_${fecha}.xlsx`,
      );
    } finally {
      setLoadingXlsx(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCsv}
        disabled={loadingCsv}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        <Download size={14} />
        {loadingCsv ? "Exportando..." : "CSV"}
      </button>
      <button
        onClick={handleExcel}
        disabled={loadingXlsx}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        <FileSpreadsheet size={14} />
        {loadingXlsx ? "Generando..." : "Excel (multi-hoja)"}
      </button>
    </div>
  );
}
