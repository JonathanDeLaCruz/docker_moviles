# Publicar Ionic y Directus en Rocky Linux sobre Azure

Prepararás los archivos para servir la aplicación compilada y la API mediante Nginx, con MariaDB y los volúmenes persistentes de Directus.

## 1. Antes de comenzar

Necesitas una VM de Rocky Linux ya creada, acceso SSH, dominio y certificado HTTPS. Este manual proporciona los archivos de despliegue; la creación de la VM y la emisión del certificado se realizan con tu infraestructura. Completa primero los manuales que utilizará la aplicación.

Las rutas pertenecen al proyecto Ionic en `mobile/`. Ejecuta los comandos Docker desde la carpeta que contiene `docker-compose.yml`. Al generar páginas o componentes, configura manualmente `standalone: false` en `@Component`; este curso utiliza NgModules.

## 2. Conceptos y métodos que utilizarás

| Elemento | Uso | Resultado |
| --- | --- | --- |
| Compilación de producción | `ng build --configuration production` | Genera los archivos de Ionic. |
| Nginx | Sirve archivos y reenvía `/api/`. | Publica aplicación y API en un dominio. |
| Docker Compose | Define `web`, `api` y `db`. | Administra los servicios. |
| Volúmenes | Conservan base, archivos y extensiones. | Mantienen datos entre reinicios. |
| TLS | Certificado del dominio. | Habilita HTTPS. |

## 3. Implementación paso a paso

### Paso 1. Preparar Rocky Linux

En una máquina virtual ya disponible, con acceso SSH y permisos de administración, ejecuta:

```bash
sudo dnf -y install dnf-plugins-core git firewalld
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo systemctl enable --now firewalld
```

Las instrucciones de instalación corresponden a la [documentación de Rocky Linux](https://docs.rockylinux.org/gemstones/containers/docker/).

### Paso 2. Preparar red y dominio

En el grupo de seguridad de red de la VM de Azure permite SSH desde tu equipo y tráfico web en 80 y 443, según las [reglas de conexión de Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/linux-vm-connect). Apunta el dominio de la aplicación a su IP pública. En Rocky Linux ejecuta:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Paso 3. Descargar y configurar

```bash
git clone https://github.com/JonathanDeLaCruz/docker_moviles.git
cd docker_moviles
cp docs/manuales/recursos/despliegue/.env.example docs/manuales/recursos/despliegue/.env
```

Completa `.env` con tu dominio y credenciales propias. En `mobile/src/environments/environment.prod.ts`, configura `apiUrl: '/api'` junto a `production: true`. La aplicación y la API compartirán el dominio.

### Paso 4. Colocar el certificado

Crea `docs/manuales/recursos/despliegue/certs/` y coloca el certificado válido del dominio como `fullchain.pem` y su clave como `privkey.pem`. Estos archivos corresponden al certificado emitido para tu dominio y se montan en Nginx.

### Paso 5. Construir y arrancar

Desde la raíz del repositorio ejecuta:

```bash
sudo docker compose --env-file docs/manuales/recursos/despliegue/.env -f docs/manuales/recursos/despliegue/compose.yaml config --quiet
sudo docker compose --env-file docs/manuales/recursos/despliegue/.env -f docs/manuales/recursos/despliegue/compose.yaml up -d --build
```

Después abre `https://TU_DOMINIO/api/admin`, configura el modelo y las políticas de los manuales que vayas a utilizar y carga sus datos de práctica. El SQL inicial prepara `productos`; las relaciones adicionales corresponden a sus manuales.

### Paso 6. Conservar datos y consultar el servicio

Los volúmenes `datos`, `archivos` y `extensiones` conservan la base y los recursos de Directus. Para consultar el estado y los mensajes de inicio utiliza el mismo comando Compose con `ps` o `logs --tail 100`.

## 4. Código completo de referencia

### `docs/manuales/recursos/despliegue/Dockerfile`

```dockerfile
FROM node:22-alpine AS compilacion
WORKDIR /app
COPY mobile/package.json mobile/package-lock.json ./
RUN npm ci
COPY mobile/ ./
RUN npx ng build --configuration production
FROM nginx:1.28-alpine
COPY --from=compilacion /app/www /usr/share/nginx/html
```

### `docs/manuales/recursos/despliegue/nginx.conf`

```nginx
server {
  listen 80;
  server_name _;
  return 301 https://$host$request_uri;
}
server {
  listen 443 ssl;
  server_name _;
  ssl_certificate /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;
  root /usr/share/nginx/html;
  index index.html;
  client_max_body_size 25m;
  location /api/ {
    proxy_pass http://api:8055/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### `docs/manuales/recursos/despliegue/compose.yaml`

```yaml
services:
  db:
    image: mariadb:11.8
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:?Define DB_ROOT_PASSWORD}
      MARIADB_DATABASE: moviles
      MARIADB_USER: moviles
      MARIADB_PASSWORD: ${DB_PASSWORD:?Define DB_PASSWORD}
    volumes:
      - datos:/var/lib/mysql
      - ../../../../database/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 5s
      retries: 20
  api:
    image: directus/directus:12.3.1
    restart: unless-stopped
    environment:
      SECRET: ${DIRECTUS_SECRET:?Define DIRECTUS_SECRET}
      ADMIN_EMAIL: ${ADMIN_EMAIL:?Define ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD:?Define ADMIN_PASSWORD}
      DB_CLIENT: mysql
      DB_HOST: db
      DB_PORT: 3306
      DB_DATABASE: moviles
      DB_USER: moviles
      DB_PASSWORD: ${DB_PASSWORD}
      PUBLIC_URL: https://${DOMAIN:?Define DOMAIN}/api
    volumes:
      - archivos:/directus/uploads
      - extensiones:/directus/extensions
    depends_on:
      db:
        condition: service_healthy
  web:
    build:
      context: ../../../..
      dockerfile: docs/manuales/recursos/despliegue/Dockerfile
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api
volumes:
  datos:
  archivos:
  extensiones:
```

### `docs/manuales/recursos/despliegue/.env.example`

```dotenv
DOMAIN=moviles.example.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=DEFINIR_UNA_CONTRASENA_PROPIA
DB_ROOT_PASSWORD=DEFINIR_CLAVE_ROOT
DB_PASSWORD=DEFINIR_CLAVE_DE_APLICACION
DIRECTUS_SECRET=DEFINIR_UN_SECRETO_ALEATORIO_DE_AL_MENOS_32_CARACTERES
```

### `mobile/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

## 5. Comprobar el resultado

1. Verifica que los tres servicios estén en ejecución con `docker compose ... ps`.
2. Abre el dominio: debe mostrar Ionic y permitir navegar directamente a una ruta interna.
3. Abre `/api/admin` e inicia sesión con la cuenta creada para ese entorno.
4. Comprueba el acceso, el listado y una operación con un registro de prueba, de acuerdo con sus políticas.
5. Verifica que las imágenes cargadas se conserven después de reiniciar los servicios.

La validación en Azure requiere la VM, el dominio y el certificado reales. La comprobación local de los archivos no acredita un despliegue remoto.

## 6. Explicación detallada del flujo

La figura 1 muestra el recorrido de arriba hacia abajo.

<p align="center">
  <img src="imagenes/flujo-16-despliegue.png" alt="Servir Ionic y Directus con HTTPS" width="390"><br>
  <em>Figura 1. Servir Ionic y Directus con HTTPS.</em>
</p>

El Dockerfile compila Ionic durante la construcción y copia `www` a la imagen que sirve Nginx. El `apiUrl` de producción dirige las peticiones a `/api` en el mismo dominio.

Nginx sirve las rutas de la aplicación con `try_files` y reenvía las peticiones de `/api/` al servicio interno de Directus. La barra final de `proxy_pass` retira ese prefijo antes de entregar la ruta a la API. Los encabezados reenviados conservan el contexto HTTPS.

Directus utiliza la base `moviles`, configurada con el mismo usuario y contraseña de MariaDB. Los servicios se comunican por la red de Compose. El entorno remoto tiene sus propias credenciales, datos y políticas. Los certificados y `.env` se mantienen en el servidor y deben renovarse según su emisor.
