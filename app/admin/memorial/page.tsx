"use client";
import { useEffect, useState, useTransition } from "react";
import {
  getMemorials,
  createMemorial,
  updateMemorial,
  deleteMemorial,
  getMensajesAdmin,
  ocultarMensaje,
  mostrarMensaje,
  eliminarMensaje,
} from "@/lib/actions/memorial";
import { getDeceasedRecords } from "@/lib/actions/fallecidos";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  Modal,
  EmptyState,
  LoadingSpinner,
  Badge,
  FormField,
  ConfirmDialog,
} from "@/components/ui";
import { Plus, Flame, MessageCircle, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Memorial, MemorialMessage } from "@/types";

const SITE_URL = "https://evenser.vercel.app";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function MemorialPage() {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [deceasedList, setDeceasedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"nuevo" | "editar" | "mensajes" | null>(null);
  const [selected, setSelected] = useState<Memorial | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Memorial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [, start] = useTransition();

  const load = () => {
    setLoading(true);
    Promise.all([getMemorials(), getDeceasedRecords()])
      .then(([m, d]) => {
        setMemorials(m as Memorial[]);
        setDeceasedList(d);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deceasedSinMemorial = deceasedList.filter(
    (d) => !memorials.some((m) => m.deceased_id === d.id),
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Memorial Virtual</h1>
          <p className="text-sm text-gray-500">{memorials.length} memoriales creados</p>
        </div>
        <button onClick={() => setModal("nuevo")} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo memorial
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : !memorials.length ? (
        <EmptyState
          title="Sin memoriales todavía"
          description="Creá el primero eligiendo un fallecido ya cargado en el sistema"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memorials.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {m.deceased?.nombre_fallecido} {m.deceased?.apellido_fallecido}
                  </p>
                  <p className="text-xs text-gray-500">/memorial/{m.slug}</p>
                </div>
                <Badge variant={m.activo ? "green" : "gray"}>
                  {m.activo ? "Público" : "Oculto"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 mb-4">
                <span className="flex items-center gap-1">
                  <Flame size={14} className="text-amber-500" /> {m.velas_count}
                </span>
                <a
                  href={`${SITE_URL}/memorial/${m.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-700 hover:underline ml-auto"
                >
                  Ver público <ExternalLink size={13} />
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelected(m);
                    setModal("editar");
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm"
                >
                  <Pencil size={14} /> Editar
                </button>
                <button
                  onClick={() => {
                    setSelected(m);
                    setModal("mensajes");
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm"
                >
                  <MessageCircle size={14} /> Mensajes
                </button>
                <button
                  onClick={() => setConfirmDelete(m)}
                  className="btn-danger px-3"
                  title="Eliminar memorial"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal nuevo */}
      <Modal open={modal === "nuevo"} onClose={() => setModal(null)} title="Nuevo memorial">
        <MemorialForm
          deceasedOptions={deceasedSinMemorial}
          onSubmit={async (data) => {
            const res = await createMemorial(data);
            if (res?.error) { setError(res.error); return; }
            setError("");
            setModal(null);
            load();
          }}
          onCancel={() => setModal(null)}
        />
      </Modal>

      {/* modal editar */}
      <Modal
        open={modal === "editar"}
        onClose={() => setModal(null)}
        title={`Editar — ${selected?.deceased?.nombre_fallecido ?? ""} ${selected?.deceased?.apellido_fallecido ?? ""}`}
      >
        {selected && (
          <MemorialForm
            memorial={selected}
            onSubmit={async (data) => {
              const res = await updateMemorial(selected.id, data);
              if (res?.error) { setError(res.error); return; }
              setError("");
              setModal(null);
              load();
            }}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      {/* modal mensajes */}
      <Modal
        open={modal === "mensajes"}
        onClose={() => setModal(null)}
        title={`Mensajes — ${selected?.deceased?.nombre_fallecido ?? ""} ${selected?.deceased?.apellido_fallecido ?? ""}`}
      >
        {selected && <MensajesModeracion memorialId={selected.id} />}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        loading={deleting}
        title="Eliminar memorial"
        message={`Se eliminará el memorial de ${confirmDelete?.deceased?.nombre_fallecido ?? ""} ${confirmDelete?.deceased?.apellido_fallecido ?? ""} junto con todos sus mensajes. Esta acción no se puede deshacer.`}
        onConfirm={async () => {
          if (!confirmDelete) return;
          setDeleting(true);
          const res = await deleteMemorial(confirmDelete.id);
          setDeleting(false);
          if (res?.error) { setError(res.error); return; }
          setConfirmDelete(null);
          load();
        }}
      />
    </div>
  );
}

function MemorialForm({
  memorial,
  deceasedOptions,
  onSubmit,
  onCancel,
}: {
  memorial?: Memorial;
  deceasedOptions?: any[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    deceased_id: memorial?.deceased_id ?? "",
    slug: memorial?.slug ?? "",
    foto_url: memorial?.foto_url ?? "",
    frase: memorial?.frase ?? "",
    biografia: memorial?.biografia ?? "",
    activo: memorial?.activo ?? true,
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleDeceasedChange = (id: string) => {
    set("deceased_id", id);
    const d = deceasedOptions?.find((x) => x.id === id);
    if (d && !memorial) {
      set("slug", slugify(`${d.nombre_fallecido}-${d.apellido_fallecido}`));
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        let foto_url = form.foto_url;
        if (imageFile) {
          setUploading(true);
          try {
            foto_url = await uploadToCloudinary(imageFile);
          } catch {
            // continuar sin imagen si falla
          }
          setUploading(false);
        }
        await onSubmit({ ...form, foto_url });
        setLoading(false);
      }}
      className="space-y-4"
    >
      {!memorial && (
        <FormField label="Fallecido" required>
          <select
            className="input"
            required
            value={form.deceased_id}
            onChange={(e) => handleDeceasedChange(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {deceasedOptions?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre_fallecido} {d.apellido_fallecido} — {d.fecha_fallecimiento}
              </option>
            ))}
          </select>
        </FormField>
      )}
      <FormField label="Slug (URL pública)" required>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-400 whitespace-nowrap">/memorial/</span>
          <input
            className="input"
            required
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            placeholder="juan-perez"
          />
        </div>
      </FormField>
      <FormField label="Frase / epitafio (opcional)">
        <input
          className="input"
          maxLength={200}
          value={form.frase}
          onChange={(e) => set("frase", e.target.value)}
          placeholder="Siempre en nuestros corazones"
        />
      </FormField>
      <FormField label="Biografía (opcional)">
        <textarea
          className="input"
          rows={4}
          maxLength={3000}
          value={form.biografia}
          onChange={(e) => set("biografia", e.target.value)}
        />
      </FormField>
      <FormField label="Foto (opcional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        {form.foto_url && !imageFile && (
          <p className="text-xs text-gray-500 mt-1">Ya tiene una foto cargada</p>
        )}
        {imageFile && <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>}
      </FormField>
      <FormField label="Visibilidad">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => set("activo", e.target.checked)}
          />
          Público (visible en /memorial/{form.slug || "..."})
        </label>
      </FormField>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {uploading ? "Subiendo imagen..." : loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

function MensajesModeracion({ memorialId }: { memorialId: string }) {
  const [mensajes, setMensajes] = useState<MemorialMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getMensajesAdmin(memorialId)
      .then((m) => setMensajes(m as MemorialMessage[]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [memorialId]);

  if (loading) return <LoadingSpinner />;
  if (!mensajes.length)
    return <EmptyState title="Sin mensajes todavía" />;

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
      {mensajes.map((m) => (
        <div key={m.id} className="border border-gray-100 rounded-xl p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{m.autor_nombre}</p>
              <p className="text-xs text-gray-400">
                {new Date(m.created_at).toLocaleString("es-AR")}
              </p>
            </div>
            <Badge variant={m.estado === "visible" ? "green" : "gray"}>
              {m.estado === "visible" ? "Visible" : "Oculto"}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{m.mensaje}</p>
          <div className="flex gap-2 mt-3">
            <button
              disabled={busyId === m.id}
              onClick={async () => {
                setBusyId(m.id);
                await (m.estado === "visible" ? ocultarMensaje(m.id) : mostrarMensaje(m.id));
                setBusyId(null);
                load();
              }}
              className="btn-secondary text-xs px-2.5 py-1"
            >
              {m.estado === "visible" ? "Ocultar" : "Mostrar"}
            </button>
            <button
              disabled={busyId === m.id}
              onClick={async () => {
                if (!confirm("¿Eliminar este mensaje?")) return;
                setBusyId(m.id);
                await eliminarMensaje(m.id);
                setBusyId(null);
                load();
              }}
              className="btn-danger text-xs px-2.5 py-1"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
