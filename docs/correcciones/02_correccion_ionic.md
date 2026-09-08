# Corrección de Ionic

## Cambio de Angular a Ionic

El problema que se resolvió era que los cambios realizados en los archivos del proyecto no se reflejaban automáticamente mientras el contenedor estaba en ejecución. Además, el entorno ahora trabaja con **Ionic 8**, **Angular 20**, **Capacitor 8**, **NgModules** y recarga automática.

## 1. Modificar `docker-compose.yml`

En el servicio `mobile`, agrega las siguientes variables de entorno:

```yaml
environment:
  CHOKIDAR_USEPOLLING: "true"
  WATCHPACK_POLLING: "true"
```

Estas variables permiten detectar cambios en los archivos cuando el proyecto se ejecuta dentro de Docker, especialmente en Windows.

## 2. Detener el servicio `mobile`

Desde la carpeta donde se encuentra `docker-compose.yml`, ejecuta:

```powershell
docker compose stop mobile
```

## 3. Eliminar el contenedor del servicio `mobile`

```powershell
docker compose rm -f mobile
```

Este comando elimina únicamente el contenedor asociado al servicio `mobile`.

## 4. Eliminar el contenido de la carpeta `mobile`

Elimina el contenido actual de la carpeta `mobile` para generar nuevamente el proyecto Ionic desde cero.

## 5. Crear el archivo `Dockerfile`

Dentro de la carpeta `mobile`, crea el archivo:

```text
Dockerfile
```

con el siguiente contenido:

```dockerfile
FROM node:22-alpine

RUN apk add --no-cache git \
    && npm install -g @ionic/cli

WORKDIR /app

EXPOSE 8100

ENV NG_CLI_ANALYTICS=false
ENV CI=true

CMD ["sh", "-c", "\
set -e; \
\
if [ ! -f package.json ]; then \
  echo 'Creando proyecto Ionic 8 Tabs...'; \
\
  rm -rf /tmp/ionic-starters; \
  git clone --depth 1 https://github.com/ionic-team/starters.git /tmp/ionic-starters; \
\
  echo 'Copiando base oficial de Ionic Angular...'; \
  cp -a /tmp/ionic-starters/angular/base/. /app/; \
\
  echo 'Agregando starter oficial Ionic Tabs...'; \
  cp -a /tmp/ionic-starters/angular/official/tabs/src/app/. /app/src/app/; \
\
  rm -rf /tmp/ionic-starters; \
\
  cd /app; \
\
  echo 'Configurando proyecto...'; \
  npm pkg set name='moviles'; \
\
  node -e "\
    const fs = require('fs'); \
    const config = JSON.parse(fs.readFileSync('ionic.config.json', 'utf8')); \
    config.name = 'moviles'; \
    config.type = 'angular'; \
    config.integrations = { capacitor: {} }; \
    fs.writeFileSync('ionic.config.json', JSON.stringify(config, null, 2) + '\\n'); \
  "; \
\
  echo 'Instalando Ionic 8 + Angular 20...'; \
  npm install; \
\
  echo 'Instalando Capacitor 8...'; \
  npm install --save-exact \
    @capacitor/core@8 \
    @capacitor/android@8 \
    @capacitor/ios@8 \
    @capacitor/app@8 \
    @capacitor/haptics@8 \
    @capacitor/keyboard@8 \
    @capacitor/status-bar@8; \
\
  npm install --save-dev --save-exact @capacitor/cli@8; \
\
  echo 'Configurando Capacitor...'; \
  npx cap init Moviles mx.edu.moviles --web-dir=www; \
fi; \
\
cd /app; \
\
if [ ! -d node_modules/@ionic/angular ]; then \
  echo 'Instalando dependencias...'; \
  npm install; \
fi; \
\
echo 'Iniciando Ionic...'; \
exec ionic serve \
  --external \
  --port=8100 \
  --no-open \
  -- \
  --poll=1000 \
"]
```

El parámetro:

```text
--poll=1000
```

hace que Ionic revise los cambios de los archivos cada segundo, permitiendo la recarga automática del proyecto dentro del contenedor.

## 6. Construir nuevamente el contenedor

Construye el servicio `mobile` sin utilizar la caché:

```powershell
docker compose build --no-cache mobile
```

## 7. Levantar el servicio `mobile`

```powershell
docker compose up -d mobile
```

## 8. Revisar los logs

```powershell
docker compose logs -f mobile
```

## 9. Verificar que Ionic esté funcionando

Cuando aparezca un mensaje similar al siguiente, el contenedor estará listo:

```text
moviles-ionic  | [INFO] Development server running!
moviles-ionic  |
moviles-ionic  |        Local: http://localhost:8100
moviles-ionic  |        External: http://172.18.0.4:8100
moviles-ionic  |
moviles-ionic  |        Use Ctrl+C to quit this process
moviles-ionic  |
moviles-ionic  | [ng]   ➜  Local:   http://localhost:8100/
moviles-ionic  | [ng]   ➜  Network: http://172.18.0.4:8100/
moviles-ionic  | [ng] ❯ Changes detected. Rebuilding...
```

La aplicación puede abrirse desde:

```text
http://localhost:8100
```

La dirección `172.18.0.4` corresponde a una dirección interna de la red de Docker y puede cambiar entre ejecuciones.

## 10. Nomenclatura de las páginas

Durante el curso se utilizará la siguiente nomenclatura:

| Operación | Nomenclatura | Ejemplo con `productos` | Uso |
| --- | --- | --- | --- |
| `GET` | `tabla-list` | `productos-list` | Mostrar todos los registros |
| `GET` con ID | `tabla-view` | `productos-view` | Mostrar un registro específico |
| `POST` y `PATCH` | `tabla-form` | `productos-form` | Crear y modificar registros reutilizando el mismo formulario |

La palabra `tabla` representa el nombre real de la colección o tabla que se esté utilizando.

Por ejemplo, para la colección:

```text
productos
```

se utilizarán las páginas:

```text
productos-list
productos-view
productos-form
```

## 11. Crear la página `productos-list`

El proyecto está configurado para trabajar con **NgModules** y generar las páginas con:

```typescript
standalone: false
```

Por lo tanto, durante el curso no se utilizarán componentes standalone.

Desde la carpeta donde se encuentra `docker-compose.yml`, ejecuta:

```powershell
docker compose exec mobile ionic g page productos-list
```

Ionic generará una estructura similar a:

```text
src/app/productos-list/
├── productos-list-routing.module.ts
├── productos-list.module.ts
├── productos-list.page.html
├── productos-list.page.scss
├── productos-list.page.spec.ts
└── productos-list.page.ts
```

En `productos-list.page.ts`, el componente generado deberá contener una configuración similar a:

```typescript
@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.page.html',
  styleUrls: ['./productos-list.page.scss'],
  standalone: false,
})
```

No es necesario agregar `standalone: false` manualmente, ya que el proyecto está configurado para generar las páginas utilizando NgModules.