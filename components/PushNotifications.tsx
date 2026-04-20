"use client";
import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { suscribirPush, desuscribirPush } from "@/lib/actions/push";

export default function PushNotifications({
  clienteId,
}: {
  clienteId?: string;
}) {
  const [estado, setEstado] = useState<"idle" | "activo" | "bloqueado">("idle");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "denied") setEstado("bloqueado");
  }, []);

  const activar = async () => {
    if (!("serviceWorker" in navigator)) return;
    setCargando(true);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        setEstado("bloqueado");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      await suscribirPush(sub.toJSON() as PushSubscriptionJSON, clienteId);
      setEstado("activo");
    } finally {
      setCargando(false);
    }
  };

  const desactivar = async () => {
    setCargando(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await desuscribirPush(sub.endpoint);
        await sub.unsubscribe();
      }
      setEstado("idle");
    } finally {
      setCargando(false);
    }
  };

  if (!("Notification" in window)) return null;

  return (
    <button
      onClick={estado === "activo" ? desactivar : activar}
      disabled={cargando || estado === "bloqueado"}
      title={
        estado === "bloqueado"
          ? "Notificaciones bloqueadas en el navegador"
          : estado === "activo"
            ? "Desactivar notificaciones"
            : "Activar notificaciones"
      }
      className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
    >
      {estado === "activo" ? (
        <>
          <BellOff size={14} /> Notificaciones activas
        </>
      ) : (
        <>
          <Bell size={14} /> Activar notificaciones
        </>
      )}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const bytes = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    bytes[i] = rawData.charCodeAt(i);
  }
  return bytes;
}
