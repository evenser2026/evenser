# EVENSER — Backlog & Task Tracker
> Fuente de verdad del estado de tareas. Leer antes de cada sesión.
> `- [x]` = completado | `- [ ]` = pendiente | `- [-]` = en progreso
> Arquitectura y decisiones de diseño → ver EVENSER_MASTER.md

---

## 🚀 PRÓXIMAS TAREAS PRIORITARIAS

### 🔴 P0 — Crítico
1. [x] Sincronizar `types/index.ts` con schema real → faltan tipos para `events`, `supplies`, `cemetery_plots`, `cemetery_sections`, `supply_movements`
2. [x] Verificar que `app/admin/fallecidos` funciona con tabla `deceased_records` real
3. [x] Verificar que `app/admin/mascotas` funciona con tabla `pet_cremations` real
4. [x] Fix warning useEffect en `app/admin/contabilidad/page.tsx` línea 52

### 🟠 P1 — Alto (esta semana)
5. [ ] Módulo Eventos completo → UI para `events` + `event_images` + `event_services` + `event_inquiries`
6. [x] Módulo Insumos completo → UI para `supplies` + `supply_movements` (stock, alertas mínimo)
7. [ ] Módulo Cementerio → UI para `cemetery_sections` + `cemetery_plots` (visual de parcelas)
8. [x] Suscripciones MP completas → flujo alta/baja/pausa con `suscripciones_mp`
9. [ ] Export Excel → base de datos de clientes completa

### 🟡 P2 — Medio (próximas 2 semanas)
10. [ ] Notificaciones push completas → UI de suscripción + envío desde admin
11. [ ] Front para clientes → portal externo (ver estado de cuenta, pagos)
12. [ ] Asilos / RAM → convenio tipo `residencia_adultos` con flujo específico
13. [ ] Reportes ampliados → ingresos por categoría, stock de insumos, eventos por mes

### 🟢 P3 — Bajo (cuando haya tiempo)
14. [ ] Parque privado → sección "próximamente" en el front de clientes
15. [ ] Construcción de panteones → módulo de obras/presupuestos
16. [ ] Paginación en listados → clientes, pagos, servicios
17. [ ] Auditoría de acciones → log de quién hizo qué (usando `profiles`)

---

## 🐛 BUGS PENDIENTES POR MÓDULO

### contabilidad
- [x] **[MEDIO]** Warning useEffect missing dependency `load` en `app/admin/contabilidad/page.tsx:52`

### types/index.ts
- [x] **[ALTO]** `Convenio` no tiene campo `descripcion` ni `localidad` ni `direccion` ni `email` → están en DB pero no en el tipo
- [x] **[ALTO]** Faltan interfaces: `Event`, `EventImage`, `EventService`, `EventInquiry`, `CemeterySection`, `CemeteryPlot`, `Supply`, `SupplyMovement`
- [ ] **[MEDIO]** `ContractModification` tiene `campo` y `valor_anterior`/`valor_nuevo` → DB tiene `campo_anterior`, `campo_nuevo`, `tipo`, `descripcion`, `usuario_id`
- [x] **[MEDIO]** `PetCremation` usa `mascota_especie` y `mascota_raza` → DB tiene `especie` y `raza`
- [x] **[MEDIO]** `AccountingEntry` tiene `cerrado: boolean` → no existe en DB
- [x] **[BAJO]** `localidad_enum` en tipos no incluye `Lapachito` ni `Capitán Solari`

### contratos_insumos.ts
- [ ] **[MEDIO]** `registrarModificacion` y `registerContractModification` usan campos viejos (`campo`, `valor_anterior`, `valor_nuevo`, `usuario_email`) → DB tiene `campo_anterior`, `campo_nuevo`, `tipo`, `descripcion`, `usuario_id`

### supabase/schema.sql
- [ ] **[BAJO]** `schema.sql` está desactualizado → usar `schema_real.sql` como referencia

---

## 📝 LOG DE CAMBIOS

| Fecha | Cambio | Archivo | Estado |
|-------|--------|---------|--------|
| 2026-06-10 | Creación de EVENSER_MASTER.md con arquitectura completa | EVENSER_MASTER.md | ✅ |
| 2026-06-10 | Export schema real desde Supabase producción | supabase/schema_real.sql | ✅ |
| 2026-06-10 | Creación de TASKS.md | TASKS.md | ✅ |
| 2026-06-10 | Sincronizar types/index.ts con schema real — 8 interfaces nuevas, 5 corregidas | types/index.ts | ✅ |
| 2026-06-10 | Fix campos desincronizados en contabilidad, fallecidos, mascotas | app/admin/*/page.tsx | ✅ |
| 2026-06-10 | Fix campos fallecidos/mascotas — validations, actions, forms sincronizados | múltiples | ✅ |
| 2026-06-10 | Módulo Insumos — actions, validations, UI completa, sidebar | lib/actions/insumos.ts, app/admin/insumos/ | ✅ |
| 2026-06-10 | Suscripciones MP — pausar/reactivar, página global /admin/suscripciones, sidebar | múltiples | ✅ |
| 2026-06-11 | Notificaciones Telegram — pagos, altas, morosos | lib/telegram.ts, lib/actions/pagos.ts, lib/actions/clientes.ts, app/api/cron/check-payments/route.ts | ✅ |
