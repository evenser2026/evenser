import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function enviarEmailContrato(params: {
  emailDestino: string;
  nombre: string;
  apellido: string;
  dni: string;
  localidad: string;
  monto: number;
  obraSocial?: string;
}) {
  const { emailDestino, nombre, apellido, dni, localidad, monto, obraSocial } =
    params;

  const plan =
    obraSocial && obraSocial.trim() !== ""
      ? "Plan con Obra Social"
      : "Plan sin Obra Social";

  const fechaInicio = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Leer el PDF del contrato
  const contratoPdf = fs.readFileSync(
    path.join(process.cwd(), "public", "contrato.pdf"),
  );

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a2e; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Evenser</h1>
        <p style="color: #aaa; margin: 4px 0 0;">Eventos y Servicios Sociales</p>
      </div>

      <div style="padding: 32px 24px;">
        <h2 style="color: #1a1a2e;">¡Bienvenido/a a Evenser, ${nombre}!</h2>
        <p>Tu afiliación fue procesada exitosamente. A continuación el resumen de tu plan:</p>

        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Titular</td>
              <td style="padding: 8px 0; font-weight: bold;">${apellido}, ${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">DNI</td>
              <td style="padding: 8px 0; font-weight: bold;">${dni}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Localidad</td>
              <td style="padding: 8px 0; font-weight: bold;">${localidad}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Plan</td>
              <td style="padding: 8px 0; font-weight: bold;">${plan}</td>
            </tr>
            ${
              obraSocial && obraSocial.trim() !== ""
                ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">Obra Social</td>
              <td style="padding: 8px 0; font-weight: bold;">${obraSocial}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px 0; color: #666;">Cuota mensual</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1a1a2e; font-size: 18px;">
                $${monto.toLocaleString("es-AR")} ARS
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Inicio</td>
              <td style="padding: 8px 0; font-weight: bold;">${fechaInicio}</td>
            </tr>
          </table>
        </div>

        <p>Adjunto a este correo encontrás el <strong>contrato de afiliación</strong> con todos los términos y condiciones.</p>

        <div style="background: #e8f4e8; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px;">
            📞 <strong>Contacto:</strong> WhatsApp 3734-409813 (Baldovino Ángel)<br/>
            🌐 <strong>Web:</strong> evenser.vercel.app
          </p>
        </div>

        <p style="font-size: 13px; color: #999;">
          Los débitos se realizarán automáticamente cada mes desde tu cuenta de Mercado Pago.
          Podés cancelar cuando quieras desde los detalles de tu suscripción en Mercado Pago.
        </p>
      </div>

      <div style="background: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #999;">
        © 2026 Evenser — Eventos y Servicios Sociales
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: emailDestino,
    subject: `¡Bienvenido/a a Evenser, ${nombre}! — Tu contrato de afiliación`,
    html,
    attachments: [
      {
        filename: "Contrato Evenser 2026.pdf",
        content: contratoPdf,
        contentType: "application/pdf",
      },
    ],
  });

  console.log("[Email] Contrato enviado a:", emailDestino);
}

// ============================================================
// Aviso de alta pagada — se dispara en el primer pago confirmado
// de un cliente nuevo (ver webhook de Mercado Pago).
// ============================================================

export async function enviarEmailNotificacionAngel(params: {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  localidad: string;
  obraSocial?: string | null;
  monto: number;
}) {
  const { nombre, apellido, dni, telefono, localidad, obraSocial, monto } =
    params;

  const plan =
    obraSocial && obraSocial.trim() !== ""
      ? "Plan con Obra Social"
      : "Plan sin Obra Social";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <div style="background: #16241d; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Evenser</h1>
        <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">Aviso interno — Nuevo pago confirmado</p>
      </div>
      <div style="padding: 24px;">
        <p>Se confirmó el primer pago de un nuevo afiliado. Datos para el contacto:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:6px 0;color:#666;width:40%;">Nombre</td><td style="padding:6px 0;font-weight:bold;">${apellido}, ${nombre}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">DNI</td><td style="padding:6px 0;font-weight:bold;">${dni}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Teléfono</td><td style="padding:6px 0;font-weight:bold;">${telefono}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Localidad</td><td style="padding:6px 0;font-weight:bold;">${localidad}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Plan</td><td style="padding:6px 0;font-weight:bold;">${plan}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Cuota</td><td style="padding:6px 0;font-weight:bold;">$${monto.toLocaleString("es-AR")} ARS</td></tr>
        </table>
        <p style="font-size: 14px; color: #444;">Ponete en contacto para avanzar con el contrato.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ANGEL_EMAIL || "balgim73@gmail.com",
    subject: `🆕 Nuevo afiliado pagó: ${apellido}, ${nombre}`,
    html,
  });

  console.log("[Email] Aviso de alta enviado a Ángel");
}

export async function enviarEmailBienvenidaCliente(params: {
  emailDestino: string;
  nombre: string;
}) {
  const { emailDestino, nombre } = params;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <div style="background: #16241d; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Evenser</h1>
        <p style="color: #aaa; margin: 4px 0 0;">Eventos y Servicios Sociales</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #16241d;">¡Bienvenido/a a Evenser, ${nombre}!</h2>
        <p>Recibimos tu pago y tu afiliación quedó registrada.</p>
        <p><strong>Un representante se pondrá en contacto contigo para llevar adelante el contrato.</strong></p>
        <div style="background: #f5f5f0; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 14px;">
          📞 <strong>Contacto:</strong> WhatsApp 3734-409813 (Baldovino Ángel)<br/>
          🌐 <strong>Web:</strong> evenser.vercel.app
        </div>
      </div>
      <div style="background: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #999;">
        © 2026 Evenser — Eventos y Servicios Sociales
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: emailDestino,
    subject: `¡Bienvenido/a a Evenser, ${nombre}!`,
    html,
  });

  console.log("[Email] Bienvenida enviada a:", emailDestino);
}
