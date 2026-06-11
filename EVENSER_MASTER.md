# EVENSER — DOCUMENTO MAESTRO DEL PROYECTO

> **Para Claude:** Leé este documento completo antes de tocar cualquier archivo.
> Contiene el estado actual, decisiones tomadas y arquitectura del sistema.
> Para tareas y bugs pendientes → ver `TASKS.md`.

---

## 1. CONTEXTO DEL PROYECTO

### Qué es
PWA de gestión funeraria para **Evenser — Eventos y Servicios Sociales**.
Opera en producción en Vercel. Mobile-first, instalable como app en el celular del operador.

### Quién lo opera
Fabricio — desarrollador y dueño del negocio. Prefiere parches quirúrgicos por consola sobre ediciones manuales. Siempre verificar líneas exactas antes de editar.

### Redes
TikTok: @evenser_ · Instagram: @evenser_Baldo · Facebook: Evenser - Eventos y Servicios Sociales

### Ruta del proyecto
~/Desktop/Documentos/TRABAJO/Evenser/evenser

---

## 2. STACK TÉCNICO

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 App Router + TypeScript |
| UI | Tailwind CSS mobile-first |
| Base de datos | Supabase (PostgreSQL + Auth + RLS) |
| Imágenes | Cloudinary (preset: `evenser_uploads`) |
| Formularios | React Hook Form + Zod |
| Pagos | Mercado Pago (suscripciones + webhooks) |
| PWA | next-pwa + service worker custom en `worker/index.ts` |
| Deploy | Vercel |

---

## 3. ESTRUCTURA DEL PROYECTO
evenser/
├── app/
│   ├── (dashboard)/
│   │   └── admin/
│   │       ├── clientes/         # Listado + detalle [id]
│   │       ├── pagos/            # Gestión de pagos
│   │       ├── servicios/        # Servicios funerarios
│   │       ├── convenios/        # Convenios empresas/municipios
│   │       ├── fallecidos/       # Flujo de fallecimiento
│   │       ├── mascotas/         # Cremación de mascotas
│   │       ├── contabilidad/     # Ingresos/egresos
│   │       ├── reportes/         # Reportes + morosidad
│   │       ├── configuracion/    # Config del sistema
│   │       └── dashboard/        # Stats en tiempo real
│   ├── api/
│   │   ├── afiliacion/           # Alta de afiliados
│   │   ├── mp/suscripcion/       # Mercado Pago suscripciones
│   │   ├── webhooks/mercadopago/ # Webhook MP pagos
│   │   └── cron/
│   │       ├── check-payments/   # Verificar pagos vencidos
│   │       └── check-vencidos/   # Verificar vencimientos
│   └── auth/login/
├── components/
│   ├── forms/                    # ClienteForm, PagoForm, ServicioForm, etc.
│   ├── layout/                   # Sidebar
│   └── ui/                       # StatCard, Badge, Modal, EmptyState, etc.
├── lib/
│   ├── actions/                  # Server Actions
│   ├── supabase/                 # Clientes browser y server
│   ├── validations.ts            # Schemas Zod
│   ├── cloudinary.ts             # Helper upload
│   └── utils.ts                  # cn(), formatCurrency(), formatDate()
├── supabase/
│   ├── schema.sql                # Schema original (desactualizado)
│   └── schema_real.sql           # Schema real exportado 2026-06-10
├── types/index.ts                # Tipos TypeScript globales
└── worker/index.ts               # Service worker custom PWA

---

## 4. SCHEMA DE BASE DE DATOS (REAL — exportado 2026-06-10)

### Tablas existentes en producción

| Tabla | Descripción |
|-------|-------------|
| `clients` | Afiliados/clientes principales |
| `family_members` | Convivientes del hogar por cliente |
| `payments` | Pagos mensuales y únicos |
| `services` | Servicios funerarios prestados |
| `agreements` | Convenios con empresas/municipios/sindicatos |
| `deceased_records` | Registro de fallecidos y servicios cubiertos |
| `pet_cremations` | Cremación de mascotas |
| `accounting_entries` | Contabilidad ingresos/egresos |
| `contract_modifications` | Historial de modificaciones de contrato |
| `events` | Eventos (empresariales, recepciones, etc.) |
| `event_images` | Imágenes de eventos en Cloudinary |
| `event_services` | Servicios incluidos en cada evento |
| `event_inquiries` | Consultas/presupuestos de eventos |
| `cemetery_sections` | Secciones del cementerio |
| `cemetery_plots` | Parcelas individuales del cementerio |
| `supplies` | Insumos/accesorios con stock |
| `supply_movements` | Movimientos de stock de insumos |
| `suscripciones_mp` | Suscripciones Mercado Pago |
| `push_subscriptions` | Suscripciones a notificaciones push |
| `profiles` | Perfil de usuarios admin |
| `app_config` | Configuración general de la app |

### ENUMs completos

```sql
localidad_enum:          Col. Elisa | La Escondida | Tirol | La Verde | Colonias Unidas | Las Garcitas | Lapachito | Capitán Solari | Otra
metodo_pago_enum:        efectivo | transferencia | mercado_pago
estado_pago_enum:        pagado | pendiente | vencido
tipo_pago_enum:          mensual | unico | prepago
tipo_servicio_enum:      traslado | servicios_de_calle | capilla_ardiente | servicio_de_sala | tramite_registro | cremacion
estado_servicio_enum:    pendiente | en_proceso | completado | cancelado
tipo_convenio_enum:      empresa | sindicato | municipio | residencia_adultos
tipo_evento_enum:        empresarial | recepcion | social | cumpleanos | casamiento | otro
estado_evento_enum:      borrador | publicado | archivado
tipo_servicio_evento_enum: sonido | iluminacion | foto | video | catering | decoracion
estado_consulta_enum:    nueva | en_contacto | presupuestada | confirmada | cancelada
estado_deceased_enum:    en_proceso | completado | cancelado
estado_parcela_enum:     libre | reservado | ocupado | mantenimiento
especie_enum:            perro | gato | ave | conejo | otro
tipo_movimiento_enum:    ingreso | egreso
categoria_movimiento_enum: cuota_mensual | servicio_funerario | cremacion_mascota | convenio | insumo | salario | alquiler | impuesto | evento | otro
categoria_insumo_enum:   ataud | urna | flores | velas | ropa | higiene | papeleria | ferreteria | otro
tipo_modificacion_enum:  cambio_plan | cambio_localidad | cambio_obra_social | alta_familiar | baja_familiar | cambio_telefono | otro
estado_parcela_enum:     libre | reservado | ocupado | mantenimiento
```

### Columnas destacadas no obvias

- `payments.insep_numero` — número de comprobante INSEP
- `payments.mp_payment_id` — ID de pago en Mercado Pago
- `payments.fecha_vence` — fecha de vencimiento del período
- `agreements.cubre_traslado/tramite/pompas` — qué cubre el convenio
- `deceased_records.es_titular` — si el fallecido es el titular o un familiar
- `deceased_records.estado_tramite` — usa estado_servicio_enum
- `suscripciones_mp.alerta_enviada` — para no duplicar alertas de vencimiento
- `cemetery_plots.seccion_id` → FK a `cemetery_sections`
- `supply_movements.tipo` — TEXT (no enum): 'entrada' | 'salida'

---

## 5. MÓDULOS — ESTADO ACTUAL

### ✅ Implementados con ruta activa
| Módulo | Ruta | Notas |
|--------|------|-------|
| Login | /auth/login | Supabase Auth |
| Dashboard | /admin/dashboard | Stats tiempo real |
| Clientes | /admin/clientes | Listado + filtros |
| Detalle cliente | /admin/clientes/[id] | Familiares, pagos, servicios |
| Pagos | /admin/pagos | Con INSEP y MP |
| Servicios funerarios | /admin/servicios | |
| Convenios | /admin/convenios | Con cubre_traslado/tramite/pompas |
| Fallecidos | /admin/fallecidos | ✅ Verificado y sincronizado con schema real |
| Mascotas | /admin/mascotas | ✅ Verificado y sincronizado con schema real |
| Contabilidad | /admin/contabilidad | ✅ Warning resuelto |
| Reportes | /admin/reportes | |
| Morosidad | /admin/reportes/morosidad | |
| Configuración | /admin/configuracion | |

### ⚠️ Creados en DB pero sin UI completa
| Módulo | Tabla | Estado |
|--------|-------|--------|
| Eventos | events + event_images + event_services + event_inquiries | Sin UI |
| Cementerio | cemetery_sections + cemetery_plots | Sin UI |
| Insumos | supplies + supply_movements | Sin UI |
| Suscripciones MP | suscripciones_mp | Endpoint creado, flujo incompleto |
| Push notifications | push_subscriptions | Endpoint creado, sin UI |

### ⬜ Pendientes
- Notificaciones push completas
- Export Excel base de datos
- Front para clientes (portal externo)
- Parque privado (sección próximamente)

---

## 6. LOCALIDADES ACTIVAS

Col. Elisa · La Escondida · Tirol · La Verde · Colonias Unidas · Las Garcitas · Lapachito · Capitán Solari

---

## 7. VARIABLES DE ENTORNO

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=evenser_uploads
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

---

## 8. REGLAS PARA CLAUDE

1. Leer `EVENSER_MASTER.md` y `TASKS.md` completos antes de tocar cualquier archivo.
2. Verificar líneas exactas antes de editar: `sed -n 'X,Yp' archivo`
3. Buscar texto antes de reemplazar: `grep -n "texto" archivo`
4. Parches quirúrgicos con `/tmp/patch.js` — nunca edición manual.
5. Verificar build después de cada cambio: `npm run build`
6. Un problema a la vez — verificado y commiteado antes del siguiente.
7. Agregar tarea a `TASKS.md` antes de resolverla.
8. Marcar `[x]` y loguear en `TASKS.md` después de resolver.
9. No deployar a Vercel sin build limpio local.
10. Schema de referencia: `supabase/schema_real.sql` — no `schema.sql`.
11. Si una tabla no está en `schema_real.sql`, no existe en producción.
12. `types/index.ts` puede estar desincronizado con la DB — verificar antes de asumir tipos.

---

## 9. COMANDOS FRECUENTES

```bash
# Posicionarse siempre primero
cd ~/Desktop/Documentos/TRABAJO/Evenser/evenser

# Desarrollo
npm run dev

# Build y tipos
npm run build
npx tsc --noEmit

# Edición quirúrgica
cat > /tmp/patch.js << 'PATCH'
const fs = require('fs');
const path = 'ruta/relativa/archivo.tsx';
let content = fs.readFileSync(path, 'utf8');
const old = `texto exacto`;
const nuevo = `texto nuevo`;
if (content.includes(old)) {
  content = content.replace(old, nuevo);
  fs.writeFileSync(path, content);
  console.log('OK');
} else {
  console.log('WARN: no encontrado');
}
PATCH
node /tmp/patch.js

# Git
git add -A && git commit -m "descripción"
git push
```

---

_Documento creado 2026-06-10. Schema exportado de Supabase producción._
