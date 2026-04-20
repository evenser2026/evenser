"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Data ────────────────────────────────────────────────────────────────────
const servicios = [
  {
    icon: "https://res.cloudinary.com/dmqm4b1y3/image/upload/v1776720848/evenser_servicios/n5f4lefhuboamhtx8cav.jpg",
    titulo: "Sala y Calle",
    desc: "Servicio completo de velatorio en sala y acompañamiento en el cortejo fúnebre, coordinando cada detalle con delicadeza.",
  },
  {
    icon: "https://res.cloudinary.com/dmqm4b1y3/image/upload/v1776720849/evenser_servicios/ufj5nlwgbinszkoo9qze.jpg",
    titulo: "Traslado",
    desc: "Traslado del ser querido desde cualquier punto, con total discreción y respeto. Cobertura regional.",
  },
  {
    icon: "https://res.cloudinary.com/dmqm4b1y3/image/upload/v1776721683/evenser_servicios/ofuztgjdxcw9pdqg2svu.webp",
    titulo: "Cremaciones",
    desc: "Servicio de cremación con instalaciones modernas y seguras. Nos encargamos de todo el proceso.",
  },
  {
    icon: "https://res.cloudinary.com/dmqm4b1y3/image/upload/v1776721684/evenser_servicios/xiaz3q4y9iikotbdeqmo.jpg",
    titulo: "Trámites Registro Civil",
    desc: "Gestionamos certificados de defunción, inscripción del fallecimiento y todos los trámites legales requeridos.",
  },
  {
    icon: "https://res.cloudinary.com/dmqm4b1y3/image/upload/v1776720852/evenser_servicios/jr4bt0nz2cwngmaoc46h.avif",
    titulo: "Accesorios Funerarios",
    desc: "Coronas de flores, urnas funerarias, lápidas personalizadas y joyería conmemorativa.",
  },
  {
    icon: "https://res.cloudinary.com/dmqm4b1y3/image/upload/v1776720853/evenser_servicios/luhgvy4eu6xdvxumqbft.png",
    titulo: "Cafetería",
    desc: "Espacio íntimo con bebidas y bocadillos para que los dolientes puedan descansar y encontrar consuelo.",
  },
];

const testimonios = [
  {
    texto:
      "El servicio fúnebre de Evenser superó mis expectativas. Fueron muy profesionales y respetuosos en todo momento.",
    autor: "Cliente de Colonia Elisa",
  },
  {
    texto:
      "Nos han acompañado en todo momento y cumplieron con nuestras expectativas. Gracias Evenser por ofrecernos un servicio de calidad y confianza.",
    autor: "Familia de La Escondida",
  },
  {
    texto:
      "Recomiendo Evenser a todas las personas que necesiten servicios fúnebres. Su atención y calidad son excelentes.",
    autor: "Cliente de Tirol",
  },
];

const localidades = [
  "Col. Elisa",
  "La Escondida",
  "Tirol",
  "La Verde",
  "Colonias Unidas",
  "Las Garcitas",
  "Otra",
];

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ onAfiliarse }: { onAfiliarse: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-stone-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base">E</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">
              Evenser
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              Eventos y Servicios Sociales
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#servicios"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Servicios
          </a>
          <a
            href="#planes"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Planes
          </a>
          <a
            href="#contacto"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contacto
          </a>
          <button
            onClick={onAfiliarse}
            className="bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors font-medium"
          >
            Afiliarme
          </button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <a
            href="#servicios"
            onClick={() => setOpen(false)}
            className="block text-sm text-gray-700 py-2"
          >
            Servicios
          </a>
          <a
            href="#planes"
            onClick={() => setOpen(false)}
            className="block text-sm text-gray-700 py-2"
          >
            Planes
          </a>
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="block text-sm text-gray-700 py-2"
          >
            Contacto
          </a>
          <button
            onClick={() => {
              setOpen(false);
              onAfiliarse();
            }}
            className="w-full bg-stone-800 text-white text-sm px-4 py-2.5 rounded-lg font-medium"
          >
            Afiliarme
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Formulario de afiliación ─────────────────────────────────────────────────
// ─── Reemplazá SOLO el componente FormAfiliacion en app/landing/page.tsx ──────
// El resto del archivo (Nav, Modal, LandingPage, etc.) queda exactamente igual.

// ─── REEMPLAZÁ SOLO ESTA FUNCIÓN en app/landing/page.tsx ─────────────────────
// Buscá "function FormAfiliacion" y reemplazá todo hasta el cierre de la función
// El resto del archivo (imports, Nav, Modal, LandingPage, etc.) NO se toca.
// ─────────────────────────────────────────────────────────────────────────────

function FormAfiliacion({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "pago" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [initPoint, setInitPoint] = useState("");
  const [montoFinal, setMontoFinal] = useState(0);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    ocupacion: "",
    obra_social: "",
    localidad: "",
    carpeta_nacimiento: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.dni ||
      !form.telefono ||
      !form.localidad ||
      !form.email
    )
      return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/afiliacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok && data.error) {
        setApiError(data.error);
        setLoading(false);
        return;
      }

      if (data.init_point) {
        setInitPoint(data.init_point);
        setMontoFinal(data.monto);
        setStep("pago");
      } else {
        setStep("success");
      }
    } catch {
      setStep("success");
    }
    setLoading(false);
  };

  // ── Step: pago MP ──────────────────────────────────────────────────────────
  if (step === "pago") {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ¡Ya casi terminás!
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Tu solicitud fue registrada. Para activar tu afiliación completá el
          primer pago mensual.
        </p>
        <p className="text-2xl font-bold text-stone-900 mb-1">
          ${montoFinal.toLocaleString("es-AR")}
          <span className="text-base font-normal text-gray-500">/mes</span>
        </p>
        <p className="text-xs text-gray-400 mb-6">
          {montoFinal === 20000
            ? "Plan con obra social"
            : "Plan sin obra social"}
        </p>
        <a
          href={initPoint}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-stone-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-stone-900 transition-colors mb-3"
        >
          💳 Pagar con Mercado Pago
        </a>
        <p className="text-xs text-gray-400 mb-5">
          Después del primer pago los cobros son automáticos cada mes. Podés
          cancelar cuando quieras desde Mercado Pago.
        </p>
        <div className="bg-stone-50 rounded-xl p-4 text-left mb-4">
          <p className="text-sm text-stone-700 font-medium mb-2">
            ¿Preferís coordinar por WhatsApp?
          </p>
          <a
            href="https://wa.me/543734409813"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-700 text-sm font-medium hover:underline"
          >
            <span>📱</span> WhatsApp: 3734-409813 (Baldovino Ángel)
          </a>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Cerrar y pagar después
        </button>
      </div>
    );
  }

  // ── Step: éxito fallback sin MP ────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ¡Solicitud enviada!
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Recibimos tu solicitud. Un representante de Evenser te contactará en
          breve para coordinar el pago y activar tu afiliación.
        </p>
        <div className="bg-stone-50 rounded-xl p-4 text-left mb-6">
          <p className="text-sm text-stone-700 font-medium mb-2">
            Contactanos directamente:
          </p>
          <a
            href="https://wa.me/543734409813"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-700 text-sm font-medium hover:underline"
          >
            <span>📱</span> WhatsApp: 3734-409813 (Baldovino Ángel)
          </a>
        </div>
        <button
          onClick={onClose}
          className="bg-stone-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-900 transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  // ── Step: formulario ───────────────────────────────────────────────────────
  const montoPreview =
    form.obra_social && form.obra_social.trim() !== "" ? 20000 : 25000;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="Juan"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="Pérez"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            DNI *
          </label>
          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="28000000"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="3624000000"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
          placeholder="juan@ejemplo.com"
        />
        <p className="text-xs text-gray-400 mt-1">
          Necesario para vincular tu suscripción en Mercado Pago
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Localidad *
        </label>
        <select
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white"
        >
          <option value="">Seleccioná tu localidad...</option>
          {localidades.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Ocupación
          </label>
          <input
            name="ocupacion"
            value={form.ocupacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="Empleado..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Obra social
          </label>
          <input
            name="obra_social"
            value={form.obra_social}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="PAMI, OSDE..."
          />
        </div>
      </div>

      {/* Preview monto dinámico */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-stone-600">
          {form.obra_social && form.obra_social.trim() !== ""
            ? "✓ Con obra social"
            : "Sin obra social"}
        </span>
        <span className="font-bold text-stone-900">
          ${montoPreview.toLocaleString("es-AR")}/mes
        </span>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium text-sm hover:bg-stone-900 transition-colors disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Continuar al pago →"}
      </button>
      <p className="text-center text-xs text-gray-400">
        Tus datos están protegidos y no serán compartidos con terceros.
      </p>
    </form>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Solicitud de afiliación
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Plan Familiar Evenser
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <FormAfiliacion onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Nav onAfiliarse={() => setModalOpen(true)} />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 pt-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1614226114656-998786bf0955?auto=format&fit=crop&w=1920&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center py-24">
          <p className="text-stone-300 text-sm uppercase tracking-widest mb-4">
            Desde Colonia Elisa para toda la región
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            El más completo
            <br />
            servicio fúnebre
          </h1>
          <p className="text-xl text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Deja en nuestras manos ese momento tan difícil. Acompañamos a tu
            familia con respeto, profesionalismo y calidez humana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-white text-stone-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-stone-100 transition-colors shadow-lg"
            >
              Afiliarme ahora
            </button>
            <a
              href="#servicios"
              className="border border-white/40 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors"
            >
              Ver servicios
            </a>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              ["24hs", "Atención permanente"],
              ["15+", "Años de trayectoria"],
              ["6", "Localidades cubiertas"],
            ].map(([n, l]) => (
              <div key={n} className="text-center">
                <p className="text-3xl font-bold text-white">{n}</p>
                <p className="text-stone-400 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Quiénes somos?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            En <strong>Evenser</strong> nos dedicamos a brindar el más completo
            servicio funerario, con el objetivo de acompañarte en esos momentos
            difíciles y brindarte todo el apoyo necesario. Trabajamos con
            vocación de servicio desde Colonia Elisa, Chaco, cubriendo toda la
            región.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros servicios
            </h2>
            <p className="text-gray-500">
              Todo lo que necesitás en un solo lugar
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <div
                key={s.titulo}
                className="bg-stone-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className="relative w-48 h-48 mb-4 rounded-2xl overflow-hidden mx-auto cursor-pointer group"
                  onClick={() => setExpandedImage(s.icon)}
                >
                  <Image
                    src={s.icon}
                    alt={s.titulo}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="192px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-4xl">
                      🔍
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="py-20 bg-stone-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Plan de afiliación familiar
            </h2>
            <p className="text-stone-400">
              Cubrí a toda tu familia con una cuota mensual accesible
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-stone-800 rounded-2xl p-8 border border-stone-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">
                  Con obra social
                </h3>
                <span className="bg-green-900 text-green-300 text-xs px-2.5 py-1 rounded-full">
                  Descuento
                </span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">
                $20.000
                <span className="text-xl font-normal text-stone-400">/mes</span>
              </p>
              <p className="text-stone-400 text-sm mb-6">
                Para afiliados con cobertura médica
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Servicio de sala y calle",
                  "Traslado incluido",
                  "Trámites ante registro civil",
                  "Cafetería",
                  "Accesorios funerarios",
                ].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-stone-300 text-sm"
                  >
                    <span className="text-green-400">✓</span> {i}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-white text-stone-900 py-3 rounded-xl font-bold hover:bg-stone-100 transition-colors"
              >
                Afiliarme
              </button>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-stone-800 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-stone-800 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Más elegido
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  Sin obra social
                </h3>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                $25.000
                <span className="text-xl font-normal text-gray-400">/mes</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Cobertura completa sin requisitos
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Servicio de sala y calle",
                  "Traslado incluido",
                  "Trámites ante registro civil",
                  "Cafetería",
                  "Accesorios funerarios",
                ].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <span className="text-green-600">✓</span> {i}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold hover:bg-stone-900 transition-colors"
              >
                Afiliarme
              </button>
            </div>
          </div>
          <p className="text-center text-stone-500 text-sm mt-6">
            Los precios pueden variar. Contactate para confirmar la tarifa
            actualizada.
          </p>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &quot;{t.texto}&quot;
                </p>
                <p className="text-gray-400 text-xs font-medium">— {t.autor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para proteger a tu familia?
          </h2>
          <p className="text-gray-600 mb-8">
            Completá tu solicitud de afiliación y un representante te contactará
            para coordinar todo.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-stone-800 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-stone-900 transition-colors shadow-md"
          >
            Afiliarme ahora
          </button>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contacto</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-stone-300 text-sm uppercase tracking-wider mb-4">
                Dirección
              </h3>
              <p className="text-white">
                <a
                  href="https://maps.app.goo.gl/ZziYZ3Nb7tEUoFLP6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📍Fortunato Pértile 637
                </a>
              </p>
              <p className="text-stone-400 text-sm">Colonia Elisa, Chaco</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-300 text-sm uppercase tracking-wider mb-4">
                Teléfonos
              </h3>
              <div className="space-y-2">
                <a
                  href="https://wa.me/543734409813"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-stone-300 transition-colors text-sm"
                >
                  <span>📱</span> 3734-409813 · Baldovino Ángel
                </a>
                <a
                  href="https://wa.me/543734484040"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-stone-300 transition-colors text-sm"
                >
                  <span>📱</span> 3734-484040 · Baldovino Luciano
                </a>
                <a
                  href="https://wa.me/543624706753"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-stone-300 transition-colors text-sm"
                >
                  <span>📱</span> 3624-706753 · Gómez Ramonita
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-stone-300 text-sm uppercase tracking-wider mb-4">
                Email y redes
              </h3>
              <a
                href="mailto:balgim73@gmail.com"
                className="block text-white hover:text-stone-300 transition-colors text-sm mb-3"
              >
                📧 balgim73@gmail.com
              </a>
              <div className="flex gap-3 mt-2">
                <a
                  href="https://www.facebook.com/Evenser-eventos-y-sercicios-Sociales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white transition-colors text-sm"
                >
                  Facebook
                </a>
                <span className="text-stone-600">·</span>
                <a
                  href="https://www.instagram.com/evenser_Baldo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white transition-colors text-sm"
                >
                  Instagram
                </a>
                <span className="text-stone-600">·</span>
                <a
                  href="https://www.tiktok.com/@evenser_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white transition-colors text-sm"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm">
            © 2025 Evenser — Eventos y Servicios Sociales
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-stone-600 hover:text-stone-400 text-xs transition-colors"
            >
              Acceso administración
            </Link>
          </div>
        </div>
      </footer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Lightbox para imágenes de servicios */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
          >
            ×
          </button>
          <div className="relative w-full max-w-3xl h-[70vh] rounded-2xl overflow-hidden">
            <Image
              src={expandedImage}
              alt="Servicio"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            Toca en cualquier lugar para cerrar
          </p>
        </div>
      )}
    </div>
  );
}
