# Cambio de API de FastAPI a Directus

En esta sección se describe el proceso para sustituir la API desarrollada con FastAPI por Directus dentro del entorno Docker del proyecto.

## 1. Modificar el servicio `api`

En el archivo `docker-compose.yml`, sustituir la configuración actual del servicio `api` por la siguiente:

```yaml
  api:

    image: directus/directus:latest
    container_name: moviles-api
    restart: unless-stopped

    ports:
      - "8000:8055"

    environment:
      SECRET: "moviles-directus-clave-2026"
      ADMIN_EMAIL: "admin@moviles.local"
      ADMIN_PASSWORD: "admin123"
      DB_CLIENT: "mysql"
      DB_HOST: "db"
      DB_PORT: "3306"
      DB_DATABASE: "moviles"
      DB_USER: "moviles"
      DB_PASSWORD: "moviles123"

    volumes:
      - directus_uploads:/directus/uploads
      - directus_extensions:/directus/extensions

    depends_on:
      db:
        condition: service_healthy

    networks:
      - moviles
```

Esta configuración permitirá que Directus utilice la misma base de datos MariaDB del proyecto y publique su servicio mediante el puerto `8000`.

## 2. Agregar los volúmenes de Directus

En la sección `volumes` del archivo `docker-compose.yml`, agregar los volúmenes necesarios para almacenar los archivos cargados y las extensiones de Directus:

```yaml
volumes:
  mariadb_data:
  ionic_node_modules:
  cloudbeaver_data:
  directus_uploads:
  directus_extensions:
```

## 3. Detener el contenedor anterior

Antes de levantar Directus, detener el contenedor actual de la API:

`docker stop moviles-api`

## 4. Eliminar el contenedor anterior

Una vez detenido, eliminar el contenedor para permitir que Docker cree uno nuevo utilizando la configuración de Directus:

`docker rm moviles-api`

## 5. Levantar el nuevo servicio

Finalmente, levantar nuevamente el servicio `api` utilizando Docker Compose:

`docker compose up -d api`

Al finalizar este proceso, el contenedor `moviles-api` utilizará Directus en lugar de FastAPI.
