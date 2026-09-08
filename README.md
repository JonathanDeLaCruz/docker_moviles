# Desarrollo de Aplicaciones Móviles - Entorno Docker

Este repositorio contiene el entorno de desarrollo utilizado en la materia **Desarrollo de Aplicaciones Móviles**.

El objetivo es que todos los estudiantes trabajen con el mismo entorno, las mismas herramientas y las mismas versiones, evitando problemas de configuración local como diferencias entre versiones de Node.js, Ionic, bases de datos o dependencias.

El entorno completo se ejecuta mediante **Docker Compose**.

---

## Tecnologías utilizadas

| Tecnología | Función |
| --- | --- |
| **Docker** | Ejecutar y aislar los servicios del proyecto |
| **Docker Compose** | Administrar todos los contenedores como un solo entorno |
| **Ionic 8** | Desarrollo de la aplicación móvil |
| **Angular 20** | Framework utilizado por Ionic |
| **Capacitor 8** | Integración de la aplicación con Android, iOS y funcionalidades nativas |
| **Directus** | Backend y API REST |
| **OpenAPI** | Especificación de la API generada por Directus |
| **Swagger UI** | Documentación interactiva de la API |
| **MariaDB** | Base de datos |
| **CloudBeaver** | Administración gráfica de MariaDB |

---

## Arquitectura

El proyecto utiliza una arquitectura separada por servicios.

```text
                    ┌──────────────────────────────┐
                    │         Swagger UI           │
                    │ Documentación de la API      │
                    │ Puerto 8081                  │
                    └──────────────┬───────────────┘
                                   │
                                   │ OpenAPI
                                   ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│           Ionic              │   │          Directus            │
│ Ionic 8 + Angular 20         │──▶│ Backend / API REST           │
│ Capacitor 8                  │   │ Puerto 8000                  │
│ Puerto 8100                  │   └──────────────┬───────────────┘
└──────────────────────────────┘                  │
                                                 │ SQL
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │          MariaDB             │
                                  │ Base de datos                │
                                  │ Puerto interno 3306          │
                                  └──────────────┬───────────────┘
                                                 ▲
                                                 │
                                  ┌──────────────┴───────────────┐
                                  │        CloudBeaver           │
                                  │ Administración de BD         │
                                  │ Puerto 8978                  │
                                  └──────────────────────────────┘
```

### Ionic

Ionic contiene la aplicación que utilizará el usuario.

Durante el desarrollo puede visualizarse desde el navegador, pero el proyecto está preparado para trabajar como aplicación móvil mediante **Capacitor**, permitiendo posteriormente generar aplicaciones para Android e iOS y utilizar funcionalidades nativas del dispositivo.

### Directus

Directus funciona como backend del proyecto.

Se conecta directamente con MariaDB y genera una API a partir de las colecciones y tablas disponibles en la base de datos.

Por esta razón no es necesario desarrollar y mantener una API independiente dentro del repositorio.

### OpenAPI y Swagger UI

Directus genera automáticamente una especificación **OpenAPI** de la API disponible en el proyecto.

La especificación puede consultarse en:

```text
http://localhost:8000/server/specs/oas
```

Swagger UI utiliza esta especificación para proporcionar una interfaz gráfica en la que se pueden consultar y probar los endpoints disponibles.

Swagger UI se encuentra disponible en:

```text
http://localhost:8081
```

La especificación generada por Directus depende del esquema y de los permisos disponibles en el proyecto.

### MariaDB

MariaDB almacena la información utilizada por la aplicación.

Los datos se conservan mediante un volumen de Docker, por lo que detener o recrear un contenedor no elimina automáticamente la base de datos.

### CloudBeaver

CloudBeaver proporciona una interfaz gráfica para consultar y administrar MariaDB sin instalar un administrador de bases de datos directamente en Windows.

---

## Docker

Cada tecnología se ejecuta en su propio contenedor.

```text
Docker Compose
│
├── mobile
│   └── Ionic
│
├── api
│   └── Directus
│
├── swagger
│   └── Swagger UI
│
├── db
│   └── MariaDB
│
└── cloudbeaver
    └── CloudBeaver
```

Los servicios pueden comunicarse entre sí utilizando la red interna creada por Docker Compose.

Por ejemplo, Directus y CloudBeaver se conectan a MariaDB utilizando:

```text
Host: db
Puerto: 3306
```

El nombre `db` corresponde al nombre del servicio definido en `docker-compose.yml`.

---

## Estructura general

```text
docker_moviles/
├── database/
│   └── init/
│
├── docs/
│   ├── correcciones/
│   └── manuales/
│
├── mobile/
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

### `database`

Contiene los archivos necesarios para inicializar la base de datos.

### `mobile`

Contiene el proyecto Ionic.

### `docs`

Contiene la documentación utilizada durante el curso.

```text
docs/
├── correcciones/
└── manuales/
```

---

## Requisitos

Para trabajar con este repositorio se requiere:

- Docker Desktop
- Visual Studio Code
- Git

No es necesario instalar directamente en Windows:

- Node.js
- npm
- Ionic CLI
- Angular CLI
- Capacitor
- MariaDB
- Directus
- Swagger UI
- CloudBeaver
- XAMPP

Las herramientas necesarias se ejecutan dentro de Docker.

---

## Descargar el proyecto

```powershell
git clone https://github.com/JonathanDeLaCruz/docker_moviles.git
```

Entrar al proyecto:

```powershell
cd docker_moviles
```

---

## Primera ejecución

Desde la carpeta donde se encuentra `docker-compose.yml`:

```powershell
docker compose up --build
```

La primera ejecución puede tardar algunos minutos porque Docker debe descargar las imágenes y preparar las dependencias necesarias.

---

## Ejecuciones posteriores

Para iniciar los servicios:

```powershell
docker compose up
```

Para ejecutarlos en segundo plano:

```powershell
docker compose up -d
```

---

## Servicios disponibles

| Servicio | Dirección |
| --- | --- |
| Ionic | `http://localhost:8100` |
| Directus | `http://localhost:8000` |
| OpenAPI de Directus | `http://localhost:8000/server/specs/oas` |
| Swagger UI | `http://localhost:8081` |
| CloudBeaver | `http://localhost:8978` |

MariaDB se utiliza principalmente mediante la red interna de Docker.

---

## Acceso inicial a Directus

```text
Correo: admin@moviles.local
Contraseña: admin123
```

Directus se conecta a MariaDB mediante:

```text
Host: db
Puerto: 3306
Base de datos: moviles
Usuario: moviles
Contraseña: moviles123
```

---

## Conexión de CloudBeaver

Para conectarse a MariaDB desde CloudBeaver:

```text
Host: db
Puerto: 3306
Base de datos: moviles
Usuario: moviles
Contraseña: moviles123
```

Dentro de Docker no debe utilizarse `localhost` para comunicarse con MariaDB.

`localhost` hace referencia al propio contenedor, mientras que `db` permite localizar el contenedor de MariaDB dentro de la red de Docker Compose.

---

## Documentación interactiva de la API

Directus genera la especificación OpenAPI del proyecto en:

```text
http://localhost:8000/server/specs/oas
```

Swagger UI utiliza esta especificación y presenta la documentación desde:

```text
http://localhost:8081
```

La relación es:

```text
Directus
   │
   │ genera
   ▼
OpenAPI
   │
   │ interpreta
   ▼
Swagger UI
```

Swagger UI no reemplaza a Directus. Su función es facilitar la consulta y prueba de la API que Directus genera.

---

## Recarga automática de Ionic

El entorno está configurado para detectar los cambios realizados en los archivos del proyecto mientras Ionic se ejecuta dentro de Docker.

En `docker-compose.yml` se utilizan:

```yaml
environment:
  CHOKIDAR_USEPOLLING: "true"
  WATCHPACK_POLLING: "true"
```

Ionic también utiliza:

```text
--poll=1000
```

Esto permite detectar modificaciones realizadas desde Windows y reconstruir automáticamente la aplicación.

En los logs puede aparecer:

```text
Changes detected. Rebuilding...
```

---

## NgModules y componentes standalone

Angular permite trabajar con componentes standalone o con componentes organizados mediante NgModules.

Este proyecto utiliza **NgModules**, por lo que los componentes generados utilizan:

```typescript
standalone: false
```

Esta configuración se mantiene para trabajar con una estructura uniforme durante el curso.

---

## Consultar el estado de los servicios

```powershell
docker compose ps
```

---

## Consultar logs

Todos los servicios:

```powershell
docker compose logs -f
```

Ionic:

```powershell
docker compose logs -f mobile
```

Directus:

```powershell
docker compose logs -f api
```

Swagger UI:

```powershell
docker compose logs -f swagger
```

MariaDB:

```powershell
docker compose logs -f db
```

CloudBeaver:

```powershell
docker compose logs -f cloudbeaver
```

---

## Detener los servicios

Para detener los contenedores sin eliminarlos:

```powershell
docker compose stop
```

Para volver a iniciarlos:

```powershell
docker compose start
```

---

## Eliminar los contenedores

```powershell
docker compose down
```

Este comando elimina los contenedores y la red creada por Docker Compose, pero no elimina los volúmenes nombrados.

Para eliminar también los volúmenes:

```powershell
docker compose down -v
```

> **Importante:** `docker compose down -v` elimina los datos persistentes almacenados en los volúmenes del proyecto, incluida la información de MariaDB.

---

## Reconstruir Ionic

Si se modifica el `Dockerfile` de `mobile`:

```powershell
docker compose build --no-cache mobile
```

Después:

```powershell
docker compose up -d mobile
```

Para revisar el inicio:

```powershell
docker compose logs -f mobile
```

---

## Flujo general de la aplicación

La comunicación principal del proyecto será:

```text
Usuario
   │
   ▼
Ionic
   │
   │ HTTP / JSON
   ▼
Directus
   │
   │ SQL
   ▼
MariaDB
```

Ionic no debe acceder directamente a MariaDB.

La aplicación se comunica con Directus mediante HTTP y Directus se encarga del acceso a la base de datos, permisos y exposición de la API.

De forma complementaria:

```text
CloudBeaver -> Administración de MariaDB
Swagger UI -> Documentación y pruebas de la API
```

---

## Consideraciones

El entorno está diseñado para evitar instalaciones y configuraciones diferentes entre estudiantes.

La idea principal es:

```text
Clonar repositorio
       │
       ▼
docker compose up --build
       │
       ▼
Entorno listo
```

Las versiones y configuraciones del proyecto deben mantenerse de forma uniforme para que el mismo código funcione de la misma manera en todos los equipos.

---

## Licencia

Este proyecto está bajo la licencia MIT.

## Autor

**DSC. Jonathan De La Cruz Alvarez**
