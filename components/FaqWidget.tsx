"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const WHATSAPP_NUMERO = "5493734409813"; // Baldovino Ángel
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMERO}`;

type FAQ = {
  keywords: string[];
  pregunta: string;
  respuesta: string;
};

const FAQS: FAQ[] = [
  {
    keywords: ["cuanto", "cuesta", "precio", "valor", "cuota", "mensual", "afiliacion"],
    pregunta: "¿Cuánto cuesta la afiliación?",
    respuesta:
      "La cuota mensual es de $20.000 con obra social acreditada o $25.000 sin obra social. Los valores se actualizan periódicamente por inflación, siempre con aviso previo de 30 días.",
  },
  {
    keywords: ["cubre", "incluye", "que", "servicios", "plan", "cobertura"],
    pregunta: "¿Qué incluye el plan?",
    respuesta:
      "El plan cubre sala velatoria y calle, traslado del fallecido dentro del área de cobertura, trámites ante el Registro Civil, cafetería durante el velatorio y accesorios funerarios básicos (ataúd estándar, urna en caso de cremación). Los servicios adicionales se abonan por separado.",
  },
  {
    keywords: ["zona", "localidad", "donde", "cobertura", "region", "pueblo"],
    pregunta: "¿En qué zonas trabajan?",
    respuesta:
      "Cubrimos Colonia Elisa, La Escondida, Tirol, La Verde, Colonias Unidas y Las Garcitas, además de los radios rurales adyacentes. Los traslados fuera de esa zona tienen un cargo adicional según la distancia.",
  },
  {
    keywords: ["pagar", "pago", "abonar", "medio", "efectivo", "transferencia", "mercadopago", "mercado", "debito"],
    pregunta: "¿Cómo se paga la cuota?",
    respuesta:
      "Podés pagar en efectivo, por transferencia bancaria o con débito automático a través de Mercado Pago. Podés cancelar el débito automático cuando quieras desde tu cuenta de Mercado Pago.",
  },
  {
    keywords: ["cancelar", "baja", "rescindir", "dar de baja", "desafiliar"],
    pregunta: "¿Puedo darme de baja?",
    respuesta:
      "Sí, podés rescindir el contrato en cualquier momento mediante una comunicación fehaciente, sin reembolso de las cuotas ya abonadas. Si te atrasás con 2 cuotas se suspende la cobertura, y con 3 cuotas impagas se da de baja definitiva.",
  },
  {
    keywords: ["afiliarme", "empezar", "sumarme", "inscribirme", "alta", "como me afilio"],
    pregunta: "¿Cómo me afilio?",
    respuesta:
      "Completá el formulario de afiliación acá en la web (botón \"Afiliarme\") y un representante se va a contactar con vos para coordinar el pago y avanzar con el contrato.",
  },
  {
    keywords: ["cementerio", "memorial", "vela", "difunto", "fallecido", "buscar familiar"],
    pregunta: "¿Qué es el Cementerio Virtual?",
    respuesta:
      "Es un espacio online donde podés buscar el memorial de un familiar, encenderle una vela y dejar un mensaje de condolencias. Lo encontrás en la sección \"Cementerio Virtual\" del menú.",
  },
  {
    keywords: ["direccion", "ubicacion", "queda", "domicilio", "local"],
    pregunta: "¿Dónde están ubicados?",
    respuesta: "Estamos en Fortunato Pértile 637, Colonia Elisa, Chaco.",
  },
  {
    keywords: ["horario", "24", "horas", "atencion", "atienden"],
    pregunta: "¿Atienden las 24 horas?",
    respuesta: "Sí, la atención es las 24 horas, todos los días.",
  },
  {
    keywords: ["contrato", "clausulas", "descargar", "pdf", "letra chica"],
    pregunta: "¿Puedo ver el contrato completo?",
    respuesta:
      "Sí, en la sección \"Contrato\" de la web podés leer todas las cláusulas y descargar el PDF completo.",
  },
];

const SUGERENCIAS = [
  "¿Cuánto cuesta la afiliación?",
  "¿Qué cubre el plan?",
  "¿Cómo me doy de baja?",
  "¿Qué es el Cementerio Virtual?",
];

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function buscarRespuesta(pregunta: string): FAQ | null {
  const q = normalizar(pregunta);
  let mejor: { faq: FAQ; score: number } | null = null;
  for (const faq of FAQS) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (q.includes(normalizar(kw))) score++;
    }
    if (score > 0 && (!mejor || score > mejor.score)) {
      mejor = { faq, score };
    }
  }
  return mejor?.faq ?? null;
}

type Mensaje = {
  autor: "bot" | "user";
  texto: string;
  sinRespuesta?: boolean;
  preguntaOriginal?: string;
};

export default function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      autor: "bot",
      texto:
        "¡Hola! Soy el asistente virtual de Evenser. Preguntame sobre planes, cobertura, pagos o el Cementerio Virtual.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, open]);

  const responder = (pregunta: string) => {
    const limpia = pregunta.trim();
    if (!limpia) return;
    const faq = buscarRespuesta(limpia);
    setMensajes((prev) => [
      ...prev,
      { autor: "user", texto: limpia },
      faq
        ? { autor: "bot", texto: faq.respuesta }
        : {
            autor: "bot",
            texto:
              "No tengo una respuesta para esa consulta todavía. Escribile directo a Ángel Baldovino y te responde personalmente.",
            sinRespuesta: true,
            preguntaOriginal: limpia,
          },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden max-h-[70vh]">
          <div className="bg-stone-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-sm font-semibold">Asistente Evenser</p>
              <p className="text-xs text-stone-300">Respuestas rápidas a tus dudas</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-300 hover:text-white p-1"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-stone-50">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.autor === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.autor === "user"
                      ? "bg-stone-800 text-white rounded-br-sm"
                      : "bg-white border border-stone-200 text-stone-700 rounded-bl-sm"
                  }`}
                >
                  {m.texto}
                  {m.sinRespuesta && (
                    <a
                      href={`${WHATSAPP_BASE}?text=${encodeURIComponent(
                        `Hola Ángel, te escribo desde la web de Evenser. Mi consulta es: ${m.preguntaOriginal}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg px-2.5 py-1.5 text-xs font-medium w-fit"
                    >
                      📱 Escribir a Ángel por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}

            {mensajes.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGERENCIAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => responder(s)}
                    className="text-xs bg-white border border-stone-200 text-stone-600 rounded-full px-3 py-1.5 hover:border-stone-400 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              responder(input);
            }}
            className="flex items-center gap-2 border-t border-stone-100 p-2.5 flex-shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu pregunta..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
            />
            <button
              type="submit"
              className="bg-stone-800 text-white p-2.5 rounded-lg hover:bg-stone-900 transition-colors flex-shrink-0"
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-stone-800 hover:bg-stone-900 text-white shadow-xl flex items-center justify-center transition-colors"
        aria-label="Abrir asistente de preguntas frecuentes"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
