# list de elementos con Ionic

En esta práctica se creará una página en **Ionic con Angular y TypeScript** que realizará una petición `GET` a Directus para obtener y mostrar el list de productos almacenados en MariaDB.

La colección utilizada será:

```text
productos
```

Durante el desarrollo, la API está disponible en:

```text
http://localhost:8000/items/productos
```

Actualmente devuelve información con la siguiente estructura:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Laptop",
      "descripcion": "Producto de prueba",
      "precio": "15000.00",
      "stock": 5,
      "fecha_registro": "2026-08-25T21:40:56.000Z"
    },
    {
      "id": 2,
      "nombre": "Teclado",
      "descripcion": "Producto de prueba",
      "precio": "850.00",
      "stock": 10,
      "fecha_registro": "2026-08-25T21:40:56.000Z"
    }
  ]
}
```

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Crear una página nueva utilizando NgModules.
2. Configurar la dirección de la API mediante los archivos `environment`.
3. Consultar la colección `productos` de Directus.
4. Guardar la respuesta en un arreglo tipado de TypeScript.
5. Recorrer el arreglo desde la vista HTML.
6. Mostrar los productos utilizando componentes de Ionic.

El flujo será:

```text
Ionic
  |
  | GET /items/productos
  v
Directus
  |
  v
MariaDB
```

---

## 1. Nomenclatura de las páginas

Durante el curso se utilizará la siguiente nomenclatura:

| Operación | Nomenclatura | Ejemplo con `productos` | Uso |
| --- | --- | --- | --- |
| `GET` | `tabla-list` | `productos-list` | Mostrar todos los registros |
| `GET` con ID | `tabla-view` | `productos-view` | Mostrar un registro específico |
| `POST` y `PATCH` | `tabla-form` | `productos-form` | Crear y modificar registros reutilizando el mismo formulario |

En esta práctica se realizará el list de productos, por lo que se creará:

```text
productos-list
```

---

## 2. Crear la página `productos-list`

El proyecto está configurado para trabajar con **NgModules** y generar las páginas con:

```typescript
standalone: false
```

Por lo tanto, no se utilizarán componentes standalone durante el curso.

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

En `productos-list.page.ts`, el componente generado deberá contener:

```typescript
@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.page.html',
  styleUrls: ['./productos-list.page.scss'],
  standalone: false,
})
```

No es necesario agregar `standalone: false` manualmente, ya que el proyecto está configurado para generarlo de esta manera.

---

## 3. Instalar Axios

Se utilizará **Axios** para realizar las peticiones HTTP.

Como el entorno de Ionic se ejecuta mediante Docker, Axios debe instalarse dentro del contenedor `mobile`.

Desde la carpeta donde se encuentra `docker-compose.yml`, ejecuta:

```powershell
docker compose exec mobile npm install axios
```

Este comando solo es necesario la primera vez que se agrega Axios al proyecto.

La instalación actualizará las dependencias del proyecto en:

```text
package.json
package-lock.json
```

[Axios](https://axios-http.com/es/) es un cliente HTTP basado en promesas que permite realizar peticiones HTTP desde JavaScript y TypeScript.

---

## 4. Configurar la URL de la API

No se escribirá la dirección completa de Directus directamente en cada página.

En su lugar, la URL base de la API se configurará en los archivos de entorno de Angular. Esto permitirá utilizar `localhost` durante el desarrollo y posteriormente cambiar a un dominio sin modificar las páginas de la aplicación.

Se utilizarán:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Ambos archivos tendrán una propiedad llamada:

```typescript
apiUrl
```

### 4.1. Entorno de desarrollo

Abre:

```text
src/environments/environment.ts
```

y configúralo de la siguiente manera:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'
};
```

Esta será la dirección utilizada mientras se trabaje con:

```text
http://localhost:8100
```

y Directus se encuentre disponible en:

```text
http://localhost:8000
```

### 4.2. Entorno de producción

Abre:

```text
src/environments/environment.prod.ts
```

y agrega la misma propiedad:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.midominio.com'
};
```

El dominio anterior es únicamente un ejemplo. Cuando Directus sea publicado en el servidor definitivo, deberá sustituirse por el dominio real de la API.

Por ejemplo:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.ejemplo.com'
};
```

### 4.3. ¿Cómo sabe Angular qué archivo utilizar?

El proyecto ya tiene configurado en `angular.json` el reemplazo del archivo de entorno para producción:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

Además, el servidor de desarrollo utiliza la configuración:

```text
development
```

Por lo tanto:

```text
Desarrollo
    |
    v
environment.ts
    |
    v
http://localhost:8000
```

Mientras que al generar una compilación de producción:

```text
Producción
    |
    v
environment.prod.ts
    |
    v
https://api.midominio.com
```

No será necesario cambiar los imports ni las direcciones en cada página.

> En el código de la aplicación siempre se importa `environment` desde `environment.ts`. Angular realiza automáticamente el reemplazo correspondiente durante una compilación de producción.

### 4.4. Importar `environment`

En las páginas que necesiten consumir la API se utilizará:

```typescript
import { environment } from '../../environments/environment';
```

Por ejemplo, la dirección para consultar los productos se construirá de esta forma:

```typescript
`${environment.apiUrl}/items/productos`
```

Durante el desarrollo, el resultado será:

```text
http://localhost:8000/items/productos
```

Posteriormente, en producción, podría convertirse automáticamente en:

```text
https://api.midominio.com/items/productos
```

De esta manera, el código de las páginas no necesita modificarse cuando cambie la dirección del servidor.

> La propiedad `apiUrl` debe contener únicamente la URL base. No agregues `/items/productos`, ya que la misma variable se reutilizará para todas las colecciones.

---

## 5. Verificar la API

Antes de programar la petición desde Ionic, comprueba que Directus permita consultar la colección.

Abre en el navegador:

```text
http://localhost:8000/items/productos
```

La respuesta debe ser similar a:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Laptop",
      "descripcion": "Producto de prueba",
      "precio": "15000.00",
      "stock": 5,
      "fecha_registro": "2026-08-25T21:40:56.000Z"
    },
    {
      "id": 2,
      "nombre": "Teclado",
      "descripcion": "Producto de prueba",
      "precio": "850.00",
      "stock": 10,
      "fecha_registro": "2026-08-25T21:40:56.000Z"
    }
  ]
}
```

Si Directus responde:

```text
403 Forbidden
```

deben revisarse los permisos de lectura de la colección `productos`.

### 5.1. Habilitar CORS en Directus

Aunque Directus permita consultar la colección desde el navegador, Ionic se ejecuta en:

```text
http://localhost:8100
```

mientras que Directus se encuentra en:

```text
http://localhost:8000
```

Al utilizar puertos diferentes, el navegador considera que se trata de orígenes distintos.

Por esta razón es necesario habilitar **CORS** en Directus para permitir que la aplicación Ionic pueda realizar peticiones a la API.

Abre el archivo:

```text
docker-compose.yml
```

Localiza el servicio:

```yaml
api:
```

y dentro de la sección:

```yaml
environment:
```

agrega:

```yaml
CORS_ENABLED: "true"
CORS_ORIGIN: "true"
CORS_METHODS: "GET,POST,PATCH,DELETE,OPTIONS"
CORS_ALLOWED_HEADERS: "Content-Type,Authorization"
CORS_EXPOSED_HEADERS: "Content-Range"
CORS_CREDENTIALS: "true"
```

La sección del servicio `api` deberá quedar de forma similar a:

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
    CORS_METHODS: "GET,POST,PATCH,DELETE,OPTIONS"
    CORS_ALLOWED_HEADERS: "Content-Type,Authorization"
    CORS_EXPOSED_HEADERS: "Content-Range"
    CORS_CREDENTIALS: "true"
```

Estas variables habilitan CORS en Directus y permiten las operaciones HTTP que se utilizarán durante las prácticas.

- `CORS_ENABLED` habilita CORS.
- `CORS_ORIGIN` permite solicitudes desde el origen de la aplicación durante el desarrollo.
- `CORS_METHODS` define los métodos HTTP permitidos.
- `CORS_ALLOWED_HEADERS` permite encabezados como `Content-Type` y `Authorization`.
- `CORS_EXPOSED_HEADERS` permite que el navegador tenga acceso al encabezado `Content-Range`.
- `CORS_CREDENTIALS` permite el envío de credenciales cuando sean necesarias.

---

### 5.2. Recrear el contenedor de Directus

Después de modificar `docker-compose.yml`, Directus debe volver a crear su contenedor para cargar las nuevas variables de entorno.

No es necesario reconstruir todos los servicios.

Desde la carpeta donde se encuentra:

```text
docker-compose.yml
```

ejecuta:

```powershell
docker compose up -d --force-recreate api
```

El parámetro:

```text
--force-recreate
```

obliga a Docker Compose a crear nuevamente el contenedor `api` utilizando la configuración actualizada.

Este procedimiento no elimina la base de datos ni los demás contenedores.

Para comprobar que Directus inició correctamente, puede ejecutarse:

```powershell
docker compose logs -f api
```

Una vez que Directus termine de iniciar, la aplicación Ionic podrá realizar peticiones desde:

```text
http://localhost:8100
```

hacia:

```text
http://localhost:8000
```

sin que el navegador bloquee la petición por CORS.

---

## 6. Configurar `productos-list.page.ts`

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

El código necesario se agregará en este archivo.

---

## 7. Importar Axios y `environment`

Conserva las importaciones generadas por Ionic y agrega Axios y `environment`:

```typescript
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
```

Axios realizará la petición HTTP y `environment` proporcionará la URL base de la API.

---

## 8. Crear la interfaz `Producto`

Antes de la clase `ProductosListPage`, crea la interfaz:

```typescript
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  fecha_registro: string;
}
```

Una interfaz permite definir la estructura que tendrán los objetos utilizados en TypeScript.

En este caso, un producto deberá contener:

```text
id
nombre
descripcion
precio
stock
fecha_registro
```

### Tipos de datos

Los campos `id` y `stock` se reciben como números:

```typescript
id: number;
stock: number;
```

Los campos de texto se representan mediante `string`:

```typescript
nombre: string;
descripcion: string;
```

En la respuesta actual de Directus, `precio` se recibe como:

```json
"precio": "15000.00"
```

Por esta razón se declara:

```typescript
precio: string;
```

La fecha también se recibe como una cadena en formato ISO:

```json
"fecha_registro": "2026-08-25T21:40:56.000Z"
```

por lo que se declara:

```typescript
fecha_registro: string;
```

---

## 9. Crear el arreglo de productos

Dentro de la clase `ProductosListPage`, agrega:

```typescript
productos: Producto[] = [];
```

El arreglo almacenará los productos recibidos desde Directus.

La declaración:

```typescript
Producto[]
```

indica que el arreglo solamente contendrá objetos que cumplan con la estructura definida en la interfaz `Producto`.

Esto permite aprovechar el tipado de TypeScript y evita utilizar:

```typescript
any
```

---

## 10. Configurar `ngOnInit()`

Dentro de `ngOnInit()` llama al método que cargará los productos:

```typescript
ngOnInit(): void {
  this.cargarProductos();
}
```

Angular ejecuta `ngOnInit()` cuando inicializa el componente.

Por lo tanto, al entrar a la página se realizará automáticamente la consulta de los productos.

---

## 11. Crear el método `cargarProductos()`

Dentro de la clase agrega:

```typescript
async cargarProductos(): Promise<void> {
  try {
    const response = await axios.get<{ data: Producto[] }>(
      `${environment.apiUrl}/items/productos`
    );

    this.productos = response.data.data;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}
```

### Método asíncrono

El método se declara como:

```typescript
async cargarProductos(): Promise<void>
```

`async` permite utilizar `await` dentro del método.

`Promise<void>` indica que se trata de una operación asíncrona que no devuelve un valor al código que la invoca.

### Realizar la petición GET

La petición se realiza mediante:

```typescript
axios.get(...)
```

La URL se construye utilizando:

```typescript
`${environment.apiUrl}/items/productos`
```

No se escribe:

```typescript
'http://localhost:8000/items/productos'
```

directamente en la página.

De esta manera, el mismo código funciona en desarrollo y producción.

### Respuesta de Axios y Directus

Directus devuelve:

```json
{
  "data": [
    ...
  ]
}
```

Axios también utiliza una propiedad llamada `data` para almacenar el cuerpo de la respuesta HTTP.

Por esta razón se utiliza:

```typescript
response.data.data
```

Puede interpretarse de la siguiente manera:

```text
response
   |
   └── data       <- cuerpo de la respuesta de Axios
        |
        └── data  <- arreglo enviado por Directus
```

Finalmente, el arreglo recibido se guarda en:

```typescript
this.productos = response.data.data;
```

### Manejo de errores

Si la petición falla, se ejecutará:

```typescript
catch (error) {
  console.error('Error al cargar los productos:', error);
}
```

Esto permitirá revisar el error desde la consola del navegador.

---

## 12. Código completo de `productos-list.page.ts`

El archivo deberá quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  fecha_registro: string;
}

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.page.html',
  styleUrls: ['./productos-list.page.scss'],
  standalone: false,
})
export class ProductosListPage implements OnInit {

  productos: Producto[] = [];

  constructor() {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    try {
      const response = await axios.get<{ data: Producto[] }>(
        `${environment.apiUrl}/items/productos`
      );

      this.productos = response.data.data;
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }
}
```

Este archivo utiliza **TypeScript**, no solamente JavaScript.

Algunas de las características de TypeScript utilizadas son:

```typescript
interface Producto
```

```typescript
productos: Producto[]
```

```typescript
Promise<void>
```

```typescript
axios.get<{ data: Producto[] }>()
```

Estas declaraciones permiten especificar los tipos de datos que se esperan durante la ejecución de la aplicación.

---

## 13. Configurar `productos-list.page.html`

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Reemplaza el contenido generado por Ionic por:

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Productos</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list>
    <ion-item *ngFor="let producto of productos">
      <ion-label class="ion-text-wrap">
        <h2>{{ producto.nombre }}</h2>
        <p>{{ producto.descripcion }}</p>
        <p> Precio: ${{ producto.precio }}</p>
        <p>Stock: {{ producto.stock }}</p>
        <p>Registro: {{ producto.fecha_registro | date:'yyyy-MM-dd' }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</ion-content>
```

---

## 14. Recorrer los productos con `*ngFor`

La instrucción:

```html
*ngFor="let producto of productos"
```

recorre los elementos almacenados en:

```typescript
productos: Producto[] = [];
```

En cada iteración, la variable:

```text
producto
```

representa un objeto diferente del arreglo.

Con los datos de esta práctica, primero representará:

```json
{
  "id": 1,
  "nombre": "Laptop",
  "descripcion": "Producto de prueba",
  "precio": "15000.00",
  "stock": 5,
  "fecha_registro": "2026-08-25T21:40:56.000Z"
}
```

y posteriormente:

```json
{
  "id": 2,
  "nombre": "Teclado",
  "descripcion": "Producto de prueba",
  "precio": "850.00",
  "stock": 10,
  "fecha_registro": "2026-08-25T21:40:56.000Z"
}
```

---

## 15. Interpolación `{{ }}`

Las dobles llaves permiten mostrar en el HTML valores provenientes de TypeScript.

Por ejemplo:

```html
{{ producto.nombre }}
```

Para el primer registro mostrará:

```text
Laptop
```

Para el segundo:

```text
Teclado
```

También pueden mostrarse las demás propiedades:

```html
{{ producto.descripcion }}
{{ producto.precio }}
{{ producto.stock }}
{{ producto.fecha_registro }}
```

---

## 16. Operador punto `.`

El punto permite acceder a una propiedad de un objeto.

Por ejemplo:

```typescript
producto.nombre
```

indica:

```text
Objeto: producto
Propiedad: nombre
```

Otros ejemplos son:

```typescript
producto.id
producto.descripcion
producto.precio
producto.stock
producto.fecha_registro
```

---

## 17. Formatear la fecha

Directus devuelve `fecha_registro` con un formato similar a:

```text
2026-08-25T21:40:56.000Z
```

Para mostrar únicamente el año, mes y día se utiliza el pipe `date` de Angular:

```html
{{ producto.fecha_registro | date:'yyyy-MM-dd' }}
```

El resultado será similar a:

```text
2026-08-25
```

El símbolo:

```text
|
```

permite aplicar un pipe al valor.

En este caso:

```text
fecha_registro
       |
       v
     date
       |
       v
 yyyy-MM-dd
```

---

## 18. Probar la página

Ionic genera la ruta de la nueva página al crearla.

Con la aplicación ejecutándose, abre:

```text
http://localhost:8100/productos-list
```

La página deberá mostrar información similar a:

```text
Productos

Laptop
Producto de prueba
Precio: $15000.00
Stock: 5
Registro: 2026-08-25

Teclado
Producto de prueba
Precio: $850.00
Stock: 10
Registro: 2026-08-25
```

---

## 19. Consideración sobre `localhost`

Durante el desarrollo se utiliza:

```typescript
apiUrl: 'http://localhost:8000'
```

Esto funciona cuando la aplicación Ionic se abre desde el navegador de la misma computadora donde se ejecuta Docker.

Durante estas prácticas:

```text
Ionic
http://localhost:8100

Directus
http://localhost:8000
```

Cuando la aplicación se ejecute posteriormente en un dispositivo físico, `localhost` representará al propio dispositivo y no a la computadora.

En ese escenario podrá ser necesario utilizar temporalmente la dirección IP de la computadora durante las pruebas, por ejemplo:

```typescript
apiUrl: 'http://192.168.1.50:8000'
```

Este cambio se realizaría únicamente en:

```text
environment.ts
```

y no en cada página.

Cuando Directus se publique en un servidor con dominio, la URL definitiva se configurará en:

```text
environment.prod.ts
```

Por ejemplo:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.midominio.com'
};
```

Las páginas continuarán utilizando exactamente el mismo código:

```typescript
environment.apiUrl
```

---

## 20. Flujo completo de la aplicación

Cuando el usuario entre a:

```text
productos-list
```

ocurrirá:

```text
ProductosListPage
        |
        v
    ngOnInit()
        |
        v
 cargarProductos()
        |
        v
 environment.apiUrl
        |
        v
Axios realiza GET
        |
        v
/items/productos
        |
        v
     Directus
        |
        v
     MariaDB
        |
        v
Directus devuelve JSON
        |
        v
response.data.data
        |
        v
 this.productos
        |
        v
*ngFor recorre el arreglo
        |
        v
Ionic muestra los productos
```

---

## 21. Resumen

Para mostrar todos los registros de una colección se utilizará la nomenclatura:

```text
tabla-list
```

Para la colección `productos`:

```text
productos-list
```

Los pasos realizados fueron:

1. Crear la página `productos-list`.
2. Trabajar con NgModules y `standalone: false`.
3. Instalar Axios.
4. Configurar `apiUrl` en `environment.ts`.
5. Configurar `apiUrl` en `environment.prod.ts`.
6. Importar siempre `environment` desde `environment.ts`.
7. Crear la interfaz `Producto`.
8. Crear el arreglo `productos`.
9. Ejecutar `cargarProductos()` desde `ngOnInit()`.
10. Realizar una petición `GET` a `${environment.apiUrl}/items/productos`.
11. Guardar `response.data.data` en el arreglo.
12. Recorrer los productos mediante `*ngFor`.
13. Mostrar las propiedades mediante interpolación.

La nomenclatura que se utilizará posteriormente será:

```text
productos-list  -> GET de todos los registros
productos-view  -> GET de un registro mediante ID
productos-form  -> POST y PATCH
```

La URL base de la API queda centralizada en los archivos de entorno, por lo que no será necesario modificar cada página cuando cambie la dirección del servidor.
