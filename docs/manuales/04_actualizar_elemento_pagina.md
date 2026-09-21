# Actualizar un elemento con Ionic mediante una página

En esta práctica se actualizará un producto existente utilizando el mismo formulario creado para registrar productos, pero navegando hacia `productos-form` como una **página independiente**.

Se utilizarán las mismas tecnologías y la misma colección de las prácticas anteriores:

```text
Ionic
Angular
TypeScript
Axios
Directus
MariaDB
```

Las peticiones principales serán:

```text
GET   http://localhost:8000/items/productos/{id}
PATCH http://localhost:8000/items/productos/{id}
```

La primera petición permitirá obtener los datos actuales del producto y la segunda actualizar únicamente el registro seleccionado.

En esta variante se navegará desde `productos-list` hacia `productos-form/{id}`.

Cuando termine la actualización, la aplicación regresará a `productos-list`. El listado utilizará `ionViewWillEnter()` para volver a consultar los productos y mostrar los cambios.

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Agregar un botón para editar cada producto.
2. Navegar desde `productos-list` hacia `productos-form/{id}`.
3. Obtener el `id` mediante `ActivatedRoute`.
4. Reutilizar el formulario existente para crear y actualizar.
5. Consultar el producto mediante `GET` por `id`.
6. Cargar los datos existentes con `patchValue()`.
7. Mantener los mensajes de validación en `page.ts`.
8. Utilizar el método `getError()`.
9. Actualizar el producto mediante `PATCH`.
10. Regresar al listado después de guardar.
11. Volver a ejecutar `cargarProductos()` mediante `ionViewWillEnter()`.

El flujo será:

```text
productos-list
      |
      | Editar
      v
/productos-form/{id}
      |
      v
ActivatedRoute
      |
      | id
      v
productos-form
      |
      | GET /items/productos/{id}
      v
Directus
      |
      v
Formulario con datos
      |
      | PATCH /items/productos/{id}
      v
Directus
      |
      v
MariaDB
      |
      v
Router
      |
      v
/productos-list
      |
      v
ionViewWillEnter()
      |
      v
cargarProductos()
```

---

## 1. Permitir la lectura y actualización en Directus

La política utilizada durante las prácticas debe tener los permisos:

```text
Read
Update
```

sobre:

```text
productos
```

`Read` es necesario porque primero se consultará el producto que se desea modificar.

`Update` es necesario para ejecutar la petición:

```text
PATCH /items/productos/{id}
```

Los campos que se actualizarán serán:

```text
nombre
descripcion
precio
stock
```

No se enviarán:

```text
id
fecha_registro
```

porque no forman parte de los datos editables del formulario.

---

## 2. Reutilizar `productos-form`

Esta práctica continúa a partir del formulario utilizado para crear productos.

El archivo principal será:

```text
src/app/productos-form/productos-form.page.ts
```

El mismo formulario tendrá dos comportamientos:

```text
/productos-form
      |
      v
Crear producto
      |
      v
POST
```

```text
/productos-form/5
      |
      v
Editar producto 5
      |
      v
GET por id
      |
      v
PATCH
```

De esta manera no será necesario crear otra página llamada, por ejemplo:

```text
productos-editar
```

El mismo `productos-form` servirá para ambos procesos.

---

## 3. Agregar una ruta con `id`

Abre:

```text
src/app/productos-form/productos-form-routing.module.ts
```

El arreglo de rutas puede quedar de la siguiente manera:

```typescript
const routes: Routes = [
  {
    path: ':id',
    component: ProductosFormPage
  },
  {
    path: '',
    component: ProductosFormPage
  }
];
```

La primera ruta permitirá crear:

```text
/productos-form
```

La segunda permitirá editar:

```text
/productos-form/5
```

El valor que aparece después de `productos-form/` será recibido con el nombre:

```text
id
```

porque la ruta utiliza:

```typescript
path: ':id'
```

---

## 4. Agregar el botón `Editar`

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Dentro del elemento donde se muestra cada producto agrega:

```html
<ion-button fill="clear" color="warning" [routerLink]="['/productos-form', producto.id]">
  <ion-icon slot="icon-only" name="pencil"></ion-icon>
</ion-button>
```

La parte importante es:

```html
[routerLink]="['/productos-form', producto.id]"
```

Si el producto tiene:

```text
id = 5
```

Angular construirá la ruta:

```text
/productos-form/5
```

En esta variante no se utilizará:

```typescript
ModalController
```

para abrir el formulario.

---

## 5. Actualizar el listado al regresar

Cuando se utiliza navegación entre páginas, `productos-list` puede permanecer almacenado en la pila de navegación de Ionic.

Por esta razón, `ngOnInit()` no es el mejor lugar para depender de una recarga cada vez que se regresa al listado.

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

Utiliza:

```typescript
ionViewWillEnter(): void {
  this.cargarProductos();
}
```

Si actualmente tienes:

```typescript
ngOnInit(): void {
  this.cargarProductos();
}
```

puedes sustituir esa carga por `ionViewWillEnter()`.

La diferencia principal es:

```text
ngOnInit()
```

se ejecuta cuando Angular inicializa el componente.

Mientras que:

```text
ionViewWillEnter()
```

se ejecuta cada vez que la página está a punto de mostrarse.

Por eso es apropiado para volver a consultar el listado después de crear o actualizar un producto.

---

## 6. Fragmento principal de `productos-list.page.ts`

El listado puede quedar de forma similar a:

```typescript
import { Component } from '@angular/core';
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
export class ProductosListPage {

  productos: Producto[] = [];

  ionViewWillEnter(): void {
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

No es necesario crear un método `editarProducto()` si el botón utiliza directamente:

```html
[routerLink]="['/productos-form', producto.id]"
```

---

## 7. Importar `ActivatedRoute`

Abre:

```text
src/app/productos-form/productos-form.page.ts
```

Agrega:

```typescript
import { ActivatedRoute, Router } from '@angular/router';
```

En esta variante se utiliza:

```text
ActivatedRoute
```

para leer el `id` incluido en la URL.

También se utiliza:

```text
Router
```

para regresar al listado después de guardar.

No se necesita:

```typescript
ModalController
```

porque el formulario es una página normal.

---

## 8. Crear las interfaces

Antes de la clase utiliza:

```typescript
interface ProductoGuardar {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

interface ProductoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  stock: number;
  fecha_registro: string;
}
```

`ProductoGuardar` contiene solamente los campos que se enviarán a Directus.

`ProductoDetalle` representa la estructura de un producto recuperado mediante `GET` por `id`.

---

## 9. Crear las variables

Dentro de la clase conserva:

```typescript
productoForm!: FormGroup;
guardando: boolean = false;
```

y agrega:

```typescript
idProducto?: number;
cargando: boolean = false;
```

`idProducto` almacenará el identificador obtenido de la URL.

Cuando la página se abra en:

```text
/productos-form
```

`idProducto` permanecerá vacío.

Cuando se abra en:

```text
/productos-form/5
```

se almacenará:

```typescript
idProducto = 5;
```

---

## 10. Crear `esEdicion`

Dentro de la clase agrega:

```typescript
get esEdicion(): boolean {
  return this.idProducto !== undefined;
}
```

Este getter permitirá distinguir entre creación y actualización.

```text
idProducto vacío
      |
      v
esEdicion = false
      |
      v
Crear
```

```text
idProducto con valor
      |
      v
esEdicion = true
      |
      v
Actualizar
```

---

## 11. Mantener los mensajes de validación en `page.ts`

Conserva:

```typescript
mensajesValidacion: Record<string, Record<string, string>> = {
  nombre: {
    required: 'El nombre es obligatorio.',
    maxlength: 'El nombre no debe superar 150 caracteres.'
  },
  precio: {
    required: 'El precio es obligatorio.',
    min: 'El precio debe ser igual o mayor que cero.'
  },
  stock: {
    required: 'El stock es obligatorio.',
    min: 'El stock debe ser igual o mayor que cero.',
    pattern: 'El stock debe contener únicamente números enteros.'
  }
};
```

Las reglas son las mismas tanto para crear como para actualizar.

---

## 12. Configurar el constructor

Utiliza:

```typescript
constructor(
  private formBuilder: FormBuilder,
  private alertController: AlertController,
  private activatedRoute: ActivatedRoute,
  private router: Router
) {}
```

Cada dependencia tendrá la siguiente función:

```text
FormBuilder
```

crea el formulario reactivo.

```text
AlertController
```

muestra los mensajes después de guardar o cuando ocurre un error.

```text
ActivatedRoute
```

obtiene el `id` desde la URL.

```text
Router
```

permite regresar a `productos-list` después del guardado.

---

## 13. Crear primero el formulario y obtener después el `id`

Modifica `ngOnInit()`:

```typescript
async ngOnInit(): Promise<void> {
  this.crearFormulario();

  const id = this.activatedRoute.snapshot.paramMap.get('id');

  if (id !== null) {
    const idConvertido = Number(id);

    if (!Number.isNaN(idConvertido)) {
      this.idProducto = idConvertido;
      await this.cargarProducto();
    }
  }
}
```

Primero se ejecuta:

```typescript
this.crearFormulario();
```

porque después `cargarProducto()` utilizará:

```typescript
this.productoForm.patchValue(...)
```

La instrucción:

```typescript
this.activatedRoute.snapshot.paramMap.get('id')
```

obtiene el parámetro definido en:

```typescript
path: ':id'
```

Los parámetros de una URL llegan como texto, por eso se convierte mediante:

```typescript
Number(id)
```

---

## 14. Mantener `crearFormulario()`

El formulario puede conservarse igual que en la práctica de creación:

```typescript
private crearFormulario(): void {
  this.productoForm = this.formBuilder.group({
    nombre: ['', [
      Validators.required,
      Validators.maxLength(150)
    ]],
    descripcion: [''],
    precio: ['', [
      Validators.required,
      Validators.min(0)
    ]],
    stock: ['', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+$')
    ]]
  });
}
```

No se agrega:

```text
id
```

al formulario porque se utilizará únicamente para identificar el producto en la URL.

---

## 15. Mantener `getError()`

Conserva:

```typescript
getError(controlName: string): string {
  const control = this.productoForm.get(controlName);

  if (!control || !control.errors || !(control.touched || control.dirty)) {
    return '';
  }

  const tipoError = Object.keys(control.errors)[0];

  return this.mensajesValidacion[controlName]?.[tipoError]
    ?? 'El valor ingresado no es válido.';
}
```

No es necesario duplicar los mensajes de validación en el HTML.

---

## 16. Crear `cargarProducto()`

Agrega:

```typescript
private async cargarProducto(): Promise<void> {
  if (this.idProducto === undefined) {
    return;
  }

  this.cargando = true;

  try {
    const response = await axios.get<{ data: ProductoDetalle }>(
      `${environment.apiUrl}/items/productos/${this.idProducto}`
    );

    const producto = response.data.data;

    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
  } catch (error) {
    console.error('Error al cargar el producto:', error);

    const alerta = await this.alertController.create({
      header: 'Error',
      message: 'No fue posible cargar los datos del producto. Revisa la conexión, el identificador y los permisos de lectura en Directus.',
      buttons: ['Aceptar']
    });

    await alerta.present();
  } finally {
    this.cargando = false;
  }
}
```

Si la URL actual es:

```text
http://localhost:8100/productos-form/5
```

la petición será:

```text
GET http://localhost:8000/items/productos/5
```

Directus responderá con una estructura similar a:

```json
{
  "data": {
    "id": 5,
    "nombre": "Mouse",
    "descripcion": "Mouse inalámbrico",
    "precio": "450.00",
    "stock": 10,
    "fecha_registro": "2026-09-21T12:00:00"
  }
}
```

Después se utilizará:

```typescript
this.productoForm.patchValue(...)
```

para llenar los controles del formulario.

---

## 17. ¿Por qué utilizar `patchValue()`?

El producto recuperado contiene campos que no forman parte del formulario, por ejemplo:

```text
id
fecha_registro
```

El formulario únicamente necesita:

```text
nombre
descripcion
precio
stock
```

Por eso se utiliza:

```typescript
this.productoForm.patchValue({
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: producto.precio,
  stock: producto.stock
});
```

`patchValue()` permite asignar solamente los controles indicados.

---

## 18. Modificar `guardarProducto()`

Ahora el método deberá decidir si se está creando o actualizando.

Utiliza:

```typescript
async guardarProducto(): Promise<void> {
  if (this.productoForm.invalid) {
    this.productoForm.markAllAsTouched();
    return;
  }

  this.guardando = true;

  const valores = this.productoForm.value;

  const producto: ProductoGuardar = {
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion?.trim() ?? '',
    precio: Number(valores.precio),
    stock: Number(valores.stock)
  };

  try {
    if (this.esEdicion && this.idProducto !== undefined) {
      await axios.patch(
        `${environment.apiUrl}/items/productos/${this.idProducto}`,
        producto,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      await axios.post(
        `${environment.apiUrl}/items/productos`,
        producto,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const alerta = await this.alertController.create({
      header: this.esEdicion ? 'Producto actualizado' : 'Producto guardado',
      message: this.esEdicion
        ? 'El producto fue actualizado correctamente.'
        : 'El producto fue registrado correctamente.',
      buttons: ['Aceptar']
    });

    await alerta.present();
    await alerta.onDidDismiss();

    await this.router.navigate(['/productos-list']);
  } catch (error) {
    console.error(
      this.esEdicion
        ? 'Error al actualizar el producto:'
        : 'Error al guardar el producto:',
      error
    );

    const alerta = await this.alertController.create({
      header: 'Error',
      message: this.esEdicion
        ? 'No fue posible actualizar el producto. Revisa los datos, la conexión y los permisos de actualización en Directus.'
        : 'No fue posible guardar el producto. Revisa los datos, la conexión y los permisos de creación en Directus.',
      buttons: ['Aceptar']
    });

    await alerta.present();
  } finally {
    this.guardando = false;
  }
}
```

La condición principal es:

```typescript
if (this.esEdicion && this.idProducto !== undefined)
```

Cuando existe un identificador se utiliza:

```typescript
axios.patch(...)
```

Cuando no existe se mantiene:

```typescript
axios.post(...)
```

---

## 19. Petición `PATCH`

Si se está editando el producto con:

```text
id = 5
```

se ejecutará:

```text
PATCH http://localhost:8000/items/productos/5
```

El cuerpo enviado será similar a:

```json
{
  "nombre": "Mouse inalámbrico",
  "descripcion": "Mouse inalámbrico recargable",
  "precio": 500,
  "stock": 15
}
```

El `id` no se envía dentro del cuerpo porque ya forma parte de la URL.

---

## 20. Regresar al listado

Después de guardar correctamente se ejecutará:

```typescript
await this.router.navigate(['/productos-list']);
```

Al regresar, Ionic ejecutará:

```typescript
ionViewWillEnter(): void {
  this.cargarProductos();
}
```

por lo tanto se realizará nuevamente:

```text
GET /items/productos
```

y se mostrará la información actualizada.

El flujo será:

```text
PATCH exitoso
      |
      v
router.navigate(['/productos-list'])
      |
      v
productos-list
      |
      v
ionViewWillEnter()
      |
      v
cargarProductos()
      |
      v
GET /items/productos
      |
      v
Listado actualizado
```

---

## 21. Código completo de `productos-form.page.ts`

El archivo puede quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface ProductoGuardar {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

interface ProductoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  stock: number;
  fecha_registro: string;
}

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.page.html',
  styleUrls: ['./productos-form.page.scss'],
  standalone: false,
})
export class ProductosFormPage implements OnInit {

  productoForm!: FormGroup;
  idProducto?: number;
  cargando: boolean = false;
  guardando: boolean = false;

  mensajesValidacion: Record<string, Record<string, string>> = {
    nombre: {
      required: 'El nombre es obligatorio.',
      maxlength: 'El nombre no debe superar 150 caracteres.'
    },
    precio: {
      required: 'El precio es obligatorio.',
      min: 'El precio debe ser igual o mayor que cero.'
    },
    stock: {
      required: 'El stock es obligatorio.',
      min: 'El stock debe ser igual o mayor que cero.',
      pattern: 'El stock debe contener únicamente números enteros.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  get esEdicion(): boolean {
    return this.idProducto !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.crearFormulario();

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id !== null) {
      const idConvertido = Number(id);

      if (!Number.isNaN(idConvertido)) {
        this.idProducto = idConvertido;
        await this.cargarProducto();
      }
    }
  }

  private crearFormulario(): void {
    this.productoForm = this.formBuilder.group({
      nombre: ['', [
        Validators.required,
        Validators.maxLength(150)
      ]],
      descripcion: [''],
      precio: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      stock: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]+$')
      ]]
    });
  }

  getError(controlName: string): string {
    const control = this.productoForm.get(controlName);

    if (
      !control ||
      !control.errors ||
      !(control.touched || control.dirty)
    ) {
      return '';
    }

    const tipoError = Object.keys(control.errors)[0];

    return this.mensajesValidacion[controlName]?.[tipoError]
      ?? 'El valor ingresado no es válido.';
  }

  private async cargarProducto(): Promise<void> {
    if (this.idProducto === undefined) {
      return;
    }

    this.cargando = true;

    try {
      const response = await axios.get<{ data: ProductoDetalle }>(
        `${environment.apiUrl}/items/productos/${this.idProducto}`
      );

      const producto = response.data.data;

      this.productoForm.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock
      });
    } catch (error) {
      console.error('Error al cargar el producto:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar los datos del producto. Revisa la conexión, el identificador y los permisos de lectura en Directus.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    } finally {
      this.cargando = false;
    }
  }

  async guardarProducto(): Promise<void> {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const valores = this.productoForm.value;

    const producto: ProductoGuardar = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion?.trim() ?? '',
      precio: Number(valores.precio),
      stock: Number(valores.stock)
    };

    try {
      if (this.esEdicion && this.idProducto !== undefined) {
        await axios.patch(
          `${environment.apiUrl}/items/productos/${this.idProducto}`,
          producto,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        await axios.post(
          `${environment.apiUrl}/items/productos`,
          producto,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      const alerta = await this.alertController.create({
        header: this.esEdicion ? 'Producto actualizado' : 'Producto guardado',
        message: this.esEdicion
          ? 'El producto fue actualizado correctamente.'
          : 'El producto fue registrado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.router.navigate(['/productos-list']);
    } catch (error) {
      console.error(
        this.esEdicion
          ? 'Error al actualizar el producto:'
          : 'Error al guardar el producto:',
        error
      );

      const alerta = await this.alertController.create({
        header: 'Error',
        message: this.esEdicion
          ? 'No fue posible actualizar el producto. Revisa los datos, la conexión y los permisos de actualización en Directus.'
          : 'No fue posible guardar el producto. Revisa los datos, la conexión y los permisos de creación en Directus.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    } finally {
      this.guardando = false;
    }
  }
}
```

---

## 22. Configurar el HTML del formulario

Abre:

```text
src/app/productos-form/productos-form.page.html
```

En una página normal se puede utilizar un botón de regreso:

```html
<ion-buttons slot="start">
  <ion-back-button defaultHref="/productos-list"></ion-back-button>
</ion-buttons>
```

El título puede cambiar según el modo:

```html
<ion-title>
  {{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}
</ion-title>
```

El botón puede mostrar:

```text
Guardar
```

o:

```text
Actualizar
```

según exista un `id`.

El HTML completo puede quedar de forma similar a:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/productos-list"></ion-back-button>
    </ion-buttons>

    <ion-title>
      {{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <div *ngIf="cargando" class="ion-text-center ion-padding">
    <ion-spinner></ion-spinner>
    <p>Cargando producto...</p>
  </div>

  <form *ngIf="productoForm && !cargando" [formGroup]="productoForm" (ngSubmit)="guardarProducto()">
    <ion-list>
      <ion-item>
        <ion-input label="Nombre" labelPlacement="stacked" type="text" formControlName="nombre" maxlength="150"></ion-input>
      </ion-item>
      <ion-note color="danger" *ngIf="getError('nombre') as error">
        {{ error }}
      </ion-note>

      <ion-item>
        <ion-textarea label="Descripción" labelPlacement="stacked" formControlName="descripcion" autoGrow="true"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-input label="Precio" labelPlacement="stacked" type="number" formControlName="precio" min="0"></ion-input>
      </ion-item>
      <ion-note color="danger" *ngIf="getError('precio') as error">
        {{ error }}
      </ion-note>

      <ion-item>
        <ion-input label="Stock" labelPlacement="stacked" type="number" formControlName="stock" min="0"></ion-input>
      </ion-item>
      <ion-note color="danger" *ngIf="getError('stock') as error">
        {{ error }}
      </ion-note>
    </ion-list>

    <ion-button expand="block" type="submit" class="ion-margin-top" [disabled]="guardando || cargando">
      {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar') }}
    </ion-button>
  </form>
</ion-content>
```

---

## 23. Cómo se diferencia crear de actualizar

El mismo formulario ahora funcionará de dos maneras.

### Crear

Se abre:

```text
/productos-form
```

No existe un parámetro `id`.

Por lo tanto:

```typescript
this.idProducto === undefined
```

y:

```typescript
this.esEdicion === false
```

Al guardar se ejecutará:

```text
POST /items/productos
```

### Actualizar

Se abre, por ejemplo:

```text
/productos-form/5
```

El parámetro será:

```text
id = 5
```

Entonces se ejecutará primero:

```text
GET /items/productos/5
```

para llenar el formulario.

Al guardar se ejecutará:

```text
PATCH /items/productos/5
```

---

## 24. Probar la actualización

Abre:

```text
http://localhost:8100/productos-list
```

Selecciona el botón de edición de un producto.

Si el producto tiene:

```text
id = 5
```

la aplicación deberá navegar a:

```text
http://localhost:8100/productos-form/5
```

Después deberá ejecutar:

```text
GET http://localhost:8000/items/productos/5
```

El formulario deberá mostrar los valores actuales.

Por ejemplo:

```text
Nombre: Mouse
Descripción: Mouse inalámbrico
Precio: 450
Stock: 10
```

Modifica los datos:

```text
Nombre: Mouse inalámbrico
Descripción: Mouse inalámbrico recargable
Precio: 500
Stock: 15
```

Presiona:

```text
Actualizar
```

La aplicación deberá ejecutar:

```text
PATCH http://localhost:8000/items/productos/5
```

Después de aceptar el mensaje:

1. la aplicación debe regresar a `/productos-list`;
2. debe ejecutarse `ionViewWillEnter()`;
3. debe ejecutarse `cargarProductos()`;
4. el producto debe mostrar los datos modificados;
5. no debe ser necesario recargar manualmente el navegador.

---

## 25. Probar que el formulario todavía puede crear

Después de realizar las modificaciones anteriores, abre:

```text
http://localhost:8100/productos-form
```

Como la URL no contiene un `id`, el formulario deberá mantenerse vacío.

Captura, por ejemplo:

```text
Nombre: Teclado
Descripción: Teclado mecánico
Precio: 800
Stock: 20
```

Al presionar:

```text
Guardar
```

se deberá ejecutar:

```text
POST http://localhost:8000/items/productos
```

Esto comprueba que `productos-form` continúa siendo reutilizable.

---

## 26. Resumen

Esta variante utiliza navegación mediante rutas en lugar de abrir un modal.

Los elementos principales son:

1. Permisos `Read` y `Update` en Directus.
2. Ruta `:id` en `productos-form-routing.module.ts`.
3. Botón `Editar` con `[routerLink]`.
4. `ActivatedRoute` para obtener el `id`.
5. Formulario reactivo reutilizable.
6. Mensajes de validación almacenados en `page.ts`.
7. Método `getError()`.
8. Petición `GET` por `id` para obtener los datos existentes.
9. `patchValue()` para llenar el formulario.
10. Petición `PATCH` para actualizar el producto.
11. `Router` para regresar al listado después del guardado.
12. `ionViewWillEnter()` para volver a consultar los productos.

La lógica principal será:

| Ruta | Acción |
| --- | --- |
| `/productos-form` | Crear producto |
| `/productos-form/{id}` | Editar producto |
| Sin `id` al guardar | `POST /items/productos` |
| Con `id` al guardar | `PATCH /items/productos/{id}` |
| Guardado exitoso | Navegar a `/productos-list` |
| Regreso al listado | `ionViewWillEnter()` → `cargarProductos()` |

La diferencia principal entre ambas variantes de actualización es:

| Página normal | Modal |
| --- | --- |
| Navega a `/productos-form/{id}` | Permanece en `productos-list` |
| Recibe el `id` con `ActivatedRoute` | Recibe el `id` con `@Input()` |
| Utiliza `Router` al terminar | Utiliza `ModalController.dismiss()` |
| El listado se actualiza con `ionViewWillEnter()` | El listado se actualiza después de `onDidDismiss()` |
| Cambia la ruta visible | No cambia la ruta del listado |
