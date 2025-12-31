<p align="center">
  <a href="https://studios-tkoh.azurewebsites.net/" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1TuT30CiBkinh85WuTvjKGKN47hCyCS0Z" width="300" alt="Studios TKOH Logo">
  </a>
</p>

# KardexPro - Frontend Web App

Aplicación web progresiva (PWA-ready) para la gestión de inventarios, diseñada con un enfoque "Mobile First". Construida con **Vanilla JavaScript**, **Tailwind CSS** y desplegada automáticamente en **GitHub Pages**. Esta interfaz se conecta con la API de Gestión de Productos para realizar operaciones en tiempo real.

## ✨ Características Principales

- **Interfaz Reactiva**: Diseño moderno y fluido utilizando Tailwind CSS.
- **Gestión de Inventario**: Visualización de stock con indicadores de estado (bajo stock/estable).
- **Movimientos de Kardex**: Registro rápido de entradas y salidas de mercancía.
- **Búsqueda Instantánea**: Filtrado de productos en tiempo real sin recargar la página.
- **Reportes**: Exportación de datos a formato CSV/Excel directamente desde el navegador.
- **Estado de Conexión**: Indicador visual de conexión con la API (Online/Offline).

## 📸 Galería y Demostración

1. **Vista Principal (Inventario)**  
   Visualiza todos tus productos, el estado del stock y estadísticas rápidas.  
   <!-- Coloca aquí la foto: image_4b5123.png -->

2. **Detalle del Producto**  
   Información profunda del producto y botones de acción rápida para movimientos.  
   <!-- Coloca aquí la foto: image_4b511f.png -->

3. **Registro de Movimientos**  
   Modal intuitivo para registrar entradas o salidas de stock.  
   <!-- Coloca aquí la foto: image_4b5125.png -->

4. **Creación de Productos**  
   Formulario optimizado para añadir nuevas referencias al catálogo.  
   <!-- Coloca aquí la foto: image_4b53ca.png -->

## 🚀 Tecnologías

- **Core**: HTML5, JavaScript (ES6 Modules).
- **Estilos**: Tailwind CSS (vía CDN para desarrollo rápido).
- **Iconos**: Lucide Icons.
- **Despliegue**: GitHub Actions + GitHub Pages.
- **Arquitectura**: SPA (Single Page Application) basada en componentes funcionales.

## ⚙️ Configuración para Desarrollo Local

Dado que el proyecto usa módulos de ES6 (`<script type="module">`), necesitas servir los archivos a través de un servidor local (no puedes simplemente abrir el `index.html` haciendo doble clic).

### Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo-frontend.git
cd tu-repo-frontend
````

### Configurar Variables de Entorno:

El proyecto espera un archivo `js/env.js` que contiene la URL de tu API. Crea este archivo manualmente en la carpeta `js/`:

**Archivo**: `js/env.js`

```js
window.__ENV__ = {
    API_URL: 'http://localhost:8082/api/kardex', // Tu API local
    APP_NAME: 'Kardex Local'
};
```

### Ejecutar:

Usa cualquier servidor estático. Si tienes Python instalado:

```bash
python3 -m http.server 8000
```

O si usas la extensión **"Live Server"** de VS Code, simplemente haz clic en **"Go Live"**.

Abre tu navegador en [http://localhost:8000](http://localhost:8000).

## ☁️ Despliegue en GitHub Pages (CI/CD)

Este proyecto incluye un flujo de trabajo de **GitHub Actions** (`.github/workflows/deploy.yml`) que automatiza el despliegue y la configuración de la API.

### ¿Cómo funciona la conexión con el Backend?

GitHub Pages es estático, por lo que no puede leer variables de entorno del servidor (`.env`). Para solucionar esto, el workflow inyecta la configuración durante el despliegue:

1. Ve a tu repositorio en **GitHub** -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Crea una **Repository Secret** llamada `API_URL`.
3. Pon como valor la URL de tu backend desplegado (ej. `https://mi-api-spring.railway.app/api/kardex`).

Cada vez que hagas un **push** a la rama **main**, GitHub Actions:

* Creará automáticamente el archivo `js/env.js` con tu secreto.
* Subirá los archivos a la rama **gh-pages**.

## 📂 Estructura del Proyecto

```
/
├── css/                     # Estilos personalizados y animaciones
│   └── styles.css
├── images/                  # Logotipos y assets
├── js/
│   ├── components/          # Componentes UI (Formularios, Tablas, Modales)
│   ├── services/            # Lógica de comunicación con la API (Fetch)
│   ├── state/               # Store simple para manejo de estado
│   ├── app.js               # Controlador principal y Router
│   ├── config.js            # Lee el archivo env.js
│   └── env.js               # (Generado dinámicamente, NO subir a git)
├── .github/workflows/       # Script de despliegue automático
└── index.html               # Punto de entrada
```

---

<p align="center">
  <sub>🛠️ Desarrollado con 💙 por <strong>Studios TKOH</strong></sub><br>
</p>
