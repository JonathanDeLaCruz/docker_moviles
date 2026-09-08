# Corrección 03 - Agregar Swagger UI para documentar la API de Directus

## Objetivo

Directus genera automáticamente una especificación **OpenAPI** de la API disponible en el proyecto.

La especificación puede consultarse desde:

```text
http://localhost:8000/server/specs/oas
```

Sin embargo, este endpoint devuelve la especificación en formato JSON y no una interfaz gráfica.

Para disponer de una herramienta similar a Swagger en FastAPI, se agregará **Swagger UI** como un nuevo servicio dentro de Docker Compose.

Al finalizar, la documentación interactiva estará disponible en:

```text
http://localhost:8081
```

---

## 1. Agregar CORS a Directus

Abre:

```text
docker-compose.yml
```

Localiza el servicio:

```yaml
api:
```

Dentro de `environment`, agrega:

```yaml
CORS_ENABLED: "true"
CORS_ORIGIN: "true"
```

La configuración del servicio `api` deberá quedar de forma similar a:

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

    CORS_ENABLED: "true"
    CORS_ORIGIN: "true"

  volumes:
    - directus_uploads:/directus/uploads
    - directus_extensions:/directus/extensions

  depends_on:
    db:
      condition: service_healthy

  networks:
    - moviles
```

### ¿Por qué se necesita CORS?

Swagger UI se abrirá desde:

```text
http://localhost:8081
```

mientras que Directus se ejecuta en:

```text
http://localhost:8000
```

Aunque ambos servicios se ejecutan en la misma computadora, el navegador los considera orígenes diferentes debido a que utilizan puertos distintos.

Por esta razón, Directus debe permitir las peticiones realizadas desde Swagger UI.

La configuración:

```yaml
CORS_ORIGIN: "true"
```

se utiliza en este entorno local de desarrollo para permitir las peticiones necesarias.

En un entorno de producción se deben restringir los orígenes permitidos.

---

## 2. Agregar Swagger UI a Docker Compose

En `docker-compose.yml`, agrega un nuevo servicio llamado:

```text
swagger
```

Debe encontrarse al mismo nivel que:

```text
db
cloudbeaver
api
mobile
```

Agrega:

```yaml
swagger:
  image: swaggerapi/swagger-ui:latest
  container_name: moviles-swagger
  restart: unless-stopped

  ports:
    - "8081:8080"

  environment:
    SWAGGER_JSON_URL: "http://localhost:8000/server/specs/oas"

  depends_on:
    - api

  networks:
    - moviles
```

---

## 3. Configuración de Swagger UI

La variable:

```yaml
SWAGGER_JSON_URL: "http://localhost:8000/server/specs/oas"
```

indica a Swagger UI dónde se encuentra la especificación OpenAPI generada por Directus.

Directus proporciona automáticamente:

```text
/server/specs/oas
```

para obtener la especificación de la API del proyecto.

La dirección completa desde Windows es:

```text
http://localhost:8000/server/specs/oas
```

### ¿Por qué se utiliza `localhost` y no `api`?

En otros servicios Docker utilizamos nombres como:

```text
db
api
```

para comunicarnos entre contenedores.

En este caso Swagger UI carga la especificación desde el navegador del usuario.

Por esta razón debe utilizar:

```text
localhost:8000
```

y no:

```text
api:8055
```

El navegador de Windows no conoce los nombres internos utilizados por la red de Docker.

---

## 4. Estructura de servicios

Después de agregar Swagger UI, Docker Compose tendrá los siguientes servicios:

```text
Docker Compose
│
├── db
│   └── MariaDB
│
├── cloudbeaver
│   └── CloudBeaver
│
├── api
│   └── Directus
│
├── swagger
│   └── Swagger UI
│
└── mobile
    └── Ionic
```

La arquitectura general será:

```text
                    ┌───────────────┐
                    │  Swagger UI   │
                    │ Puerto 8081   │
                    └───────┬───────┘
                            │
                            │ OpenAPI
                            ▼
┌───────────────┐     ┌───────────────┐
│     Ionic     │────▶│    Directus   │
│ Puerto 8100   │HTTP │ Puerto 8000   │
└───────────────┘     └───────┬───────┘
                              │
                              │ SQL
                              ▼
                       ┌───────────────┐
                       │    MariaDB    │
                       └───────────────┘
                              ▲
                              │
                       ┌──────┴────────┐
                       │ CloudBeaver   │
                       │ Puerto 8978   │
                       └───────────────┘
```

---

## 5. Validar `docker-compose.yml`

Antes de levantar los servicios, ejecuta:

```powershell
docker compose config
```

Si el archivo está correctamente escrito, Docker mostrará la configuración procesada sin errores.

---

## 6. Crear el servicio y actualizar Directus

Como se modificó la configuración de Directus y se agregó Swagger UI, ejecuta:

```powershell
docker compose up -d --force-recreate api swagger
```

Este comando recreará únicamente:

```text
api
swagger
```

No es necesario eliminar ni reconstruir MariaDB, CloudBeaver o Ionic.

---

## 7. Verificar los contenedores

Ejecuta:

```powershell
docker compose ps
```

Deberán aparecer los servicios principales:

```text
moviles-db
moviles-cloudbeaver
moviles-api
moviles-swagger
moviles-ionic
```

---

## 8. Verificar OpenAPI de Directus

Antes de abrir Swagger UI, comprueba que Directus esté generando correctamente la especificación.

Abre:

```text
http://localhost:8000/server/specs/oas
```

El navegador deberá mostrar un documento JSON correspondiente a la especificación OpenAPI del proyecto.

Directus genera esta especificación de manera dinámica según el esquema y los permisos disponibles.

---

## 9. Abrir Swagger UI

Abre:

```text
http://localhost:8081
```

Swagger UI cargará la especificación obtenida desde Directus.

Desde esta interfaz se podrán consultar los endpoints disponibles de la API.

Por ejemplo, para una colección llamada:

```text
productos
```

pueden aparecer operaciones relacionadas con:

```text
/items/productos
/items/productos/{id}
```

Las operaciones disponibles dependerán de las colecciones y permisos configurados en Directus.

---

## 10. Relación entre Directus, OpenAPI y Swagger UI

Es importante diferenciar las tres partes:

### Directus

Es el backend que proporciona la API.

```text
http://localhost:8000
```

### OpenAPI

Es la descripción de la API generada por Directus.

```text
http://localhost:8000/server/specs/oas
```

### Swagger UI

Es la interfaz gráfica que interpreta la especificación OpenAPI.

```text
http://localhost:8081
```

El flujo es:

```text
Directus
   │
   │ genera
   ▼
OpenAPI
   │
   │ es interpretado por
   ▼
Swagger UI
```

Swagger UI no reemplaza a Directus.

Su función es documentar y facilitar la consulta y prueba de los endpoints disponibles.

---

## 11. Permisos de Directus

La especificación OpenAPI generada por Directus toma en cuenta los permisos disponibles para quien realiza la petición.

Por esta razón, una colección puede no aparecer o mostrar únicamente determinadas operaciones si no tiene los permisos correspondientes.

Si una colección debe poder consultarse sin autenticación, revisa sus permisos públicos desde Directus.

Por ejemplo, para permitir una consulta pública mediante:

```text
GET /items/productos
```

la colección `productos` debe contar con el permiso de lectura correspondiente.

---

## 12. Revisar los logs de Swagger UI

Si Swagger UI no inicia correctamente:

```powershell
docker compose logs -f swagger
```

Para revisar Directus:

```powershell
docker compose logs -f api
```

---

## 13. Problemas comunes

### Swagger UI muestra un error al cargar la definición

Comprueba primero:

```text
http://localhost:8000/server/specs/oas
```

Si esta dirección no responde correctamente, el problema se encuentra en Directus y no en Swagger UI.

### Error relacionado con CORS

Comprueba que el servicio `api` tenga:

```yaml
CORS_ENABLED: "true"
CORS_ORIGIN: "true"
```

Después recrea Directus:

```powershell
docker compose up -d --force-recreate api
```

### Swagger UI sigue mostrando otra API

Recrea el servicio:

```powershell
docker compose up -d --force-recreate swagger
```

Después vuelve a abrir:

```text
http://localhost:8081
```

---

## 14. Servicios disponibles después de la corrección

| Servicio | Tecnología | Dirección |
| --- | --- | --- |
| Aplicación móvil | Ionic | `http://localhost:8100` |
| Backend | Directus | `http://localhost:8000` |
| Especificación API | OpenAPI de Directus | `http://localhost:8000/server/specs/oas` |
| Documentación interactiva | Swagger UI | `http://localhost:8081` |
| Administrador de base de datos | CloudBeaver | `http://localhost:8978` |

---

## Resultado

Después de esta modificación, el entorno contará con una interfaz gráfica para consultar la API generada por Directus.

La arquitectura del proyecto queda formada por:

```text
Ionic
  │
  ▼
Directus
  │
  ▼
MariaDB

CloudBeaver  -> Administración de MariaDB
Swagger UI  -> Documentación de la API de Directus
```
