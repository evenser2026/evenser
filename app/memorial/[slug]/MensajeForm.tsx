"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearMensaje } from "@/lib/actions/memorial";
import { memorialMessageSchema } from "@/lib/validations/memorial";

export default function MensajeForm({ memorialId }: { memorialId: string }) {
  const router = useRouter();
  const [autor, setAutor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isPending, start] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = memorialMessageSchema.safeParse({ autor_nombre: autor, mensaje });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setError("");
    start(async () => {
      const res = await crearMensaje(memorialId, parsed.data);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setAutor("");
      setMensaje("");
      setEnviado(true);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-gray-900">Dejar un mensaje de condolencias</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {enviado && !error && (
        <p className="text-xs text-emerald-600">Tu mensaje fue publicado. Gracias por tu acompañamiento.</p>
      )}
      <input
        className="input"
        placeholder="Tu nombre"
        maxLength={60}
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
        required
      />
      <textarea
        className="input"
        placeholder="Escribí unas palabras..."
        rows={3}
        maxLength={500}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors font-medium disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Publicar mensaje"}
      </button>
    </form>
  );
}
