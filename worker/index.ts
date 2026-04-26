declare const self: ServiceWorkerGlobalScope;

ctx.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    ctx.registration.showNotification(data.title ?? "Evenser", {
      body: data.body ?? "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url ?? "/admin/dashboard" },
    }),
  );
});

ctx.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/admin/dashboard";
  event.waitUntil(
    ctx.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const client = clients.find((c) => c.url === url && "focus" in c);
        if (client) return client.focus();
        return ctx.clients.open(url);
      }),
  );
});
