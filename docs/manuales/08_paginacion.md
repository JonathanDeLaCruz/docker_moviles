# Paginación de elementos con Ionic, Angular y Directus

En esta práctica se agregará paginación al listado de productos creado en las prácticas anteriores.

Hasta este momento, una consulta como:

```text
GET /items/productos
```

puede devolver varios registros en una sola petición. Cuando una colección comienza a crecer, no conviene solicitar todos los elementos al mismo tiempo. En su lugar podemos pedir únicamente una parte de los registros.

Directus permite realizar paginación mediante los parámetros:

```text
limit
page
```

Por ejemplo:

```text
GET /items/productos?limit=10&page=1
```

solicita los primeros 10 productos.

Después:

```text
GET /items/productos?limit=10&page=2
```

solicita la segunda página.

En esta práctica también crearemos un componente reutilizable:

```text
PaginacionComponent
```

que podrá utilizarse posteriormente en otros listados.

Se continuará trabajando con:

```text
Ionic
Angular
TypeScript
Axios
Directus
MariaDB
NgModule
```

y con:

```typescript
standalone: false
```

como en las prácticas anteriores.

---

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Solicitar una cantidad limitada de productos a Directus.
2. Utilizar el parámetro `page` para cambiar de página.
3. Obtener la cantidad total de registros.
4. Calcular el número total de páginas.
5. Crear un componente reutilizable de paginación.
6. Mostrar botones para navegar entre páginas.
7. Mostrar únicamente una cantidad limitada de números de página.
8. Permitir navegar con `Anterior` y `Siguiente`.
9. Informar al componente padre cuando cambie la página mediante `@Output()`.
10. Recargar únicamente los datos necesarios sin recargar el navegador.
11. Mantener actualizada la paginación después de crear o eliminar registros.

El flujo será:

```text
productos-list
      |
      | GET
      v
Directus
      |
      | limit = 10
      | page = 1
      v
10 productos
      |
      v
Listado
      |
      v
PaginacionComponent
      |
      | paginaCambio
      v
productos-list
      |
      | GET
      | page = 2
      v
Directus
```

---

## 1. ¿Qué es la paginación?

Supongamos que existen:

```text
47 productos
```

y queremos mostrar:

```text
10 productos por página
```

La distribución sería:

| Página | Registros |
| ---: | ---: |
| 1 | 1 al 10 |
| 2 | 11 al 20 |
| 3 | 21 al 30 |
| 4 | 31 al 40 |
| 5 | 41 al 47 |

El número de páginas se obtiene mediante:

```typescript
Math.ceil(total / porPagina)
```

En este ejemplo:

```typescript
Math.ceil(47 / 10)
```

produce:

```text
5
```

---

## 2. Paginación en Directus

Directus permite utilizar:

```text
limit
```

para indicar cuántos registros queremos recibir y:

```text
page
```

para indicar qué página queremos consultar.

Por ejemplo:

```text
GET /items/productos?limit=10&page=3
```

La numeración de `page` comienza en:

```text
1
```

Por lo tanto:

```text
page=1
```

representa la primera página.

---

## 3. ¿Por qué no traer todos los registros?

Podríamos solicitar todos los productos y dividirlos solamente desde Angular. Sin embargo, eso obligaría a transferir todos los registros aunque sólo se mostrara una parte.

```text
Base de datos
10,000 productos
      |
      v
API
10,000 productos
      |
      v
Aplicación
muestra solamente 10
```

Con paginación:

```text
Base de datos
10,000 productos
      |
      | limit=10&page=1
      v
API
10 productos
      |
      v
Aplicación
muestra 10
```

---

## 4. Variables necesarias en `productos-list`

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

Dentro de la clase agrega:

```typescript
total: number = 0;
paginaActual: number = 1;
porPagina: number = 10;
```

Estas variables representan:

```text
total         -> cantidad total de productos
paginaActual  -> página que se está mostrando
porPagina     -> productos solicitados por página
```

---

## 5. Modificar `cargarProductos()`

Modifica el método de la siguiente manera:

```typescript
async cargarProductos(): Promise<void> {
  try {
    const response = await axios.get<{ data: Producto[] }>(
      `${environment.apiUrl}/items/productos`,
      {
        params: {
          limit: this.porPagina,
          page: this.paginaActual,
          sort: 'id'
        }
      }
    );

    this.productos = response.data.data;

  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}
```

Axios generará una petición equivalente a:

```text
GET /items/productos?limit=10&page=1&sort=id
```

### ¿Para qué sirve `sort`?

Utilizamos:

```typescript
sort: 'id'
```

para mantener un orden estable entre páginas.

También podríamos utilizar:

```typescript
sort: '-id'
```

para ordenar de forma descendente.

---

## 6. Obtener el total de productos

Para calcular el número de páginas necesitamos conocer el total de registros.

No necesitamos crear un endpoint adicional. Directus permite obtener conteos mediante agregaciones.

La petición será:

```text
GET /items/productos?aggregate[count]=*
```

---

## 7. Crear la interfaz para el conteo

Antes de la clase agrega:

```typescript
interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}
```

Se acepta:

```typescript
number | string
```

porque el conteo puede recibirse como número o como texto dependiendo de la respuesta.

---

## 8. Crear `cargarTotal()`

Dentro de `ProductosListPage` agrega:

```typescript
async cargarTotal(): Promise<void> {
  try {
    const response = await axios.get<ConteoDirectusResponse>(
      `${environment.apiUrl}/items/productos?aggregate[count]=*`
    );

    this.total = Number(
      response.data.data[0]?.count ?? 0
    );

  } catch (error) {
    console.error(
      'Error al obtener el total de productos:',
      error
    );

    this.total = 0;
  }
}
```

Si la API devuelve:

```json
{
  "data": [
    {
      "count": "47"
    }
  ]
}
```

la expresión:

```typescript
Number(response.data.data[0]?.count ?? 0)
```

convierte el resultado a número.

---

## 9. Crear `cargarDatos()`

Cuando se abra el listado necesitamos:

1. obtener el total;
2. verificar que la página actual siga siendo válida;
3. cargar los productos correspondientes.

Agrega:

```typescript
async cargarDatos(): Promise<void> {
  await this.cargarTotal();
  this.ajustarPaginaActual();
  await this.cargarProductos();
}
```

---

## 10. Ajustar la página después de eliminar registros

Supongamos que tenemos:

```text
21 productos
```

con:

```text
10 por página
```

Existen tres páginas. La última contiene un solo producto.

Si eliminamos ese producto, ahora solamente existirán dos páginas. La aplicación no debe permanecer intentando mostrar la página 3.

Agrega:

```typescript
private ajustarPaginaActual(): void {
  const totalPaginas = Math.ceil(
    this.total / this.porPagina
  );

  if (totalPaginas === 0) {
    this.paginaActual = 1;
    return;
  }

  if (this.paginaActual > totalPaginas) {
    this.paginaActual = totalPaginas;
  }
}
```

---

## 11. Cargar los datos al iniciar

En:

```typescript
ngOnInit()
```

utiliza:

```typescript
ngOnInit(): void {
  this.cargarDatos();
}
```

Si la rama de navegación mediante páginas utiliza:

```typescript
ionViewWillEnter()
```

para actualizar el listado al regresar desde el formulario, utiliza:

```typescript
ionViewWillEnter(): void {
  this.cargarDatos();
}
```

En ese caso no es suficiente llamar solamente a `cargarProductos()`, porque también debemos actualizar el total.

---

## 12. Crear el componente de paginación

Desde la raíz del proyecto ejecuta:

```powershell
docker compose exec mobile ionic g component components/paginacion
```

Si estás ejecutando Ionic directamente:

```powershell
ionic g component components/paginacion
```

Se generará una estructura similar a:

```text
src/app/components/paginacion/
├── paginacion.component.html
├── paginacion.component.scss
├── paginacion.component.spec.ts
└── paginacion.component.ts
```

---

## 13. Configurar `standalone: false`

Abre:

```text
src/app/components/paginacion/paginacion.component.ts
```

Verifica que el decorador contenga:

```typescript
standalone: false
```

Por ejemplo:

```typescript
@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.scss'],
  standalone: false
})
```

---

## 14. Crear `paginacion.module.ts`

Dentro de:

```text
src/app/components/paginacion/
```

crea:

```text
paginacion.module.ts
```

Agrega:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PaginacionComponent } from './paginacion.component';

@NgModule({
  declarations: [
    PaginacionComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PaginacionComponent
  ]
})
export class PaginacionModule {}
```

---

## 15. Entradas y salida del componente

El componente recibirá información con `@Input()`:

```typescript
@Input() total: number = 0;
@Input() porPagina: number = 10;
@Input() paginaActual: number = 1;
@Input() maxPaginasVisibles: number = 5;
```

También utilizará `@Output()` para informar al padre cuando el usuario cambie de página:

```typescript
@Output() paginaCambio = new EventEmitter<number>();
```

El flujo será:

```text
productos-list
      |
      | @Input()
      v
PaginacionComponent
      |
      | @Output()
      v
productos-list
```

`@Input()` comunica:

```text
Padre -> Hijo
```

`@Output()` comunica:

```text
Hijo -> Padre
```

---

## 16. Código de `paginacion.component.ts`

Utiliza:

```typescript
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.scss'],
  standalone: false
})
export class PaginacionComponent implements OnChanges {

  @Input() total: number = 0;
  @Input() porPagina: number = 10;
  @Input() paginaActual: number = 1;
  @Input() maxPaginasVisibles: number = 5;

  @Output() paginaCambio = new EventEmitter<number>();

  totalPaginas: number = 0;
  paginasVisibles: number[] = [];

  ngOnChanges(): void {
    this.totalPaginas = Math.ceil(
      this.total / this.porPagina
    );

    this.calcularPaginasVisibles();
  }

  private calcularPaginasVisibles(): void {
    if (this.totalPaginas === 0) {
      this.paginasVisibles = [];
      return;
    }

    const mitad = Math.floor(
      this.maxPaginasVisibles / 2
    );

    let inicio = Math.max(
      1,
      this.paginaActual - mitad
    );

    let fin = Math.min(
      this.totalPaginas,
      inicio + this.maxPaginasVisibles - 1
    );

    inicio = Math.max(
      1,
      fin - this.maxPaginasVisibles + 1
    );

    this.paginasVisibles = [];

    for (let pagina = inicio; pagina <= fin; pagina++) {
      this.paginasVisibles.push(pagina);
    }
  }

  cambiarPagina(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginas ||
      pagina === this.paginaActual
    ) {
      return;
    }

    this.paginaCambio.emit(pagina);
  }

  anterior(): void {
    this.cambiarPagina(
      this.paginaActual - 1
    );
  }

  siguiente(): void {
    this.cambiarPagina(
      this.paginaActual + 1
    );
  }
}
```

---

## 17. ¿Por qué utilizamos `OnChanges`?

El componente recibe valores desde la página padre.

Cuando cambian:

```text
total
paginaActual
porPagina
```

Angular ejecuta:

```typescript
ngOnChanges()
```

y recalculamos:

```text
totalPaginas
paginasVisibles
```

Por ejemplo:

```text
total = 47
porPagina = 10
```

produce:

```text
5 páginas
```

Si después se elimina un registro y el total cambia, el componente recalcula sus botones automáticamente.

---

## 18. ¿Por qué limitar los números visibles?

Supongamos que existen:

```text
10,000 productos
```

con:

```text
10 por página
```

Tendríamos:

```text
1,000 páginas
```

No sería conveniente generar mil botones.

Por eso utilizamos:

```typescript
maxPaginasVisibles: number = 5;
```

Por ejemplo, al inicio podemos mostrar:

```text
1 2 3 4 5
```

y cuando el usuario se encuentra cerca de la página 20:

```text
18 19 20 21 22
```

---

## 19. Configurar el HTML del componente

Abre:

```text
src/app/components/paginacion/paginacion.component.html
```

Agrega:

```html
<div
  class="paginacion"
  *ngIf="totalPaginas > 1"
>

  <ion-button
    fill="clear"
    size="small"
    [disabled]="paginaActual === 1"
    (click)="anterior()"
  >
    Anterior
  </ion-button>

  <ion-button
    *ngFor="let pagina of paginasVisibles"
    size="small"
    [fill]="pagina === paginaActual ? 'solid' : 'outline'"
    (click)="cambiarPagina(pagina)"
  >
    {{ pagina }}
  </ion-button>

  <ion-button
    fill="clear"
    size="small"
    [disabled]="paginaActual === totalPaginas"
    (click)="siguiente()"
  >
    Siguiente
  </ion-button>

</div>

<p
  class="informacion"
  *ngIf="total > 0"
>
  Página {{ paginaActual }}
  de {{ totalPaginas }}
  ·
  {{ total }} registros
</p>
```

---

## 20. Configurar el SCSS

Abre:

```text
src/app/components/paginacion/paginacion.component.scss
```

Agrega:

```scss
.paginacion {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
}

.paginacion ion-button {
  margin: 0;
  --padding-start: 12px;
  --padding-end: 12px;
}

.informacion {
  text-align: center;
  margin-top: 8px;
  margin-bottom: 0;
}
```

No necesitamos `Swiper`, `ElementRef` ni acceso directo al DOM.

---

## 21. Importar `PaginacionModule`

Abre:

```text
src/app/productos-list/productos-list.module.ts
```

Importa:

```typescript
import { PaginacionModule } from '../components/paginacion/paginacion.module';
```

Después agrega `PaginacionModule` dentro de `imports`:

```typescript
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosListPageRoutingModule,
    PaginacionModule
  ],
  declarations: [
    ProductosListPage
  ]
})
export class ProductosListPageModule {}
```

---

## 22. Utilizar el componente en `productos-list`

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Después del listado agrega:

```html
<app-paginacion
  [total]="total"
  [porPagina]="porPagina"
  [paginaActual]="paginaActual"
  [maxPaginasVisibles]="5"
  (paginaCambio)="cambiarPagina($event)"
></app-paginacion>
```

Cuando el usuario selecciona una página, el componente ejecuta:

```typescript
paginaCambio.emit(pagina)
```

y la página padre recibe directamente un número.

---

## 23. Crear `cambiarPagina()`

En:

```text
productos-list.page.ts
```

agrega:

```typescript
async cambiarPagina(
  pagina: number
): Promise<void> {
  this.paginaActual = pagina;
  await this.cargarProductos();
}
```

No necesitamos consultar nuevamente el total cuando únicamente cambiamos de página.

El flujo será:

```text
Usuario presiona página 3
        |
        v
PaginacionComponent
        |
        | emit(3)
        v
cambiarPagina(3)
        |
        v
paginaActual = 3
        |
        v
cargarProductos()
        |
        v
GET ?limit=10&page=3
```

---

## 24. Fragmento principal de `productos-list.page.ts`

La parte relacionada con la paginación puede quedar así:

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

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.page.html',
  styleUrls: ['./productos-list.page.scss'],
  standalone: false
})
export class ProductosListPage implements OnInit {

  productos: Producto[] = [];

  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await this.cargarTotal();
    this.ajustarPaginaActual();
    await this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    try {
      const response = await axios.get<{ data: Producto[] }>(
        `${environment.apiUrl}/items/productos`,
        {
          params: {
            limit: this.porPagina,
            page: this.paginaActual,
            sort: 'id'
          }
        }
      );

      this.productos = response.data.data;

    } catch (error) {
      console.error(
        'Error al cargar los productos:',
        error
      );
    }
  }

  async cargarTotal(): Promise<void> {
    try {
      const response = await axios.get<ConteoDirectusResponse>(
        `${environment.apiUrl}/items/productos?aggregate[count]=*`
      );

      this.total = Number(
        response.data.data[0]?.count ?? 0
      );

    } catch (error) {
      console.error(
        'Error al obtener el total de productos:',
        error
      );

      this.total = 0;
    }
  }

  private ajustarPaginaActual(): void {
    const totalPaginas = Math.ceil(
      this.total / this.porPagina
    );

    if (totalPaginas === 0) {
      this.paginaActual = 1;
      return;
    }

    if (this.paginaActual > totalPaginas) {
      this.paginaActual = totalPaginas;
    }
  }

  async cambiarPagina(
    pagina: number
  ): Promise<void> {
    this.paginaActual = pagina;
    await this.cargarProductos();
  }
}
```

---

## 25. Integración con la creación mediante modal

En la variante mediante modal, después de crear un producto teníamos una lógica similar a:

```typescript
const { data } = await modal.onDidDismiss();

if (data?.guardado) {
  await this.cargarProductos();
}
```

Ahora debemos actualizar también el total.

Cámbialo por:

```typescript
const { data } = await modal.onDidDismiss();

if (data?.guardado) {
  await this.cargarDatos();
}
```

---

## 26. Integración con la creación mediante página

En la variante que navega hacia `productos-form`, el listado puede utilizar:

```typescript
ionViewWillEnter(): void {
  this.cargarDatos();
}
```

Así, cuando el usuario regrese del formulario se actualizarán tanto los productos como el total.

---

## 27. Integración con eliminar

Después de eliminar un producto conviene utilizar:

```typescript
await this.cargarDatos();
```

en lugar de solamente:

```typescript
await this.cargarProductos();
```

Una eliminación puede modificar:

```text
total de registros
total de páginas
página actual válida
```

El método `ajustarPaginaActual()` evita que permanezcamos en una página que ya no existe.

---

## 28. Probar la paginación

Asegúrate de tener suficientes productos en Directus.

Por ejemplo, con:

```text
25 productos
```

y:

```typescript
porPagina = 10;
```

se deberán obtener:

```text
Página 1 -> 10 productos
Página 2 -> 10 productos
Página 3 -> 5 productos
```

Abre:

```text
http://localhost:8100/productos-list
```

Comprueba que:

1. inicialmente se muestre la página 1;
2. aparezcan solamente 10 productos;
3. existan tres páginas;
4. `Anterior` esté deshabilitado en la primera página;
5. al presionar `2` se solicite la segunda página;
6. `Siguiente` avance correctamente;
7. `Siguiente` esté deshabilitado en la última página;
8. no se recargue el navegador completo.

---

## 29. Revisar las peticiones desde el navegador

En las herramientas de desarrollo abre:

```text
Network
```

Debes observar peticiones similares a:

```text
/items/productos?limit=10&page=1&sort=id
```

y después:

```text
/items/productos?limit=10&page=2&sort=id
```

Además, al cargar o actualizar completamente el listado se ejecutará:

```text
/items/productos?aggregate[count]=*
```

Esto permite verificar que la paginación está ocurriendo desde la API y no únicamente ocultando elementos en Angular.

---

## 30. Cambiar la cantidad de registros por página

Actualmente tenemos:

```typescript
porPagina: number = 10;
```

Puedes cambiarlo por:

```typescript
porPagina: number = 5;
```

o:

```typescript
porPagina: number = 20;
```

El componente recalculará automáticamente el número total de páginas.

---

## 31. ¿Por qué no utilizamos `(click)` sobre todo el componente?

No debemos utilizar:

```html
<app-paginacion
  (click)="pagina($event)"
></app-paginacion>
```

para después obtener:

```typescript
event.target.innerText
```

Ese código depende del elemento exacto que recibió el clic.

En su lugar utilizamos:

```typescript
@Output() paginaCambio
```

El componente emite directamente el número de página seleccionado.

---

## 32. Responsabilidad del componente de paginación

`PaginacionComponent` no debe conocer:

```text
Axios
Directus
productos
usuarios
categorías
```

Únicamente debe conocer:

```text
total
porPagina
paginaActual
```

y emitir:

```text
paginaCambio
```

Por eso puede reutilizarse en otros listados.

---

## 33. Responsabilidad de `productos-list`

`ProductosListPage` sí es responsable de:

```text
consultar Directus
guardar paginaActual
guardar porPagina
guardar total
cargar productos
```

La separación será:

```text
ProductosListPage
      |
      | Datos
      v
PaginacionComponent
      |
      | Evento
      v
ProductosListPage
      |
      | HTTP
      v
Directus
```

---

## 34. ¿Qué ocurrió con Swiper?

Para esta práctica no utilizaremos:

```text
Swiper
```

La paginación no es un carrusel.

Swiper tiene sentido cuando queremos desplazar contenido como:

```text
imágenes
tarjetas
galerías
slides
```

Para seleccionar páginas únicamente necesitamos controles de navegación.

Por eso tampoco necesitamos:

```typescript
ElementRef
```

ni acceso directo al DOM.

---

## 35. ¿Qué ocurrió con el endpoint `total` de Yii2?

En una implementación anterior podía ser necesario crear un endpoint como:

```text
/user-alumnos/total
```

En esta aplicación utilizamos Directus, que ya permite realizar agregaciones.

Por eso utilizamos:

```text
/items/productos?aggregate[count]=*
```

No necesitamos modificar:

```text
controller
web.php
UrlRule
```

ni crear un endpoint personalizado únicamente para contar registros.

---

## 36. ¿Por qué utilizamos agregación y no `meta`?

En versiones anteriores de Directus se podían solicitar conteos mediante metadata.

Actualmente los conteos mediante metadata están marcados como deprecados en la documentación de Directus. Para nuevos desarrollos conviene utilizar agregaciones.

Por eso usamos:

```text
aggregate[count]=*
```

---

## 37. Preparación para búsquedas y filtros

Posteriormente podemos combinar esta paginación con:

```text
búsqueda
filtros
ordenamiento
```

Existe una regla importante:

> El total debe calcularse utilizando los mismos filtros que se aplican al listado.

Por ejemplo, si existen 100 productos pero una búsqueda encuentra solamente 17, el paginador debe calcularse utilizando 17.

---

## 38. Organización final

La estructura relacionada con esta práctica será:

```text
src/app/
├── components/
│   ├── toolbar/
│   │   └── ...
│   │
│   └── paginacion/
│       ├── paginacion.component.html
│       ├── paginacion.component.scss
│       ├── paginacion.component.spec.ts
│       ├── paginacion.component.ts
│       └── paginacion.module.ts
│
└── productos-list/
    ├── productos-list-routing.module.ts
    ├── productos-list.module.ts
    ├── productos-list.page.html
    ├── productos-list.page.scss
    ├── productos-list.page.spec.ts
    └── productos-list.page.ts
```

Los componentes reutilizables permanecen dentro de:

```text
src/app/components/
```

---

## 39. Resumen

La paginación se divide en dos responsabilidades.

### Directus

Recibe:

```text
limit
page
```

Por ejemplo:

```text
/items/productos?limit=10&page=2
```

También permite obtener el conteo mediante:

```text
/items/productos?aggregate[count]=*
```

### `ProductosListPage`

Mantiene:

```typescript
total
paginaActual
porPagina
```

y realiza las consultas HTTP.

### `PaginacionComponent`

Recibe:

```typescript
@Input() total
@Input() porPagina
@Input() paginaActual
```

y devuelve:

```typescript
@Output() paginaCambio
```

El flujo completo será:

```text
Directus
   |
   | total
   | productos paginados
   v
ProductosListPage
   |
   | @Input()
   v
PaginacionComponent
   |
   | usuario selecciona página
   |
   | @Output()
   v
ProductosListPage
   |
   | limit + page
   v
Directus
```

Los principales cambios respecto al manual anterior son:

```text
No Yii2
No endpoint total personalizado
No Swiper
No ElementRef
No event.target.innerText
No window.location.reload()
```

En su lugar utilizamos:

```text
Directus
limit
page
Aggregation
@Input()
@Output()
EventEmitter
Axios
environment.apiUrl
```

Esto deja un componente de paginación más pequeño, reutilizable y coherente con la arquitectura utilizada en las prácticas actuales.
