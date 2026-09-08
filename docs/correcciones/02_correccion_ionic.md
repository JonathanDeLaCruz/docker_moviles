# Corrección de Ionic

## Cambio de Angular a Ionic

El problema que se resolvió era que los cambios realizados en los archivos del proyecto no se reflejaban automáticamente mientras el contenedor estaba en ejecución. Además, el entorno ahora trabaja con **Ionic 8**, **Angular 20**, **Capacitor 8**, **NgModules** y recarga automática.

> **Importante:** en esta corrección se anexa el archivo `Dockerfile` que debe utilizarse.  
> **No copies y pegues el contenido del Dockerfile desde el manual**, ya que durante el copiado pueden modificarse caracteres, barras invertidas o saltos de línea y provocar errores.
>
> El archivo `Dockerfile` se encontrará en la misma carpeta que este documento:
>
> ```text
> docs/correcciones/
> ├── 02_correccion_ionic.md
> └── Dockerfile
> ```

---

## 1. Modificar `docker-compose.yml`

En el servicio `mobile`, agrega las siguientes variables de entorno:

```yaml
environment:
  CHOKIDAR_USEPOLLING: "true"
  WATCHPACK_POLLING: "true"
```

Estas variables permiten detectar los cambios realizados en los archivos cuando Ionic se ejecuta dentro de Docker, especialmente al trabajar en Windows.

---

## 2. Detener el servicio `mobile`

Desde la carpeta donde se encuentra `docker-compose.yml`, ejecuta:

```powershell
docker compose stop mobile
```

---

## 3. Eliminar el contenedor del servicio `mobile`

Ejecuta:

```powershell
docker compose rm -f mobile
```

Este comando elimina únicamente el contenedor correspondiente al servicio `mobile`.

---

## 4. Eliminar el volumen de `node_modules` de Ionic

Antes de volver a construir el servicio es necesario eliminar el volumen utilizado para almacenar `node_modules`.

Este paso es importante porque el volumen puede conservar dependencias de una instalación anterior, incluso si se elimina el contenido de la carpeta `mobile` o se reconstruye la imagen.

Primero localiza el nombre del volumen:

```powershell
docker volume ls --format "{{.Name}}" | findstr ionic_node_modules
```

El resultado será similar a:

```text
docker_moviles_ionic_node_modules
```

o:

```text
app_ionic_node_modules
```

El nombre depende de la carpeta o del nombre del proyecto de Docker Compose.

Elimina el volumen utilizando **exactamente el nombre que apareció en tu computadora**.

Por ejemplo:

```powershell
docker volume rm docker_moviles_ionic_node_modules
```

o:

```powershell
docker volume rm app_ionic_node_modules
```

> **No escribas uno de estos nombres si no coincide con el que aparece en tu equipo.**
>
> Este procedimiento elimina únicamente las dependencias almacenadas para Ionic. No se debe eliminar el volumen de MariaDB.

Puedes verificar nuevamente con:

```powershell
docker volume ls --format "{{.Name}}" | findstr ionic_node_modules
```

Si el volumen fue eliminado correctamente, ya no deberá aparecer.

---

## 5. Eliminar el contenido actual de la carpeta `mobile`

Elimina el contenido existente dentro de:

```text
mobile/
```

La carpeta debe quedar vacía antes de colocar el nuevo Dockerfile.

No elimines la carpeta `mobile`, solamente su contenido.

---

## 6. Utilizar el `Dockerfile` anexado

En la misma carpeta donde se encuentra este manual se proporciona el archivo:

```text
Dockerfile
```

No copies su contenido manualmente.

Copia directamente ese archivo a:

```text
mobile/Dockerfile
```

Al terminar, la carpeta deberá verse así:

```text
mobile/
└── Dockerfile
```

El Dockerfile se encargará de generar automáticamente el proyecto Ionic y las dependencias necesarias cuando se inicie el contenedor.

---

## 7. Construir nuevamente el servicio `mobile`

Desde la carpeta donde se encuentra `docker-compose.yml`, construye el servicio sin utilizar la caché:

```powershell
docker compose build --no-cache mobile
```

El parámetro:

```text
--no-cache
```

obliga a Docker a reconstruir la imagen sin reutilizar capas de construcciones anteriores.

---

## 8. Levantar el servicio `mobile`

Ejecuta:

```powershell
docker compose up -d mobile
```

Durante la primera ejecución se generará automáticamente el proyecto Ionic dentro de la carpeta `mobile`.

---

## 9. Revisar los logs

Para observar el proceso de instalación e inicio ejecuta:

```powershell
docker compose logs -f mobile
```

Durante el proceso deberán aparecer mensajes similares a:

```text
Creando proyecto Ionic 8 Tabs...
Copiando base oficial de Ionic Angular...
Agregando starter oficial Ionic Tabs...
Configurando proyecto...
Instalando Ionic 8 + Angular 20...
Instalando Capacitor 8...
Configurando Capacitor...
Iniciando Ionic...
```

La primera ejecución puede tardar varios minutos debido a que se descargan e instalan las dependencias necesarias.

---

## 10. Verificar que Ionic esté funcionando

Cuando aparezca un mensaje similar a:

```text
[INFO] Development server running!
```

Ionic estará disponible en:

```text
http://localhost:8100
```

En los logs también puede aparecer:

```text
Changes detected. Rebuilding...
```

Esto indica que la detección automática de cambios está funcionando.

---

## 11. Verificar la recarga automática

Con Ionic funcionando, modifica algún archivo `.html`, `.ts` o `.scss` dentro de:

```text
mobile/src/
```

Guarda el archivo.

En los logs deberá aparecer un mensaje similar a:

```text
Changes detected. Rebuilding...
```

y la aplicación deberá actualizarse automáticamente.

---

## 12. Nomenclatura de las páginas

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

---

## 13. Proyecto con NgModules

Durante el curso se trabajará con **NgModules** y no con componentes standalone.

En esta versión del proyecto, al generar una página con Ionic, la propiedad:

```typescript
standalone: false
```

**no se agrega automáticamente**.

Por lo tanto, después de crear una página, es necesario abrir su archivo:

```text
nombre-pagina.page.ts
```

y agregar manualmente:

```typescript
standalone: false,
```

dentro del decorador `@Component`.

Por ejemplo:

```typescript
@Component({
  selector: 'app-productos-listado',
  templateUrl: './productos-listado.page.html',
  styleUrls: ['./productos-listado.page.scss'],
  standalone: false,
})
```

Este paso debe realizarse en cada archivo `page.ts` que se genere durante el curso.

---