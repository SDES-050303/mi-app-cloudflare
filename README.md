# Infraestructura para el desarrollo continuo

Aplicación web de ejemplo (React + TypeScript + Vite) desplegada en **Cloudflare Workers** con despliegue continuo desde **GitHub**. Para un despliegue fácil, el proyecto se creó y modificó con ayuda de IA (Claude).

**Sitio en línea:** https://mi-app-cloudflare.sergio-elizondo.workers.dev

## Cómo funciona

```
Tu computadora --git push--> GitHub --(Workers Builds)--> Cloudflare Workers --> sitio en línea
```

Cada vez que se hace `git push` a la rama `main`, Cloudflare descarga el repositorio, ejecuta el build y publica la nueva versión automáticamente.

## Estructura del proyecto

| Ruta | Descripción |
| --- | --- |
| `src/` | Interfaz en React (`App.tsx` es la página principal) |
| `worker/index.ts` | Worker de Cloudflare: responde la ruta `/api/` |
| `wrangler.jsonc` | Configuración del Worker (nombre, assets, observabilidad) |
| `vite.config.ts` | Configuración de Vite y del plugin de Cloudflare |

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior y npm
- [Git](https://git-scm.com/)
- Cuenta gratuita de [GitHub](https://github.com/) y de [Cloudflare](https://dash.cloudflare.com/sign-up)

## Instructivo paso a paso

### 1. Crear el repositorio en GitHub

Crea un repositorio nuevo (público o privado) y clónalo:

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

### 2. Crear el proyecto con la CLI de Cloudflare

Este proyecto se generó con:

```bash
npm create cloudflare@latest -- mi-app-cloudflare --framework=react
```

También existen guías para Vue, SvelteKit, Next.js, Astro y React Router en la [documentación de Cloudflare](https://developers.cloudflare.com/workers/framework-guides/).

### 3. Probar en local

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

### 4. Subir el código a GitHub

```bash
git add .
git commit -m "Primer commit"
git push -u origin main
```

### 5. Desplegar en Cloudflare

1. Crea tu cuenta en [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. Ve a **Build → Compute → Workers & Pages**.
3. Haz clic en **Create application → Import a repository**.
4. Conecta tu cuenta de GitHub y selecciona este repositorio.
5. Configura:
   - **Project name:** el mismo `name` que aparece en `wrangler.jsonc` (`mi-app-cloudflare`)
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
6. Haz clic en **Deploy**.

### 6. Revisar los logs y visitar la aplicación

- En el Worker, abre **Deployments / Builds** para ver el log del build.
- En **Observability → Logs** puedes ver los logs de la aplicación en ejecución.
- Abre la URL `https://<nombre-del-worker>.<tu-subdominio>.workers.dev`.
- Prueba el Worker haciendo clic en el botón **Name from API is:** o entrando a `/api/`.

### 7. Modificar con IA y volver a desplegar

1. Pídele a una IA (por ejemplo Claude) el cambio que quieres, como cambiar el título, agregar una sección o ampliar la respuesta de `/api/`.
2. Revisa los cambios y pruébalos con `npm run dev`.
3. Súbelos:

   ```bash
   git add .
   git commit -m "Describe tu cambio"
   git push
   ```

4. Cloudflare detecta el push, vuelve a compilar y publica solo. Recarga el sitio (Ctrl+F5) para ver los cambios.

## Comandos útiles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Compila la aplicación para producción |
| `npm run lint` | Revisa el código con Oxlint |
| `npm run deploy` | Compila y despliega manualmente con Wrangler |

## Problemas comunes

- **El build falla por el nombre:** el nombre del proyecto en Cloudflare debe coincidir con `name` en `wrangler.jsonc`.
- **No veo los cambios:** espera a que termine el build en **Deployments** y recarga con Ctrl+F5.
- **`git push` pide credenciales:** inicia sesión con tu cuenta de GitHub en la ventana que se abre.
