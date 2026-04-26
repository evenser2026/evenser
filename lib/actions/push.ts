"use server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

if (
  process.env.VAPID_EMAIL &&
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY
) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

export async function suscribirPush(
  subscription: PushSubscriptionJSON,
  clienteId?: string,
) {
  const supabase = createClient();
  const { p256dh, auth } = subscription.keys ?? {};
  if (!subscription.endpoint || !p256dh || !auth)
    return { error: "Datos incompletos" };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      p256dh,
      auth,
      cliente_id: clienteId ?? null,
    },
    { onConflict: "endpoint" },
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function desuscribirPush(endpoint: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);
  if (error) return { error: error.message };
  return { success: true };
}

export async function enviarNotificacion({
  titulo,
  cuerpo,
  url = "/dashboard",
  clienteId,
}: {
  titulo: string;
  cuerpo: string;
  url?: string;
  clienteId?: string;
}) {
  const supabase = createClient();

  let query = supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");
  if (clienteId) query = query.eq("cliente_id", clienteId);

  const { data: subs } = await query;
  if (!subs?.length) return { enviados: 0 };

  const payload = JSON.stringify({ title: titulo, body: cuerpo, url });
  let enviados = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        );
        enviados++;
      } catch (err: any) {
        // Suscripción expirada — limpiar
        if (err.statusCode === 410) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint);
        }
      }
    }),
  );

  return { enviados };
}
