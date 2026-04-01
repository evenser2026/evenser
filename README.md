# Evenser — Sistema de Gestión Funeraria

PWA completa para la gestión de clientes, grupo familiar, pagos, servicios funerarios y convenios.

**Redes:** TikTok: @evenser_ · Instagram: @evenser_Baldo · Facebook: Evenser - Eventos y Servicios Sociales

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — UI mobile-first
- **Supabase** — PostgreSQL + Auth
- **Cloudinary** — gestión de imágenes
- **React Hook Form + Zod** — formularios y validación
- **PWA instalable** — soporte offline

---

## Instalación y desarrollo local

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd evenser
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local` con tus credenciales (ver secciones abajo).

### 3. Levantar en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Configuración de Supabase

### Crear proyecto

1. Andá a [supabase.com](https://supabase.com) y creá un proyecto nuevo.
2. En **Settings → API**, copiá:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Ejecutar el schema

1. En tu proyecto de Supabase, andá a **SQL Editor**.
2. Pegá y ejecutá el contenido de `supabase/schema.sql`.
3. (Opcional) Pegá y ejecutá `supabase/seed.sql` para cargar datos de prueba.

### Crear usuario de prueba

En **Authentication → Users**, creá un usuario con email y contraseña para acceder al sistema.

---

## Configuración de Cloudinary

1. Creá cuenta en [cloudinary.com](https://cloudinary.com).
2. En el dashboard copiá:
   - **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`
3. En **Settings → Upload**, creá un **Upload Preset** sin firma (unsigned) con nombre `evenser_uploads` → `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

---

## Despliegue en Vercel

```bash
npm install -g vercel
vercel
```

O conectá tu repositorio desde [vercel.com](https://vercel.com).

En **Settings → Environment Variables**, cargá todas las variables de `.env.example` con sus valores reales.

---

## Estructura del proyecto

```
evenser/
├── app/
│   ├── (dashboard)/          # Layout autenticado con sidebar
│   │   ├── dashboard/        # Página principal con stats
│   │   ├── clientes/         # Listado y detalle de clientes
│   │   ├── pagos/            # Gestión de pagos
│   │   ├── servicios/        # Gestión de servicios funerarios
│   │   ├── convenios/        # Convenios con empresas/municipios
│   │   └── reportes/         # Reportes y resúmenes
│   └── auth/login/           # Página de login
├── components/
│   ├── forms/                # ClienteForm, PagoForm, ServicioForm, etc.
│   ├── layout/               # Sidebar
│   └── ui/                   # StatCard, Badge, Modal, EmptyState, etc.
├── lib/
│   ├── actions/              # Server Actions (auth, clientes, pagos...)
│   ├── supabase/             # Clientes browser y server
│   ├── validations.ts        # Schemas Zod
│   ├── cloudinary.ts         # Helper de upload
│   └── utils.ts              # cn(), formatCurrency(), formatDate()
├── supabase/
│   ├── schema.sql            # Schema completo de la base de datos
│   └── seed.sql              # Datos de prueba
├── types/
│   └── index.ts              # Tipos TypeScript globales
└── public/
    ├── manifest.json         # PWA manifest
    └── icons/                # Íconos 192x192 y 512x512
```

---

## Funcionalidades MVP

| Módulo | Funcionalidad |
|---|---|
| Autenticación | Login/logout con Supabase Auth, rutas protegidas |
| Clientes | Alta, edición, baja lógica, filtro por localidad y búsqueda |
| Grupo familiar | Convivientes asociados al cliente con DNI, edad y parentesco |
| Pagos | Registro mensual/único, efectivo/transferencia/Mercado Pago |
| Servicios | Traslado, capilla ardiente, cremación, trámites y más |
| Convenios | Empresas, sindicatos, municipios, residencias con saldo a favor |
| Dashboard | Stats en tiempo real: clientes, morosos, ingresos del mes |
| Reportes | Clientes por localidad, servicios por tipo, morosos, ingresos |
| PWA | Instalable en móviles, service worker, soporte offline básico |
| Imágenes | Upload a Cloudinary para eventos y servicios |
