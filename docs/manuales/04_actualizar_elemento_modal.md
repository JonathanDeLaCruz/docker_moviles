# Actualizar un elemento con Ionic mediante un modal

En esta práctica se actualizará un producto existente utilizando el mismo formulario creado para registrar productos, pero abriéndolo mediante un **modal de Ionic**.

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

En esta variante no se navegará hacia otra página visible. `productos-list` permanecerá abierto y `productos-form` se mostrará encima mediante `ModalController`.

Cuando el modal se cierre después de actualizar, el listado volverá a ejecutar `cargarProductos()` para mostrar inmediatamente los cambios.

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Agregar un botón para editar cada producto.
2. Abrir `productos-form` mediante `ModalController`.
3. Enviar el `id` del producto mediante `componentProps`.
4. Reutilizar el formulario existente para crear y actualizar.
5. Consultar el producto mediante `GET` por `id`.
6. Cargar los datos existentes con `patchValue()`.
7. Mantener los mensajes de validación en `page.ts`.
8. Utilizar el método `getError()`.
9. Actualizar el producto mediante `PATCH`.
10. Cerrar el modal después de actualizar.
11. Informar al listado que se guardaron cambios.
12. Recargar los productos al cerrar el modal.

El flujo será:

```text
productos-list
      |
      | Editar
      v
ModalController
      |
      | componentProps: { id }
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
      | guardado = true
      v
Cerrar modal
      |
      v
productos-list
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
Sin id
   |
   v
Crear producto
   |
   v
POST
```

```text
Con id
   |
   v
Editar producto
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

## 3. Agregar el botón `Editar`

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Dentro del elemento donde se muestra cada producto agrega un botón similar a:

```html
<ion-button fill="clear" color="warning" (click)="editarProducto(producto.id)">
  <ion-icon slot="icon-only" name="pencil"></ion-icon>
</ion-button>
```

La parte importante es:

```html
(click)="editarProducto(producto.id)"
```

El método recibirá el `id` correspondiente al producto seleccionado.

Por ejemplo, si el producto tiene:

```text
id = 5
```

se ejecutará:

```typescript
editarProducto(5)
```

En esta variante no se utilizará:

```html
[routerLink]
```

porque el formulario se abrirá mediante un modal.

---

## 4. Importar `ModalController` y `ProductosFormPage`

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

Si ya realizaste la práctica de creación mediante modal, estas importaciones ya deben existir:

```typescript
import { ModalController } from '@ionic/angular';
import { ProductosFormPage } from '../productos-form/productos-form.page';
```

El constructor debe contener:

```typescript
constructor(
  private modalController: ModalController
) {}
```

---

## 5. Crear `editarProducto()`

Dentro de `ProductosListPage` agrega:

```typescript
async editarProducto(id: number): Promise<void> {
  const modal = await this.modalController.create({
    component: ProductosFormPage,
    componentProps: {
      id: id
    },
    breakpoints: [0, 0.5, 0.95],
    initialBreakpoint: 0.95
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (data?.guardado) {
    await this.cargarProductos();
  }
}
```

La propiedad:

```typescript
component: ProductosFormPage
```

indica qué componente se abrirá dentro del modal.

La propiedad:

```typescript
componentProps: {
  id: id
}
```

envía el identificador del producto al formulario.

Si se seleccionó el producto con `id = 5`, Ionic enviará:

```typescript
{
  id: 5
}
```

al componente `ProductosFormPage`.

Después de cerrar el modal se obtiene:

```typescript
const { data } = await modal.onDidDismiss();
```

Si el formulario devuelve:

```typescript
guardado: true
```

se ejecutará:

```typescript
await this.cargarProductos();
```

para volver a consultar la colección.

---

## 6. Fragmento principal de `productos-list.page.ts`

La parte relacionada con crear y editar mediante modal puede quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ProductosFormPage } from '../productos-form/productos-form.page';

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

  constructor(
    private modalController: ModalController
  ) {}

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

  async nuevoProducto(): Promise<void> {
    const modal = await this.modalController.create({
      component: ProductosFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.guardado) {
      await this.cargarProductos();
    }
  }

  async editarProducto(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: ProductosFormPage,
      componentProps: {
        id: id
      },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.guardado) {
      await this.cargarProductos();
    }
  }
}
```

La diferencia entre ambos métodos es que `editarProducto()` envía:

```typescript
componentProps: {
  id: id
}
```

mientras que `nuevoProducto()` abre el formulario sin enviar un identificador.

---

## 7. Recibir el `id` en `productos-form`

Abre:

```text
src/app/productos-form/productos-form.page.ts
```

Modifica la importación de Angular para incluir `Input`:

```typescript
import { Component, Input, OnInit } from '@angular/core';
```

Dentro de la clase agrega:

```typescript
@Input() id?: number;
```

`@Input()` permite recibir valores enviados desde el componente que abre el modal.

En este caso llegará el valor enviado mediante:

```typescript
componentProps: {
  id: id
}
```

El flujo será:

```text
producto.id
   |
   v
editarProducto(id)
   |
   v
componentProps
   |
   v
@Input() id
```

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

`ProductoGuardar` representa únicamente los campos que se enviarán a Directus.

`ProductoDetalle` representa la respuesta obtenida al consultar un producto por su `id`.

---

## 9. Mantener las variables del formulario

Dentro de la clase conserva:

```typescript
productoForm!: FormGroup;
guardando: boolean = false;
```

y agrega:

```typescript
cargando: boolean = false;
```

Esta variable permitirá saber si todavía se están obteniendo los datos del producto.

---

## 10. Crear `esEdicion`

Dentro de la clase agrega:

```typescript
get esEdicion(): boolean {
  return this.id !== undefined;
}
```

Este getter permitirá determinar el comportamiento del formulario.

Si existe un `id`:

```text
esEdicion = true
```

Si no existe:

```text
esEdicion = false
```

Esto se utilizará para cambiar textos como:

```text
Nuevo producto
Editar producto
```

y para decidir entre:

```text
POST
PATCH
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

No es necesario crear otros mensajes únicamente por tratarse de una actualización.

Las mismas reglas se aplicarán tanto para crear como para editar.

---

## 12. Mantener el constructor

El constructor continúa utilizando:

```typescript
constructor(
  private formBuilder: FormBuilder,
  private alertController: AlertController,
  private modalController: ModalController
) {}
```

En la variante mediante modal no se necesita:

```typescript
Router
```

porque el formulario se cerrará mediante `ModalController`.

---

## 13. Crear primero el formulario y después cargar los datos

Modifica `ngOnInit()`:

```typescript
async ngOnInit(): Promise<void> {
  this.crearFormulario();

  if (this.esEdicion) {
    await this.cargarProducto();
  }
}
```

El orden es importante.

Primero debe ejecutarse:

```typescript
this.crearFormulario();
```

porque `cargarProducto()` utilizará:

```typescript
this.productoForm.patchValue(...)
```

Si el formulario todavía no existe, no sería posible cargar los datos recibidos desde Directus.

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

No se agrega un control para:

```text
id
```

porque ese valor solamente se utilizará para identificar el registro en la URL.

---

## 15. Mantener `getError()`

Conserva:

```typescript
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
```

Este método funcionará de la misma manera cuando el formulario se utilice para editar.

---

## 16. Crear `cargarProducto()`

Agrega:

```typescript
private async cargarProducto(): Promise<void> {
  if (this.id === undefined) {
    return;
  }

  this.cargando = true;

  try {
    const response = await axios.get<{ data: ProductoDetalle }>(
      `${environment.apiUrl}/items/productos/${this.id}`
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

La petición:

```typescript
axios.get(
  `${environment.apiUrl}/items/productos/${this.id}`
)
```

consultará una URL similar a:

```text
http://localhost:8000/items/productos/5
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

Después se utiliza:

```typescript
this.productoForm.patchValue(...)
```

para colocar los valores existentes dentro del formulario.

---

## 17. ¿Por qué utilizar `patchValue()`?

`patchValue()` permite actualizar únicamente los controles indicados.

En este caso se cargan:

```text
nombre
descripcion
precio
stock
```

pero no:

```text
id
fecha_registro
```

Por eso es apropiado utilizar:

```typescript
this.productoForm.patchValue({
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: producto.precio,
  stock: producto.stock
});
```

El `id` permanece separado y se utiliza únicamente para construir la URL de actualización.

---

## 18. Mantener `cerrarModal()`

Conserva:

```typescript
async cerrarModal(): Promise<void> {
  await this.modalController.dismiss({
    guardado: false
  });
}
```

Si el usuario cierra el formulario sin guardar, el listado recibirá:

```typescript
guardado: false
```

por lo que no será necesario volver a ejecutar `cargarProductos()`.

---

## 19. Modificar `guardarProducto()`

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
    if (this.esEdicion && this.id !== undefined) {
      await axios.patch(
        `${environment.apiUrl}/items/productos/${this.id}`,
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

    await this.modalController.dismiss({
      guardado: true
    });
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
if (this.esEdicion && this.id !== undefined)
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

## 20. Petición `PATCH`

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

No es necesario enviar:

```text
id
fecha_registro
```

El identificador ya forma parte de la URL.

---

## 21. Código completo de `productos-form.page.ts`

El archivo puede quedar de forma similar a:

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
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

  @Input() id?: number;

  productoForm!: FormGroup;
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
    private modalController: ModalController
  ) {}

  get esEdicion(): boolean {
    return this.id !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.crearFormulario();

    if (this.esEdicion) {
      await this.cargarProducto();
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
    if (this.id === undefined) {
      return;
    }

    this.cargando = true;

    try {
      const response = await axios.get<{ data: ProductoDetalle }>(
        `${environment.apiUrl}/items/productos/${this.id}`
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

  async cerrarModal(): Promise<void> {
    await this.modalController.dismiss({
      guardado: false
    });
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
      if (this.esEdicion && this.id !== undefined) {
        await axios.patch(
          `${environment.apiUrl}/items/productos/${this.id}`,
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

      await this.modalController.dismiss({
        guardado: true
      });
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

## 22. Modificar el HTML del formulario

Abre:

```text
src/app/productos-form/productos-form.page.html
```

El título puede cambiar automáticamente según el modo:

```html
<ion-title>
  {{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}
</ion-title>
```

El botón también puede cambiar su texto:

```html
<ion-button expand="block" type="submit" class="ion-margin-top" [disabled]="guardando || cargando">
  {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar') }}
</ion-button>
```

El HTML completo puede quedar de forma similar a:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button (click)="cerrarModal()">
        Cancelar
      </ion-button>
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
      {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar')}}
    </ion-button>
  </form>
</ion-content>
```

---

## 23. Cómo se actualiza el listado

En esta variante `productos-list` nunca abandona la página.

Después de actualizar correctamente, el formulario ejecuta:

```typescript
await this.modalController.dismiss({
  guardado: true
});
```

El listado está esperando el cierre mediante:

```typescript
const { data } = await modal.onDidDismiss();
```

Después valida:

```typescript
if (data?.guardado) {
  await this.cargarProductos();
}
```

El flujo exacto será:

```text
PATCH exitoso
      |
      v
dismiss({ guardado: true })
      |
      v
onDidDismiss()
      |
      v
data.guardado
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

No es necesario recargar manualmente el navegador.

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

el modal deberá ejecutar:

```text
GET http://localhost:8000/items/productos/5
```

El formulario deberá aparecer con los datos actuales.

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

1. el modal debe cerrarse;
2. debe regresar `guardado: true`;
3. debe ejecutarse `cargarProductos()`;
4. el producto debe mostrar inmediatamente los datos modificados;
5. no debe ser necesario recargar el navegador.

También prueba el botón:

```text
Cancelar
```

En ese caso el modal devolverá:

```typescript
guardado: false
```

y el listado no realizará una nueva consulta.

---

## 25. Resumen

Esta variante utiliza:

```text
ModalController
```

para abrir el mismo formulario tanto al crear como al actualizar.

Los elementos principales son:

1. Permisos `Read` y `Update` en Directus.
2. Botón `Editar` en `productos-list`.
3. `componentProps` para enviar el `id`.
4. `@Input()` para recibir el `id` en `productos-form`.
5. Formulario reactivo reutilizable.
6. Mensajes de validación almacenados en `page.ts`.
7. Método `getError()`.
8. Petición `GET` por `id` para cargar los datos existentes.
9. `patchValue()` para llenar el formulario.
10. Petición `PATCH` para actualizar el producto.
11. `dismiss({ guardado: true })` para informar que hubo cambios.
12. `onDidDismiss()` para recibir el resultado.
13. `cargarProductos()` para actualizar inmediatamente el listado.

La lógica principal será:

| Situación | Acción |
| --- | --- |
| El modal se abre sin `id` | Crear producto |
| El modal se abre con `id` | Editar producto |
| Sin `id` al guardar | `POST /items/productos` |
| Con `id` al guardar | `PATCH /items/productos/{id}` |
| Guardado exitoso | `dismiss({ guardado: true })` |
| Modal cerrado con cambios | `cargarProductos()` |

De esta manera `productos-form` continúa siendo un único formulario reutilizable para las operaciones de creación y actualización.
