# Casa de Piedra 🏡✨

**Casa de Piedra** es una plataforma web moderna de bienes raíces diseñada para ofrecer una experiencia premium y fluida tanto a compradores/arrendatarios como a administradores de propiedades. Desarrollada con las últimas tecnologías web como **Next.js 16**, **React 19**, **Tailwind CSS v4** y **Supabase**, esta aplicación combina un diseño visualmente impactante, mapas interactivos, soporte multiidioma completo y un potente panel de administración para la gestión de inventario.

---

## 🚀 Características Principales

* 🗺️ **Mapas Interactivos**: Integración de mapas dinámicos con Leaflet y React Leaflet para geolocalizar y explorar las propiedades de forma visual e interactiva.
* 🔍 **Filtros Avanzados de Búsqueda**: Filtrado dinámico en tiempo real por tipo de transacción (Compra/Renta), rango de precios, cantidad de recámaras, baños y amenidades específicas.
* 🌐 **Soporte Multiidioma (i18n)**: Traducción completa y fluida entre **Español e Inglés** gestionada de forma dinámica con `next-intl` en todas las rutas y vistas.
* 🔐 **Autenticación Segura**: Sistema de inicio de sesión seguro utilizando Supabase Auth, que incluye tanto autenticación tradicional (correo y contraseña) como inicios de sesión sociales (Google y GitHub).
* 🛠️ **Panel de Administración Completo**:
  * Operaciones CRUD completas para la gestión de propiedades.
  * Carga y administración optimizada de imágenes por propiedad mediante arrays de URLs.
  * Control de activación/desactivación de propiedades mediante un toggle funcional para controlar la visibilidad pública en tiempo real.
  * Configuración detallada de amenidades y características dinámicas.
* 🗄️ **Base de Datos Robusta**: Backend impulsado por PostgreSQL en Supabase, con seguridad a nivel de fila (RLS) implementada para proteger la integridad de los datos de cada rol.

---

## 🛠️ Tecnologías y Versiones

El proyecto está construido con un stack tecnológico de última generación para garantizar la máxima velocidad, estabilidad y una excelente experiencia de desarrollo:

### Core & Framework
* **Next.js**: `16.2.6` (App Router para rutas dinámicas, layouts anidados e i18n integrado)
* **React**: `19.2.4` (Aprovechando las últimas características de renderizado y estado de React 19)
* **TypeScript**: `^5` (Tipado estático seguro y robusto para todo el codebase)

### Estilos & Diseño
* **Tailwind CSS**: `^4` (La nueva generación del framework con compilación nativa ultrarrápida a nivel de CSS)
* **PostCSS**: `^4` (Integración fluida de Tailwind v4 en el pipeline de Next.js)
* **Lucide React**: `^1.14.0` (Conjunto premium de iconos vectoriales consistentes y ligeros)

### Integración de Datos, Mapas e Internacionalización
* **Supabase Client**: `^2.105.4` (Cliente oficial de Supabase para consultas, mutaciones y suscripciones)
* **Supabase SSR**: `^0.10.3` (Manejo robusto de sesiones de usuario del lado del servidor en Next.js)
* **Leaflet**: `^1.9.4` y **React Leaflet**: `^5.0.0` (Bibliotecas líderes para la visualización de mapas geográficos interactivos)
* **Next-intl**: `^4.12.0` (Internacionalización para Next.js con soporte avanzado de traducción en componentes de servidor y cliente)
* **Slugify**: `^1.6.9` (Generación automatizada de URLs amigables para optimización SEO)

---

## 📋 Requisitos Previos

Antes de inicializar el proyecto, asegúrate de tener instalado en tu sistema local:
* **Node.js**: Versión 18.0 o superior (se recomienda v20 LTS).
* **pnpm**: Gestor de paquetes recomendado para este proyecto. Si no lo tienes instalado, puedes instalarlo globalmente ejecutando:
  ```bash
  npm install -g pnpm
  ```

---

## 🔧 Inicialización y Configuración

Sigue estos sencillos pasos para poner en marcha el proyecto en tu entorno de desarrollo local:

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd casa-de-piedra
```

### 2. Instalar Dependencias
Instala todas las dependencias necesarias utilizando `pnpm` (*Nota: Conforme a las directrices de este proyecto, siempre se debe usar pnpm para instalar y gestionar librerías*):
```bash
pnpm install
```

### 3. Configurar las Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de conexión con Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 4. Iniciar el Servidor de Desarrollo
Para arrancar la aplicación en modo desarrollo local, ejecuta:
```bash
pnpm dev
```

Una vez que el servidor de desarrollo esté activo, abre tu navegador y accede a:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts Disponibles

En el proyecto puedes ejecutar los siguientes comandos utilizando `pnpm`:

* `pnpm dev`: Inicia el servidor de desarrollo local con recarga en caliente (Hot Reload).
* `pnpm build`: Compila y optimiza la aplicación para producción en la carpeta `.next`.
* `pnpm start`: Arranca el servidor de producción (debe ejecutarse después de `pnpm build`).
* `pnpm lint`: Ejecuta el validador de código ESLint para asegurar la consistencia y calidad del código.

---

## 🎨 Arquitectura del Proyecto

El proyecto está organizado bajo la estructura moderna del App Router de Next.js:

```text
casa-de-piedra/
├── app/                  # Rutas, páginas y layouts del servidor de Next.js estructuradas por idiomas
├── components/           # Componentes de UI reutilizables (tarjetas de propiedades, filtros, mapas, panel de admin)
├── data/                 # Archivos de datos estáticos y constantes del sistema
├── i18n/                 # Configuración de internacionalización (next-intl)
├── messages/             # Archivos de traducción localizados (es.json, en.json)
├── public/               # Recursos estáticos (imágenes, logotipos, iconos)
├── utils/                # Utilidades de ayuda, formateadores y clientes (Supabase, etc.)
└── package.json          # Configuración del proyecto, scripts y dependencias
```

---

Desarrollado con pasión para brindar la mejor experiencia en el sector de bienes raíces. 🏠💼
