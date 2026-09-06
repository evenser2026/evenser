"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Flame, Map as MapIcon } from "lucide-react";
import { buscarMemoriales } from "@/lib/actions/memorial";
import { getSeccionesPublico, getParcelasPublico } from "@/lib/actions/cementerio";
import FaqWidget from "@/components/FaqWidget";

const ESTADOS = [
  { value: "libre", label: "Libre", dot: "bg-emerald-500", cell: "bg-emerald-500" },
  { value: "ocupado", label: "Ocupado", dot: "bg-rose-500", cell: "bg-rose-500" },
  { value: "reservado", label: "Reservado", dot: "bg-amber-500", cell: "bg-amber-500" },
  { value: "mantenimiento", label: "Mantenimiento", dot: "bg-gray-400", cell: "bg-gray-400" },
] as const;
const estadoInfo = (e: string) => ESTADOS.find((s) => s.value === e) ?? ESTADOS[0];

export default function CementerioVirtualPage() {
  const [tab, setTab] = useState<"buscar" | "mapa">("buscar");

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
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

      <div className={`mx-auto px-4 py-16 ${tab === "mapa" ? "max-w-4xl" : "max-w-2xl"}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {tab === "buscar" ? "Buscá a tu familiar" : "Mapa del cementerio"}
          </h1>
          <p className="text-gray-500 text-sm">
            {tab === "buscar"
              ? "Encontrá su memorial, dejá un mensaje o encendé una vela en su memoria"
              : "Disposición de secciones y estado general de las parcelas"}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setTab("buscar")}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors ${
              tab === "buscar" ? "bg-stone-800 text-white" : "bg-white border border-stone-200 text-stone-600"
            }`}
          >
            <Search size={14} /> Buscar por nombre
          </button>
          <button
            onClick={() => setTab("mapa")}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors ${
              tab === "mapa" ? "bg-stone-800 text-white" : "bg-white border border-stone-200 text-stone-600"
            }`}
          >
            <MapIcon size={14} /> Ver mapa
          </button>
        </div>

        {tab === "buscar" ? <BuscadorMemoriales /> : <MapaPublico />}

        <footer className="text-center text-xs text-gray-400 mt-16">
          Un servicio de EVENSER — Eventos y Servicios Sociales
        </footer>
      </div>
      <FaqWidget />
    </main>
  );
}

function BuscadorMemoriales() {
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
    <div>
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
    </div>
  );
}

function MapaPublico() {
  const [secciones, setSecciones] = useState<any[]>([]);
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingParcelas, setLoadingParcelas] = useState(false);

  useEffect(() => {
    getSeccionesPublico()
      .then((s) => {
        setSecciones(s);
        if (s.length) setSeccionActiva(s[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!seccionActiva) return;
    setLoadingParcelas(true);
    getParcelasPublico(seccionActiva)
      .then(setParcelas)
      .finally(() => setLoadingParcelas(false));
  }, [seccionActiva]);

  const { cols, rows } = useMemo(() => {
    const cols = parcelas.reduce((m, p) => Math.max(m, p.columna), 0);
    const rows = parcelas.reduce((m, p) => Math.max(m, p.fila), 0);
    return { cols, rows };
  }, [parcelas]);

  const grid = useMemo(() => {
    const map = new Map<string, any>();
    parcelas.forEach((p) => map.set(`${p.fila}-${p.columna}`, p));
    return map;
  }, [parcelas]);

  if (loading) return <p className="text-center text-sm text-gray-400">Cargando...</p>;

  if (!secciones.length)
    return (
      <p className="text-center text-sm text-gray-400">
        Todavía no cargamos el mapa del cementerio. Volvé a consultar pronto.
      </p>
    );

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap justify-center">
        {secciones.map((s) => (
          <button
            key={s.id}
            onClick={() => setSeccionActiva(s.id)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              seccionActiva === s.id
                ? "bg-stone-800 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {s.nombre}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-5 flex-wrap justify-center">
        {ESTADOS.map((e) => (
          <div key={e.value} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-3 h-3 rounded ${e.dot}`} />
            {e.label}
          </div>
        ))}
      </div>

      {loadingParcelas ? (
        <p className="text-center text-sm text-gray-400">Cargando parcelas...</p>
      ) : !parcelas.length ? (
        <p className="text-center text-sm text-gray-400">Esta sección todavía no tiene parcelas cargadas.</p>
      ) : (
        <div className="bg-white border border-stone-100 rounded-2xl p-5 overflow-x-auto">
          <div
            className="grid gap-2 w-max mx-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}
          >
            {Array.from({ length: rows }).map((_, ri) =>
              Array.from({ length: cols }).map((__, ci) => {
                const p = grid.get(`${ri + 1}-${ci + 1}`);
                if (!p) return <div key={`${ri}-${ci}`} className="w-9 h-9" />;
                const info = estadoInfo(p.estado);
                return (
                  <div
                    key={p.id}
                    title={`Parcela ${p.numero} — ${info.label}`}
                    className={`w-9 h-9 rounded-md ${info.cell}`}
                  />
                );
              }),
            )}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">
        Este mapa muestra la disposición general de las parcelas. Para consultar una ubicación
        puntual, escribinos por WhatsApp.
      </p>
    </div>
  );
}
