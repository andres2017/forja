# Forja Rayo ⚡

**Cotizaciones profesionales en minutos, no en horas.**

Forja Rayo nació de una necesidad real: las pymes colombianas pierden tiempo y dinero armando cotizaciones en Word o Excel, con errores de IVA, formatos inconsistentes y una imagen poco profesional frente al cliente.

Esta no es solo la solución a un reto de inteligencia artificial.  
Es una herramienta pensada para que **cualquier empresa** (pequeña, mediana o emprendedor) pueda generar cotizaciones limpias, correctas y listas para enviar por WhatsApp o correo… usando simplemente un archivo Excel o la interfaz web.

---

## ¿Qué problema resuelve?

| Antes | Con Forja Rayo |
|-------|----------------|
| Armar cotización en Word/Excel toma 15-40 minutos | Cotización lista en menos de 2 minutos |
| Errores frecuentes de IVA y totales | Cálculo automático y exacto del IVA 19% |
| Cada documento se ve diferente | Plantilla profesional y consistente |
| Difícil de compartir por WhatsApp | PDF listo para enviar |
| Datos desordenados | Clientes, productos e historial centralizados |

---

## Características principales

- **Configuración de empresa** (nombre, NIT, dirección, teléfono)
- **Clientes** — crear, listar y reutilizar
- **Productos / Servicios** — con precio y control de IVA
- **Cotizaciones** con:
  - Selección de cliente
  - Ítems con cantidad, precio y descuento
  - Cálculo en vivo de subtotal, IVA 19% y total
  - Observaciones / condiciones comerciales
- **PDF profesional** listo para compartir
- **Historial** de todas las cotizaciones
- **Importación masiva desde Excel** (ideal para cargar catálogo y clientes de una vez)

---

## Cómo usarlo en tu empresa (paso a paso)

### 1. Configura tu empresa
Ve a la sección **Empresa** y completa los datos de tu compañía. Estos aparecerán en el encabezado de cada PDF.

### 2. Carga tus clientes y productos
Puedes crearlos uno a uno o importar un Excel completo desde la misma sección **Empresa → Cargar dataset de prueba**.

### 3. Genera una cotización
1. Clic en **+ Nueva cotización**
2. Elige el cliente
3. Agrega productos con cantidad y descuento (si aplica)
4. Revisa los totales (se calculan automáticamente)
5. Escribe las condiciones comerciales
6. Genera el PDF y envíalo por WhatsApp o correo

### 4. Consulta el historial
Todas las cotizaciones quedan guardadas. Puedes volver a generar el PDF cuando lo necesites.

---

## Cómo instalarlo en tu computador (desarrollo local)

### Requisitos
- Node.js 18 o superior
- Cuenta gratuita en [Supabase](https://supabase.com)
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/andres2017/forja.git
cd forja

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crea un archivo .env.local con:
# NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# 4. Arrancar
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Cómo publicarlo en internet (Deploy en Vercel) — paso a paso

Cualquier persona puede dejar Forja Rayo funcionando en internet en menos de 10 minutos, sin pagar nada al inicio.

### Paso 1 — Tener el código en GitHub
Si aún no lo tienes, sube el proyecto a un repositorio de GitHub (como este).

### Paso 2 — Crear cuenta en Vercel
1. Entra a [https://vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub (es lo más rápido)

### Paso 3 — Importar el proyecto
1. En el dashboard de Vercel haz clic en **Add New… → Project**
2. Selecciona el repositorio `forja` (o el nombre que le hayas puesto)
3. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 4 — Configurar las variables de entorno
Antes de hacer el deploy, agrega estas dos variables:

| Nombre | Valor |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | La URL de tu proyecto en Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La anon key de Supabase |

(Las encuentras en Supabase → Project Settings → API)

### Paso 5 — Desplegar
1. Haz clic en **Deploy**
2. Espera 1-2 minutos
3. Vercel te dará una URL pública tipo:  
   `https://forja-rayo.vercel.app`

¡Listo! Ya puedes compartir el enlace con tu equipo o usarlo desde el celular.

### Paso 6 — (Opcional) Dominio propio
En Vercel → Settings → Domains puedes conectar un dominio como `cotizaciones.tuempresa.com`.

---

## Base de datos (Supabase)

Tablas mínimas necesarias:

- `empresas`
- `clientes`
- `productos`
- `cotizaciones`
- `cotizacion_items`

El cálculo del IVA se realiza en el frontend y se guarda el resultado final para que el PDF siempre sea consistente y sin sorpresas.

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Base de datos | Supabase (PostgreSQL) |
| PDF | @react-pdf/renderer |
| Importación Excel | xlsx |
| Deploy | Vercel |

---

## Estructura del proyecto

```
forja/
├── data/                          # Dataset de prueba Excel
├── src/
│   ├── app/
│   │   ├── clientes/              # CRUD de clientes
│   │   ├── productos/             # CRUD de productos
│   │   ├── cotizaciones/          # Nueva cotización + PDF
│   │   ├── empresa/               # Configuración + importación Excel
│   │   └── page.tsx               # Historial de cotizaciones
│   ├── components/
│   ├── lib/
│   │   ├── pdf/                   # Plantilla del PDF
│   │   └── supabase.ts
│   └── types/
└── README.md
```

---

## ¿Por qué existe este proyecto?

Porque muchas empresas en Colombia (y en Latinoamérica) siguen perdiendo tiempo y dinero en algo que debería ser simple: **enviar una cotización profesional y correcta**.

Forja Rayo no pretende reemplazar un ERP.  
Pretende ser la herramienta que usas el mismo día que la descubres, sin cursos, sin consultores y sin complicaciones.

Si eres dueño de una pyme, comercial o emprendedor: este sistema está pensado para ti.

---

## Desarrollado por

**Andrés Vargas**  
Ingeniero de Sistemas  

📱 WhatsApp / Teléfono: **310 817 5926**  
✉️ Correo: **andres9304v@gmail.com**  

Si te gusta la herramienta y quieres adaptarla a tu empresa, agregar funcionalidades (facturación, inventario, múltiples usuarios, integraciones, etc.) o necesitas ayuda para implementarla, **escríbeme**. Estoy disponible para proyectos y contrataciones.

---

## Licencia

Uso libre para fines comerciales y educativos.  
Si lo usas en tu empresa, solo te pedimos que lo disfrutes y que les hagas la vida más fácil a tus clientes.
