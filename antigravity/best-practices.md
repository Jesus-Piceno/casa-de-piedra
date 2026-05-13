# Best Practices — Next.js Real Estate Applications

> Buenas prácticas, recomendaciones e ideas para aplicaciones de venta de bienes raíces construidas con Next.js.

---

## 🏗️ Arquitectura y Estructura del Proyecto

- Utiliza el **App Router** de Next.js (carpeta `app/`) para aprovechar React Server Components, layouts anidados y streaming.
- Organiza el proyecto por **features/dominio** (ej. `app/properties/`, `app/agents/`, `app/search/`) en lugar de por tipo de archivo.
- Separa claramente los **Server Components** (fetching de datos, lógica de negocio) de los **Client Components** (interactividad, estado local).
- Marca con `"use client"` únicamente los componentes que lo necesiten; mantén el mayor número posible de componentes en el servidor.
- Crea un directorio `lib/` para lógica reutilizable (clientes de base de datos, helpers, validaciones).
- Usa un directorio `types/` o `interfaces/` con tipos TypeScript globales para entidades como `Property`, `Agent`, `Filter`, etc.

---

## 🔍 Búsqueda y Filtros de Propiedades

- Implementa los filtros de búsqueda como **URL Search Params** (`?type=casa&minPrice=500000`) para que sean compartibles, indexables y compatibles con el botón "Atrás" del navegador.
- Usa `useSearchParams` en Client Components y lee los params directamente desde `searchParams` prop en Server Components/Pages.
- Aplica **debounce** en inputs de texto libre (nombre, colonia, etc.) para evitar peticiones excesivas.
- Cachea los resultados de búsqueda frecuentes usando `unstable_cache` o **React Query** en el lado cliente.
- Considera integrar **Algolia** o **Typesense** para búsquedas full-text avanzadas sobre grandes volúmenes de propiedades.

---

## 🗄️ Base de Datos y Fetching de Datos

- Realiza todos los fetches de datos en **Server Components** para evitar exponer credenciales al cliente.
- Utiliza **Supabase** (o cualquier Postgres) con Row Level Security (RLS) para proteger datos sensibles.
- Implementa **paginación en el servidor** (cursor-based o offset) desde el primer día para manejar crecimiento del catálogo.
- Usa `Promise.all()` para fetches paralelos independientes (ej. cargar propiedad + agente + propiedades relacionadas al mismo tiempo).
- Define un cliente de Supabase singleton para el servidor (`lib/supabase/server.ts`) y otro para el cliente (`lib/supabase/client.ts`).
- Nunca expongas la `service_role` key de Supabase en el cliente; solo usa la `anon` key pública.

---

## 🖼️ Imágenes y Multimedia

- Usa **siempre** el componente `<Image />` de Next.js para optimización automática de imágenes (WebP, lazy loading, tamaños responsivos).
- Define los dominios externos de imágenes (ej. Supabase Storage, Cloudinary) en `next.config.js` bajo `images.remotePatterns`.
- Crea **galerías de fotos** con lazy loading y soporte para modo lightbox/fullscreen.
- Comprime y optimiza las imágenes antes de subirlas al storage (usa herramientas como Sharp o servicios como Cloudinary con transformaciones automáticas).
- Incluye atributos `alt` descriptivos en todas las imágenes para SEO y accesibilidad.
- Usa `priority` en la imagen principal de la propiedad (hero image) para mejorar el LCP (Largest Contentful Paint).

---

## 🗺️ Mapas y Geolocalización

- Integra **Google Maps** o **Mapbox** para mostrar ubicaciones de propiedades con marcadores interactivos.
- Carga los componentes de mapa con `dynamic(() => import(...), { ssr: false })` para evitar errores de hidratación (los mapas requieren `window`).
- Almacena coordenadas (latitud/longitud) en la base de datos para cada propiedad y usa la extensión **PostGIS** si necesitas búsquedas geoespaciales (ej. "propiedades en un radio de 5 km").
- Implementa clustering de marcadores para zonas con alta densidad de propiedades.
- Permite al usuario buscar propiedades directamente desde el mapa (modo "buscar al mover el mapa").

---

## ⚡ Performance y SEO

- Genera páginas de propiedades individuales con **Static Site Generation (SSG)** o **ISR (Incremental Static Regeneration)** para las más populares.
- Usa `generateStaticParams` para pre-renderizar las propiedades más visitadas en build time.
- Configura `revalidate` en ISR según la frecuencia de actualización del catálogo (ej. `revalidate: 3600` para 1 hora).
- Implementa **metadata dinámica** por propiedad (`generateMetadata`) con título, descripción, Open Graph e imágenes para compartir en redes sociales.
- Añade **Schema.org** structured data (JSON-LD) del tipo `RealEstateListing` para mejorar la visibilidad en Google.
- Usa **sitemap.xml** dinámico (`app/sitemap.ts`) que incluya todas las URLs de propiedades activas.
- Genera un `robots.txt` que bloquee rutas privadas (dashboard, admin) y permita las páginas públicas.

---

## 🎨 UI/UX y Diseño

- Diseña las tarjetas de propiedades con información esencial visible sin hacer scroll: precio, superficie, habitaciones, baños y ubicación.
- Implementa un **modo de vista** dual: cuadrícula (grid) y lista, guardando la preferencia del usuario en `localStorage`.
- Usa **Skeleton Loaders** (en lugar de spinners) mientras carga el listado de propiedades para una mejor experiencia percibida.
- Aplica **Optimistic UI** al guardar propiedades en favoritos para respuesta inmediata.
- Asegúrate de que todos los colores, tipografías y espaciados sean consistentes con el design system definido en `guidelines.md`.
- Implementa filtros con un panel lateral colapsable en desktop y un bottom sheet en mobile.
- Muestra el precio siempre en el formato local correcto usando `Intl.NumberFormat`.

---

## 🔐 Autenticación y Autorización

- Usa **Supabase Auth** (o NextAuth.js) para manejar sesiones de usuarios (compradores, vendedores, agentes).
- Protege rutas privadas (ej. `/dashboard`, `/favorites`) con middleware de Next.js (`middleware.ts`).
- Diferencia roles: visitante anónimo, comprador registrado, agente inmobiliario, administrador.
- Implementa **OAuth** (Google, Facebook) como método de login rápido para reducir fricción en el registro.
- Nunca realices verificaciones de autorización solo en el frontend; valida siempre en el servidor o en las RLS policies.

---

## 📦 Estado Global y Favoritos

- Usa **URL State** para filtros de búsqueda (no Zustand ni Context para este caso).
- Usa **Zustand** o **Context API** solo para estado verdaderamente global y ligero (ej. carrito de favoritos, preferencias de UI).
- Persiste favoritos en la base de datos para usuarios autenticados y en `localStorage` para anónimos, fusionando al hacer login.
- Implementa **React Query** (TanStack Query) para el fetching del lado cliente cuando necesites cache, revalidación automática o paginación infinita.

---

## 🧪 Calidad de Código y Testing

- Usa **TypeScript** estricto (`"strict": true`) para tipado completo de todas las entidades y API responses.
- Escribe pruebas unitarias con **Vitest** o **Jest** para funciones de utilidad (formateo de precios, filtros, helpers de fecha).
- Implementa pruebas de integración con **Playwright** para flujos críticos: búsqueda de propiedad → ver detalle → contactar agente.
- Configura **ESLint** con las reglas de `eslint-config-next` y añade **Prettier** para formato consistente.
- Usa **Husky** + **lint-staged** para ejecutar linters y formateadores antes de cada commit.

---

## 🚀 Deployment y Monitoreo

- Despliega en **Vercel** para aprovechar integración nativa con Next.js (Edge Network, preview deployments, analytics).
- Configura **variables de entorno** correctamente: `.env.local` para desarrollo, variables en Vercel para producción.
- Activa **Vercel Analytics** y **Speed Insights** para monitorear métricas reales de usuarios (LCP, CLS, INP).
- Configura alertas en **Sentry** para capturar errores en producción tanto en servidor como en cliente.
- Usa **Vercel Preview Deployments** para revisar cambios antes de mergear a `main`.

---

## 🔗 Slugs y URLs Amigables

- Genera un **slug legible** para cada propiedad a partir de sus atributos: `casa-3-recamaras-lomas-verdes-naucalpan` en lugar de `/properties/12345`.
- Combina tipo de inmueble + características clave + colonia/ciudad para crear slugs únicos y descriptivos que Google pueda indexar significativamente.
- Usa una librería como **`slugify`** para normalizar el texto (eliminar acentos, espacios y caracteres especiales):
  ```ts
  import slugify from "slugify";
  const slug = slugify(`${type}-${bedrooms}-recamaras-${neighborhood}`, {
    lower: true,
    strict: true,
    locale: "es",
  });
  ```
- Guarda el slug en la base de datos como columna **única e indexada** para garantizar consultas rápidas por URL.
- Configura la ruta dinámica en Next.js como `app/propiedades/[slug]/page.tsx` para que el slug sea parte de la URL pública.
- Usa `generateStaticParams` para pre-renderizar los slugs de las propiedades activas más visitadas en build time.
- Si una propiedad cambia de nombre o se elimina, implementa **redirecciones 301** en `next.config.js` o mediante la tabla de redirecciones en base de datos para preservar el SEO acumulado.
- Evita slugs duplicados añadiendo un sufijo numérico corto cuando sea necesario (ej. `casa-jardines-2`).
- Incluye el slug en la metadata dinámica (`generateMetadata`) y en las URLs canónicas (`<link rel="canonical" />`).

---

## 🧭 Breadcrumbs (Migas de Pan)

- Implementa breadcrumbs en todas las páginas de detalle e internas para mejorar la navegación del usuario y la comprensión jerárquica del sitio por parte de los buscadores.
- Ejemplo de jerarquía recomendada para bienes raíces:
  ```
  Inicio > Propiedades > Casas en venta > CDMX > Lomas Verdes > Casa 3 recámaras
  ```
- Añade **Schema.org `BreadcrumbList`** como JSON-LD en cada página para que Google muestre la ruta en los resultados de búsqueda:
  ```tsx
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://tudominio.com" },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: "https://tudominio.com/propiedades" },
      { "@type": "ListItem", position: 3, name: "Casas en venta en CDMX", item: "https://tudominio.com/propiedades/casas/cdmx" },
      { "@type": "ListItem", position: 4, name: "Casa 3 recámaras Lomas Verdes" },
    ],
  };
  ```
- Crea un **componente `<Breadcrumb />`** reutilizable que reciba un array de `{ label, href }` y renderice tanto el HTML semántico (`<nav aria-label="breadcrumb">`) como el JSON-LD.
- Construye los breadcrumbs de forma **dinámica en el Server Component** de cada página para garantizar que coincidan con los datos reales de la propiedad.
- Usa el elemento `<nav>` con `aria-label="breadcrumb"` y lista `<ol>` con items `<li>` para cumplir con estándares de accesibilidad (WCAG).
- Separa los items visualmente con un separador (`/`, `›`, `→`) que **no sea parte del texto enlazado** para lectores de pantalla.
- El último item del breadcrumb (página actual) **no debe ser un enlace** y debe tener `aria-current="page"`.
- Considera filtros de categoría como breadcrumbs intermedios: `Propiedades > Casas > En venta > CDMX`, lo que también crea URLs de categoría indexables.

---

## 💡 Ideas y Features Recomendadas

- **Tour virtual 360°**: integra vistas panorámicas con librerías como `react-photo-sphere-viewer`.
- **Comparador de propiedades**: permite seleccionar hasta 3 propiedades y ver sus características lado a lado.
- **Calculadora de hipoteca**: input de precio, enganche y plazo que calcula la mensualidad estimada en tiempo real.
- **Alertas por email**: notificaciones cuando se publique una propiedad que coincida con los filtros guardados del usuario (usando Resend o SendGrid).
- **Chat con el agente**: integra un chat en tiempo real usando Supabase Realtime o Crisp.
- **Historial de precios**: gráfica que muestre la evolución del precio de una propiedad a lo largo del tiempo.
- **Propiedades similares**: sección al final del detalle con recomendaciones basadas en tipo, zona y rango de precio.
- **Modo oscuro**: ofrece soporte opcional con `next-themes` respetando la preferencia del sistema operativo.
