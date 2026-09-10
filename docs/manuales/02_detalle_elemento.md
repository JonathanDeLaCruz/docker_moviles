# Detalle de un elemento con Ionic

En esta práctica se creará una página en **Ionic con Angular y TypeScript** que realizará una petición `GET` a Directus para obtener y mostrar un producto específico almacenado en MariaDB.

Se continuará con el proyecto del manual 01 y la colección:

```text
productos
```

Durante el desarrollo, la dirección para consultar el producto con ID `1` será:

```text
http://localhost:8000/items/productos/1
```

La respuesta esperada tendrá la siguiente estructura:

```json
{
  "data": {
    "id": 1,
    "nombre": "Laptop",
    "descripcion": "Producto de prueba",
    "precio": "15000.00",
    "stock": 5,
    "fecha_registro": "2026-08-25T21:40:56.000Z"
  }
}
```

En el manual anterior, `data` contenía un arreglo de productos. En esta práctica contendrá un solo objeto, correspondiente al ID solicitado.

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Crear una página nueva utilizando NgModules.
2. Navegar desde el listado al detalle de un producto.
3. Enviar el ID del producto mediante la ruta.
4. Consultar un registro específico de Directus utilizando Axios y `environment`.
5. Guardar la respuesta en un objeto tipado de TypeScript.
6. Mostrar un indicador mientras se realiza la consulta.
7. Mostrar los datos utilizando componentes de Ionic.
8. Regresar al listado mediante un botón.

El flujo será: seleccionar un producto en el listado, enviar su ID a la página de detalle, consultar Directus y mostrar el registro recibido.

---

## 1. Nomenclatura de las páginas

Durante el curso se utilizará la siguiente nomenclatura:

| Operación | Nomenclatura | Ejemplo con `productos` | Uso |
| --- | --- | --- | --- |
| `GET` | `tabla-list` | `productos-list` | Mostrar todos los registros |
| `GET` con ID | `tabla-view` | `productos-view` | Mostrar un registro específico |
| `POST` y `PATCH` | `tabla-form` | `productos-form` | Crear y modificar registros reutilizando el mismo formulario |

En esta práctica se mostrará el detalle de un producto, por lo que se creará:

```text
productos-view
```

El listado del manual anterior se utilizará como punto de entrada:

```text
productos-list
```

---

## 2. Crear la página `productos-view`

El proyecto está configurado para trabajar con **NgModules** y generar las páginas con:

```typescript
standalone: false
```

Desde la carpeta donde se encuentra `docker-compose.yml`, ejecuta:

```powershell
docker compose exec mobile ionic g page productos-view
```

Ionic generará los siguientes archivos dentro de `src/app/productos-view/`:

```text
productos-view-routing.module.ts
productos-view.module.ts
productos-view.page.html
productos-view.page.scss
productos-view.page.spec.ts
productos-view.page.ts
```

En `productos-view.page.ts`, el componente generado deberá contener:

```typescript
@Component({
  selector: 'app-productos-view',
  templateUrl: './productos-view.page.html',
  styleUrls: ['./productos-view.page.scss'],
  standalone: false,
})
```

No es necesario agregar `standalone: false` manualmente si el proyecto conserva la configuración utilizada en el manual 01.

---

## 3. Revisar Axios y la URL de la API

Esta práctica reutiliza la instalación de Axios y la configuración de los archivos de entorno del manual anterior.

Si Axios ya está instalado, no es necesario instalarlo nuevamente. Si aún no se ha agregado al proyecto, ejecuta:

```powershell
docker compose exec mobile npm install axios
```

Abre:

```text
src/environments/environment.ts
```

y verifica que contenga:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'
};
```

En producción se utilizará la propiedad `apiUrl` de `environment.prod.ts`, mediante el reemplazo configurado en `angular.json` durante el manual 01.

En la página se importará siempre:

```typescript
import { environment } from '../../environments/environment';
```

> La propiedad `apiUrl` debe contener únicamente la URL base. La colección y el ID se agregarán al construir la petición.

---

## 4. Verificar la API

Antes de programar la petición desde Ionic, comprueba que exista un producto y que Directus permita consultarlo.

Abre en el navegador:

```text
http://localhost:8000/items/productos/1
```

El número `1` representa el ID del producto. Si no existe ese registro, utiliza el ID de un producto que aparezca en el listado.

La respuesta deberá contener un objeto dentro de:

```typescript
data
```

La diferencia entre ambas consultas es:

| Consulta | Ruta de Directus | Contenido de `data` |
| --- | --- | --- |
| Listado | `/items/productos` | Arreglo de productos |
| Detalle | `/items/productos/1` | Un producto |

La consulta de un registro corresponde a la operación de [obtener un elemento de Directus](https://directus.com/docs/api/items).

Si Directus rechaza la consulta, revisa el ID y los permisos de lectura de la colección `productos`.

Esta práctica utiliza el acceso sin token configurado para las consultas del manual 01. También debe conservarse la configuración de CORS para permitir peticiones desde:

```text
http://localhost:8100
```

---

## 5. Configurar la ruta con el ID

Abre:

```text
src/app/app-routing.module.ts
```

Dentro del arreglo `routes`, localiza la ruta generada para `productos-view` y reemplázala por:

```typescript
{
  path: 'productos-view/:id',
  loadChildren: () => import('./productos-view/productos-view.module').then(m => m.ProductosViewPageModule)
},
```

Conserva las demás rutas del proyecto. Si existe una ruta comodín `**`, la ruta de detalle debe colocarse antes de ella.

### Nombre de la página

La parte:

```text
productos-view
```

identifica la ruta de la página que mostrará el detalle.

### Parámetro de la ruta

La parte:

```text
:id
```

indica que la ruta recibirá un parámetro llamado `id`.

Por ejemplo, al abrir:

```text
http://localhost:8100/productos-view/1
```

el valor de `id` será:

```text
1
```

Al abrir:

```text
http://localhost:8100/productos-view/2
```

el valor será:

```text
2
```

Los dos puntos se escriben al definir la ruta. En la dirección del navegador se coloca el valor del ID.

### Ruta interna del módulo

El archivo:

```text
src/app/productos-view/productos-view-routing.module.ts
```

debe conservar la ruta vacía generada por Ionic:

```typescript
const routes: Routes = [
  {
    path: '',
    component: ProductosViewPage
  }
];
```

La ruta principal ya define `productos-view/:id`; no se debe repetir ese segmento dentro del módulo de la página.

> En esta práctica se utiliza una ruta principal, fuera de las rutas hijas de `tabs`. Ubicar una ruta en otro módulo organiza la navegación, pero no restringe por sí mismo quién puede acceder a ella.

---

## 6. Agregar el botón de detalle al listado

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Dentro del `ion-item` que recorre los productos, agrega el botón después de `ion-label`:

```html
<ion-button slot="end" [routerLink]="['/productos-view', producto.id]">
  Ver detalle
</ion-button>
```

El contenido completo del archivo quedará de forma similar a:

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
        <p>Precio: ${{ producto.precio }}</p>
        <p>Stock: {{ producto.stock }}</p>
        <p>Registro: {{ producto.fecha_registro | date:'yyyy-MM-dd' }}</p>
      </ion-label>
      <ion-button slot="end" [routerLink]="['/productos-view', producto.id]">
        Ver detalle
      </ion-button>
    </ion-item>
  </ion-list>
</ion-content>
```

### Propiedad `[routerLink]`

La instrucción:

```html
[routerLink]="['/productos-view', producto.id]"
```

construye la dirección a la que navegará la aplicación.

El primer elemento indica la ruta:

```typescript
'/productos-view'
```

El segundo proporciona el ID del producto seleccionado:

```typescript
producto.id
```

Si el producto tiene el ID `1`, la dirección resultante será:

```text
/productos-view/1
```

El botón debe permanecer dentro del `ion-item` que contiene `*ngFor`, porque allí existe la variable `producto` de cada iteración.

> `[routerLink]` utiliza las directivas de `RouterModule`. El módulo de rutas generado para el listado debe conservar su exportación de `RouterModule`.

---

## 7. Configurar `productos-view.page.ts`

Abre:

```text
src/app/productos-view/productos-view.page.ts
```

El código necesario se agregará en este archivo. Primero se explicará cada parte y después se mostrará el código completo.

---

## 8. Importar los componentes necesarios

Conserva las importaciones generadas por Ionic y agrega:

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
```

Cada importación tiene una función:

| Importación | Uso |
| --- | --- |
| `Component` | Configurar el componente de la página |
| `OnInit` | Definir el método de inicialización |
| `ActivatedRoute` | Obtener el parámetro de la ruta actual |
| `LoadingController` | Crear y controlar el indicador de carga |
| `axios` | Realizar la petición HTTP |
| `environment` | Obtener la URL base de la API |

---

## 9. Crear la interfaz `Producto`

Antes de la clase `ProductosViewPage`, crea la interfaz:

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

Esta interfaz conserva la misma estructura utilizada en el manual 01.

Los campos `id` y `stock` se reciben como números. Los campos `nombre` y `descripcion` se reciben como texto.

En la respuesta de ejemplo, el precio se recibe como una cadena:

```json
"precio": "15000.00"
```

Por esa razón se declara:

```typescript
precio: string;
```

La fecha también se recibe como una cadena en formato ISO:

```typescript
fecha_registro: string;
```

---

## 10. Crear la variable del producto

Dentro de la clase `ProductosViewPage`, agrega:

```typescript
producto: Producto | null = null;
mensajeError: string = '';
```

La variable `producto` almacenará el objeto recibido desde Directus.

La declaración:

```typescript
Producto | null
```

indica que la variable puede contener un objeto con la estructura de `Producto` o el valor `null`.

Inicialmente se utiliza:

```typescript
null
```

porque todavía no se ha realizado la consulta.

En el manual anterior se utilizó un arreglo:

```typescript
productos: Producto[] = [];
```

En esta práctica se necesita un solo objeto:

```typescript
producto: Producto | null = null;
```

La variable `mensajeError` guardará el texto que se mostrará si no es posible cargar el producto. Inicialmente está vacía.

---

## 11. Configurar el constructor

Reemplaza el constructor vacío por:

```typescript
constructor(
  private route: ActivatedRoute,
  private loading: LoadingController
) {}
```

Angular proporcionará las instancias necesarias mediante la inyección de dependencias.

Dentro de la clase se utilizará:

```typescript
this.route
```

para consultar la ruta actual, y:

```typescript
this.loading
```

para crear el indicador de carga.

---

## 12. Configurar `ngOnInit()`

Dentro de `ngOnInit()` llama al método que cargará el producto:

```typescript
ngOnInit(): void {
  this.cargarProducto();
}
```

Angular ejecuta `ngOnInit()` cuando inicializa el componente.

De esta manera, la página consultará el producto al inicializarse, sin que el usuario tenga que presionar otro botón.

---

## 13. Crear el método `cargarProducto()`

Dentro de la clase agrega:

```typescript
async cargarProducto(): Promise<void> {
  const id = this.route.snapshot.paramMap.get('id');

  this.producto = null;
  this.mensajeError = '';

  if (!id) {
    this.mensajeError = 'No se recibió el ID del producto.';
    return;
  }

  const loading = await this.loading.create({
    message: 'Cargando producto...',
    spinner: 'bubbles',
  });

  await loading.present();

  try {
    const response = await axios.get<{ data: Producto }>(
      `${environment.apiUrl}/items/productos/${encodeURIComponent(id)}`
    );

    this.producto = response.data.data;
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    this.mensajeError = 'No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.';
  } finally {
    await loading.dismiss();
  }
}
```

### Método asíncrono

El método se declara como:

```typescript
async cargarProducto(): Promise<void>
```

`async` permite utilizar `await` dentro del método.

`Promise<void>` indica que se trata de una operación asíncrona que no devuelve un valor al código que la invoca.

### Obtener el ID de la ruta

La instrucción:

```typescript
const id = this.route.snapshot.paramMap.get('id');
```

obtiene el valor del parámetro llamado `id`.

El nombre utilizado en `get('id')` debe coincidir con el definido en:

```typescript
path: 'productos-view/:id'
```

Para la dirección `/productos-view/1`, el valor recibido será la cadena `'1'`. Los parámetros de la ruta se obtienen como texto, aunque representen números.

`paramMap.get()` también puede devolver `null` si el parámetro no existe. Por eso se comprueba:

```typescript
if (!id) {
  this.mensajeError = 'No se recibió el ID del producto.';
  return;
}
```

`return` termina el método y evita realizar una petición sin ID.

> `snapshot` permite leer el estado de la ruta en ese momento, como explica la [documentación de rutas de Angular](https://angular.dev/guide/routing/read-route-state). Este ejemplo parte del flujo listado → detalle. Si posteriormente se permite cambiar el ID mientras se reutiliza la misma instancia de la página, será necesario escuchar los cambios de parámetros.

### Mostrar el indicador de carga

La instrucción:

```typescript
const loading = await this.loading.create({
  message: 'Cargando producto...',
  spinner: 'bubbles',
});
```

crea el indicador, pero todavía no lo muestra.

Para mostrarlo se utiliza:

```typescript
await loading.present();
```

`message` define el texto y `spinner` selecciona la animación.

### Realizar la petición GET

La petición se realiza mediante:

```typescript
axios.get<{ data: Producto }>(...)
```

El tipo:

```typescript
{ data: Producto }
```

describe el cuerpo de la respuesta esperado: un objeto con una propiedad `data` que contiene un producto. Este tipado ayuda durante el desarrollo; no valida por sí solo el JSON recibido.

La dirección se construye con:

```typescript
`${environment.apiUrl}/items/productos/${encodeURIComponent(id)}`
```

`environment.apiUrl` proporciona la dirección del servidor y `id` identifica el producto solicitado.

`encodeURIComponent(id)` prepara el valor para utilizarlo como un segmento de la URL. Para el ID `'1'`, el resultado sigue siendo `1`.

Durante el desarrollo, la dirección resultante será:

```text
http://localhost:8000/items/productos/1
```

### Respuesta de Axios y Directus

Axios almacena el cuerpo de la respuesta HTTP en:

```typescript
response.data
```

Directus coloca el producto dentro de la propiedad `data` de ese cuerpo. Por eso se utiliza:

```typescript
response.data.data
```

Finalmente, el objeto se guarda en:

```typescript
this.producto = response.data.data;
```

### Manejo de errores

Si la petición falla, se ejecutará el bloque `catch`:

```typescript
catch (error) {
  console.error('Error al cargar el producto:', error);
  this.mensajeError = 'No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.';
}
```

El detalle técnico se podrá revisar desde la consola del navegador. La variable `mensajeError` permitirá informar al usuario desde la página.

### Cerrar el indicador de carga

El bloque:

```typescript
finally {
  await loading.dismiss();
}
```

se ejecuta después del `try` o del `catch`.

Así, el indicador se cerrará tanto si la petición devuelve el producto como si la consulta falla.

---

## 14. Código completo de `productos-view.page.ts`

El archivo deberá quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
  selector: 'app-productos-view',
  templateUrl: './productos-view.page.html',
  styleUrls: ['./productos-view.page.scss'],
  standalone: false,
})
export class ProductosViewPage implements OnInit {

  producto: Producto | null = null;
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  async cargarProducto(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    this.producto = null;
    this.mensajeError = '';

    if (!id) {
      this.mensajeError = 'No se recibió el ID del producto.';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando producto...',
      spinner: 'bubbles',
    });

    await loading.present();

    try {
      const response = await axios.get<{ data: Producto }>(
        `${environment.apiUrl}/items/productos/${encodeURIComponent(id)}`
      );

      this.producto = response.data.data;
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      this.mensajeError = 'No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.';
    } finally {
      await loading.dismiss();
    }
  }
}
```

Este archivo utiliza el mismo enfoque de TypeScript del manual anterior: una interfaz para describir los datos, variables tipadas y una petición con el tipo de respuesta esperado.

---

## 15. Configurar `productos-view.page.html`

Abre:

```text
src/app/productos-view/productos-view.page.html
```

Reemplaza el contenido generado por Ionic por:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/productos-list"></ion-back-button>
    </ion-buttons>
    <ion-title>Detalle del producto</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-text color="danger" *ngIf="mensajeError">
    <p class="ion-padding">{{ mensajeError }}</p>
  </ion-text>

  <ion-card *ngIf="producto as detalle">
    <ion-card-header>
      <ion-card-title>{{ detalle.nombre }}</ion-card-title>
      <ion-card-subtitle>Producto #{{ detalle.id }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <p>Descripción</p>
            <h2>{{ detalle.descripcion }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <p>Precio</p>
            <h2>${{ detalle.precio }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <p>Stock</p>
            <h2>{{ detalle.stock }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <p>Fecha de registro</p>
            <h2 *ngIf="detalle.fecha_registro; else sinFecha">
              {{ detalle.fecha_registro | date:'yyyy-MM-dd' }}
            </h2>
            <ng-template #sinFecha>
              <h2>Sin fecha de registro</h2>
            </ng-template>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>
</ion-content>
```

Los módulos generados por Ionic deben conservar `CommonModule` e `IonicModule` en sus importaciones. Se utilizan para las directivas y el pipe de Angular, y para los componentes de Ionic, respectivamente.

---

## 16. Mostrar el producto con `*ngIf`

La instrucción:

```html
*ngIf="producto as detalle"
```

muestra la tarjeta cuando `producto` contiene un objeto.

Mientras la petición está en proceso, la variable contiene:

```typescript
null
```

Por lo tanto, Angular todavía no muestra la tarjeta ni intenta leer sus propiedades.

Cuando llega la respuesta, se ejecuta:

```typescript
this.producto = response.data.data;
```

y la tarjeta puede mostrarse.

La expresión:

```text
as detalle
```

crea un nombre local para acceder al producto dentro de la tarjeta:

```html
{{ detalle.nombre }}
```

En el listado se utilizó `*ngFor` para recorrer varios productos. En el detalle se utiliza `*ngIf` para mostrar un solo producto cuando esté disponible.

---

## 17. Interpolación y acceso a las propiedades

Las dobles llaves permiten mostrar valores de TypeScript en el HTML:

```html
{{ detalle.nombre }}
{{ detalle.descripcion }}
{{ detalle.precio }}
{{ detalle.stock }}
```

El operador punto permite acceder a una propiedad del objeto.

Por ejemplo:

```typescript
detalle.nombre
```

accede a la propiedad `nombre` del producto. Para el registro de ejemplo mostrará:

```text
Laptop
```

La misma forma de acceso se utiliza en el manual 01, dentro del recorrido del arreglo.

---

## 18. Formatear la fecha y mostrar una alternativa

Directus devuelve una fecha similar a:

```text
2026-08-25T21:40:56.000Z
```

Para mostrar únicamente el año, mes y día se utiliza:

```html
{{ detalle.fecha_registro | date:'yyyy-MM-dd' }}
```

El resultado será similar a:

```text
2026-08-25
```

La condición:

```html
<h2 *ngIf="detalle.fecha_registro; else sinFecha">
  {{ detalle.fecha_registro | date:'yyyy-MM-dd' }}
</h2>
```

muestra la fecha cuando tiene un valor. Si la cadena está vacía, utiliza la plantilla:

```html
<ng-template #sinFecha>
  <h2>Sin fecha de registro</h2>
</ng-template>
```

`#sinFecha` identifica la plantilla alternativa. El nombre debe coincidir con el escrito después de `else`.

> El modelo de esta práctica conserva `fecha_registro: string`, igual que el manual 01. Si tu colección permite y devuelve `null`, ajusta ese campo a `fecha_registro: string | null` en ambos manuales; la condición del HTML también contempla ese valor.

---

## 19. Agregar el botón de regresar

El HTML completo ya incluye dentro de `ion-toolbar`:

```html
<ion-buttons slot="start">
  <ion-back-button defaultHref="/productos-list"></ion-back-button>
</ion-buttons>
```

`ion-buttons` agrupa los botones y `slot="start"` los coloca al inicio de la barra.

`ion-back-button` permite regresar utilizando el historial de navegación.

La propiedad:

```html
defaultHref="/productos-list"
```

indica la dirección de regreso cuando no existe una página anterior en el historial de Ionic, por ejemplo, si se abrió directamente la URL del detalle.

---

## 20. Abrir una página mediante `(click)`

Como ejercicio complementario, se agregará un botón para abrir en otra pestaña la respuesta de la API del producto mostrado.

Dentro de la clase `ProductosViewPage`, después de `cargarProducto()` y antes de la llave final de la clase, agrega:

```typescript
abrirPagina(): void {
  if (!this.producto) {
    return;
  }

  const url = `${environment.apiUrl}/items/productos/${this.producto.id}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
```

La condición comprueba que el producto esté cargado antes de utilizar su ID.

`window.open()` abre la dirección y `'_blank'` solicita una nueva pestaña o ventana del navegador. Las opciones `noopener,noreferrer` evitan dar acceso a la ventana de origen y enviar la referencia de navegación.

En `productos-view.page.html`, después del cierre de `ion-content`, agrega:

```html
<ion-footer *ngIf="producto">
  <ion-toolbar>
    <ion-button expand="block" (click)="abrirPagina()">
      Ver respuesta de la API
    </ion-button>
  </ion-toolbar>
</ion-footer>
```

La instrucción:

```html
(click)="abrirPagina()"
```

ejecuta el método cuando el usuario presiona el botón.

Este ejercicio utiliza el navegador y el acceso de lectura sin token de la práctica. `[routerLink]` navega entre las páginas de la aplicación; `(click)` permite ejecutar un método, que en este caso abre una dirección externa.

---

## 21. Probar la página

Con la aplicación ejecutándose, abre:

```text
http://localhost:8100/productos-list
```

Realiza las siguientes comprobaciones:

1. Presiona **Ver detalle** en uno de los productos.
2. Comprueba que la dirección incluya su ID, por ejemplo, `/productos-view/1`.
3. Verifica que aparezcan los datos del producto seleccionado.
4. Presiona el botón de regresar y comprueba que se muestre el listado.
5. Selecciona otro producto y revisa que se consulten sus datos.
6. Abre directamente una URL de detalle con un ID existente y verifica el botón de regreso.
7. Prueba un ID inexistente: la página debe mostrar el mensaje de error y cerrar el indicador de carga.
8. Si agregaste el ejercicio complementario, presiona **Ver respuesta de la API** y comprueba que se abra el JSON del producto.

El indicador de carga puede aparecer solo un instante cuando la API responde rápidamente.

Si la página falla, revisa:

| Situación | Qué revisar |
| --- | --- |
| La ruta no se encuentra | Que exista `productos-view/:id` en `app-routing.module.ts` |
| No se recibe el ID | Que `:id` y `paramMap.get('id')` utilicen el mismo nombre |
| No se muestra el producto | El ID, los permisos, la respuesta de Directus y la consola del navegador |
| El navegador bloquea la petición por CORS | La configuración del servicio `api` del manual 01 |
| Angular no reconoce `[routerLink]` | La importación y exportación de `RouterModule` en el módulo de rutas del listado |
| Angular no reconoce `*ngIf` o el pipe `date` | Que el módulo de detalle conserve `CommonModule` |

Durante estas pruebas, `localhost` representa la computadora en la que se abre el navegador. Si se prueba desde otro dispositivo, se debe ajustar `apiUrl` como se explicó en el manual 01.

---

## 22. Flujo completo de la aplicación

Cuando el usuario seleccione un producto, ocurrirá lo siguiente:

1. `[routerLink]` construye la ruta con `producto.id`.
2. Angular abre `productos-view/:id`.
3. Al inicializarse la página, `ngOnInit()` llama a `cargarProducto()`.
4. `ActivatedRoute` permite leer el parámetro `id`.
5. `LoadingController` muestra el indicador de carga.
6. Axios realiza el `GET` utilizando `environment.apiUrl` y el ID.
7. Directus consulta el producto en MariaDB y devuelve el JSON.
8. `response.data.data` se guarda en `this.producto`.
9. `*ngIf` permite mostrar la tarjeta con los datos recibidos.
10. El bloque `finally` cierra el indicador de carga.

Si la consulta falla, el bloque `catch` registra el error y asigna el mensaje que se muestra en la página.

---

## 23. Resumen

Para mostrar un registro específico de una colección se utilizará la nomenclatura:

```text
tabla-view
```

Para la colección `productos`:

```text
productos-view
```

Los pasos realizados fueron:

1. Crear la página `productos-view` con NgModules y `standalone: false`.
2. Reutilizar Axios y la propiedad `apiUrl` de los archivos de entorno.
3. Configurar la ruta `productos-view/:id`.
4. Agregar el enlace desde `productos-list`.
5. Crear la interfaz `Producto` y la variable `producto`.
6. Obtener el ID mediante `ActivatedRoute`.
7. Ejecutar `cargarProducto()` desde `ngOnInit()`.
8. Mostrar el indicador de carga.
9. Realizar una petición `GET` a `/items/productos/{id}`.
10. Guardar `response.data.data` en el objeto.
11. Mostrar los datos con `*ngIf`, interpolación y componentes de Ionic.
12. Cerrar el indicador tanto si la petición tiene éxito como si falla.
13. Agregar el botón de regreso y practicar el evento `(click)`.

La diferencia principal respecto al manual 01 es:

| Elemento | Listado | Detalle |
| --- | --- | --- |
| Página | `productos-list` | `productos-view` |
| Consulta | `/items/productos` | `/items/productos/{id}` |
| Variable | `productos: Producto[]` | `producto: Producto \| null` |
| Respuesta de Directus | Arreglo dentro de `data` | Objeto dentro de `data` |
| Vista | `*ngFor` recorre los productos | `*ngIf` muestra el producto disponible |

Ambas páginas utilizan la misma colección, los mismos campos y la misma configuración de la URL base de la API.
