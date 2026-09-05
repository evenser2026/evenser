import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemorialPublico, getMensajesVisibles } from "@/lib/actions/memorial";
import VelaButton from "./VelaButton";
import MensajeForm from "./MensajeForm";
import FaqWidget from "@/components/FaqWidget";

const SITE_URL = "https://evenser.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const memorial = await getMemorialPublico(params.slug);
  if (!memorial) return { title: "Memorial no encontrado | Evenser" };

  const nombre = `${memorial.deceased?.nombre_fallecido ?? ""} ${memorial.deceased?.apellido_fallecido ?? ""}`.trim();
  const title = `En memoria de ${nombre} | Evenser`;
  const description =
    memorial.frase ||
    memorial.biografia?.slice(0, 150) ||
    `Espacio de memoria y condolencias para ${nombre}, un servicio de Evenser.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/memorial/${params.slug}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `${SITE_URL}/memorial/${params.slug}`,
      images: [{ url: memorial.foto_url || "/og-image.png" }],
    },
  };
}

export default async function MemorialPublicoPage({
  params,
}: {
  params: { slug: string };
}) {
  const memorial = await getMemorialPublico(params.slug);
  if (!memorial) notFound();

  const mensajes = await getMensajesVisibles(memorial.id);
  const nombre = `${memorial.deceased?.nombre_fallecido ?? ""} ${memorial.deceased?.apellido_fallecido ?? ""}`.trim();
  const fecha = memorial.deceased?.fecha_fallecimiento
    ? new Date(memorial.deceased.fecha_fallecimiento + "T00:00:00").toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

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
              <p className="text-xs text-gray-500 leading-tight">Memorial Virtual</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          {memorial.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={memorial.foto_url}
              alt={nombre}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-5 border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-stone-200 mx-auto mb-5 flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-3xl font-bold text-stone-500">
                {memorial.deceased?.nombre_fallecido?.[0] ?? "?"}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{nombre}</h1>
          {fecha && <p className="text-sm text-gray-500 mt-1">† {fecha}</p>}
          {memorial.frase && (
            <p className="text-gray-600 italic mt-4 max-w-lg mx-auto">&ldquo;{memorial.frase}&rdquo;</p>
          )}
        </div>

        <div className="flex justify-center mb-10">
          <VelaButton
            memorialId={memorial.id}
            slug={memorial.slug}
            velasIniciales={memorial.velas_count}
          />
        </div>

        {memorial.biografia && (
          <div className="card p-6 mb-10">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Su historia</h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {memorial.biografia}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Mensajes de condolencias ({mensajes.length})
          </h2>
          <div className="mb-4">
            <MensajeForm memorialId={memorial.id} />
          </div>
          <div className="space-y-3">
            {mensajes.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                Todavía no hay mensajes. Sé el primero en dejar unas palabras.
              </p>
            )}
            {mensajes.map((m) => (
              <div key={m.id} className="bg-white border border-stone-100 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900">{m.autor_nombre}</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{m.mensaje}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(m.created_at).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-12 pb-8">
          Un servicio de EVENSER — Eventos y Servicios Sociales ·{" "}
          <Link href="/" className="underline hover:text-gray-600">
            evenser.vercel.app
          </Link>
        </footer>
      </div>
      <FaqWidget />
    </main>
  );
}
