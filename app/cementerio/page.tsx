"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Flame } from "lucide-react";
import { buscarMemoriales } from "@/lib/actions/memorial";
import FaqWidget from "@/components/FaqWidget";

export default function CementerioVirtualPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [busco, setBusco] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim().length >= 2) {
        setBuscando(true);
        buscarMemoriales(query)
          .then((r) => {
            setResultados(r);
            setBusco(true);
          })
          .finally(() => setBuscando(false));
      } else {
        setResultados([]);
        setBusco(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-stone-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">E</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">Evenser</p>
              <p className="text-xs text-gray-500 leading-tight">Cementerio Virtual</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Buscá a tu familiar
          </h1>
          <p className="text-gray-500 text-sm">
            Encontrá su memorial, dejá un mensaje o encendé una vela en su memoria
          </p>
        </div>

        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
            placeholder="Nombre y apellido..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {buscando && <p className="text-center text-sm text-gray-400">Buscando...</p>}

        {!buscando && busco && resultados.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            No encontramos ningún memorial con ese nombre.
          </p>
        )}

        <div className="space-y-3">
          {resultados.map((m) => (
            <Link
              key={m.id}
              href={`/memorial/${m.slug}`}
              className="flex items-center gap-4 bg-white border border-stone-100 rounded-xl p-4 hover:border-stone-300 transition-colors"
            >
              {m.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.foto_url}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-stone-500">
                    {m.deceased?.nombre_fallecido?.[0] ?? "?"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {m.deceased?.nombre_fallecido} {m.deceased?.apellido_fallecido}
                </p>
                {m.deceased?.fecha_fallecimiento && (
                  <p className="text-xs text-gray-400">
                    †{" "}
                    {new Date(m.deceased.fecha_fallecimiento + "T00:00:00").toLocaleDateString(
                      "es-AR",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                )}
              </div>
              <Flame size={16} className="text-amber-400 flex-shrink-0" />
            </Link>
          ))}
        </div>

        {!busco && (
          <p className="text-center text-xs text-gray-400 mt-10">
            Escribí al menos 2 letras para empezar a buscar.
          </p>
        )}

        <footer className="text-center text-xs text-gray-400 mt-16">
          Un servicio de EVENSER — Eventos y Servicios Sociales
        </footer>
      </div>
      <FaqWidget />
    </main>
  );
}
