# Crear un elemento con Ionic mediante un modal

En esta práctica se creará un nuevo producto utilizando un **modal de Ionic**.

Se utilizarán las mismas tecnologías y la misma colección de las prácticas anteriores:

```text
Ionic
Angular
TypeScript
Axios
Directus
MariaDB
```

La petición de creación será:

```text
POST http://localhost:8000/items/productos
```

Esta variante no navegará desde `productos-list` hacia otra página visible. El formulario se abrirá encima del listado mediante `ModalController`.

Cuando el modal se cierre después de guardar, el listado volverá a ejecutar `cargarProductos()` para mostrar inmediatamente el nuevo registro.

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Crear `productos-form` para utilizarlo dentro de un modal.
2. Abrir el modal desde `productos-list`.
3. Utilizar un formulario reactivo.
4. Mantener los mensajes de validación en `page.ts`.
5. Utilizar un método `getError()`.
6. Crear el producto mediante `POST`.
7. Cerrar el modal después de guardar.
8. Informar al listado que se creó un registro.
9. Recargar los productos al cerrar el modal.

El flujo será:

```text
productos-list
      |
      | Nuevo
      v
ModalController
      |
      v
productos-form
      |
      | POST
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

## 1. Permitir la creación en Directus

La política utilizada durante las prácticas debe tener permiso:

```text
Create
```

sobre:

```text
productos
```

Los campos enviados serán:

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

porque son generados por la base de datos.

---

## 2. Crear `productos-form`

Si todavía no existe, genera la página:

```powershell
docker compose exec mobile ionic g page productos-form
```

La estructura será similar a:

```text
src/app/productos-form/
├── productos-form-routing.module.ts
├── productos-form.module.ts
├── productos-form.page.html
├── productos-form.page.scss
├── productos-form.page.spec.ts
└── productos-form.page.ts
```

En:

```text
productos-form.page.ts
```

agrega manualmente:

```typescript
standalone: false,
```

El componente deberá contener:

```typescript
@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.page.html',
  styleUrls: ['./productos-form.page.scss'],
  standalone: false,
})
```

---

## 3. Agregar `ReactiveFormsModule`

Abre:

```text
src/app/productos-form/productos-form.module.ts
```

Importa:

```typescript
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
```

Después agrega `ReactiveFormsModule`:

```typescript
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductosFormPageRoutingModule
  ],
  declarations: [ProductosFormPage]
})
export class ProductosFormPageModule {}
```

---

## 4. Cargar el módulo del formulario en el listado

Como `ProductosFormPage` se abrirá directamente desde `ModalController`, su módulo debe estar disponible desde el módulo del listado.

Abre:

```text
src/app/productos-list/productos-list.module.ts
```

Importa:

```typescript
import { ProductosFormPageModule } from '../productos-form/productos-form.module';
```

Después agrega:

```typescript
ProductosFormPageModule
```

al arreglo `imports`.

El módulo quedará de forma similar a:

```typescript
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosListPageRoutingModule,
    ProductosFormPageModule
  ],
  declarations: [ProductosListPage]
})
export class ProductosListPageModule {}
```

Esto permite que la página del formulario pueda utilizarse como contenido del modal.

---

## 5. Agregar el botón `Nuevo`

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Fuera de `</ion-content>`, agrega:

```html
<ion-fab slot="fixed" vertical="bottom" horizontal="center">
    <ion-fab-button (click)="nuevoProducto()">
        <ion-icon name="add"></ion-icon>
    </ion-fab-button>
</ion-fab>
```

En esta variante no se utilizará:

```html
[routerLink]
```

porque el formulario se abrirá mediante código.

---

## 6. Importar `ModalController` y la página del formulario

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

Agrega:

```typescript
import { ModalController } from '@ionic/angular';
import { ProductosFormPage } from '../productos-form/productos-form.page';
```

Después modifica el constructor:

```typescript
constructor(
  private modalController: ModalController
) {}
```

---

## 7. Crear el método `nuevoProducto()`

Dentro de `ProductosListPage` agrega:

```typescript
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
```

La instrucción:

```typescript
this.modalController.create(...)
```

crea el modal.

La propiedad:

```typescript
component: ProductosFormPage
```

indica qué componente se mostrará.

Los valores:

```typescript
breakpoints: [0, 0.5, 0.95]
initialBreakpoint: 0.95
```

permiten mostrar el modal como una hoja desplazable.

Después de cerrar el modal se obtiene:

```typescript
data
```

Si el formulario devuelve:

```typescript
guardado: true
```

se ejecuta:

```typescript
await this.cargarProductos();
```

Esta llamada es la que actualiza inmediatamente el listado.

---

## 8. Fragmento principal de `productos-list.page.ts`

La parte relacionada con el modal quedará de forma similar a:

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
}
```

En esta variante `ngOnInit()` puede conservarse porque el listado no abandona la página cuando se abre el formulario.

El refresco posterior al guardado se realiza explícitamente después de cerrar el modal.

---

## 9. Importar los elementos del formulario

En:

```text
src/app/productos-form/productos-form.page.ts
```

utiliza:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
```

En esta variante no se necesita:

```typescript
Router
```

porque no se navegará hacia otra página.

---

## 10. Crear la interfaz

Antes de la clase agrega:

```typescript
interface ProductoCrear {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}
```

---

## 11. Crear las variables

Dentro de la clase agrega:

```typescript
productoForm!: FormGroup;
guardando: boolean = false;
```

---

## 12. Mantener los mensajes en `page.ts`

Agrega:

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

De esta manera los mensajes no se repiten en el HTML.

---

## 13. Configurar el constructor

Utiliza:

```typescript
constructor(
  private formBuilder: FormBuilder,
  private alertController: AlertController,
  private modalController: ModalController
) {}
```

---

## 14. Crear el formulario

Dentro de `ngOnInit()`:

```typescript
ngOnInit(): void {
  this.crearFormulario();
}
```

Agrega:

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

---

## 15. Crear `getError()`

Agrega:

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

El método funciona de la misma manera que en la variante mediante páginas:

```text
Control
   |
   v
Error
   |
   v
mensajesValidacion
   |
   v
Mensaje
```

---

## 16. Crear `cerrarModal()`

Agrega:

```typescript
async cerrarModal(): Promise<void> {
  await this.modalController.dismiss({
    guardado: false
  });
}
```

Este método permitirá cerrar el formulario sin registrar un producto.

El listado recibirá:

```typescript
guardado: false
```

por lo que no realizará una nueva consulta.

---

## 17. Crear `guardarProducto()`

Agrega:

```typescript
async guardarProducto(): Promise<void> {
  if (this.productoForm.invalid) {
    this.productoForm.markAllAsTouched();
    return;
  }

  this.guardando = true;

  const valores = this.productoForm.value;

  const producto: ProductoCrear = {
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion?.trim() ?? '',
    precio: Number(valores.precio),
    stock: Number(valores.stock)
  };

  try {
    await axios.post(
      `${environment.apiUrl}/items/productos`,
      producto,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const alerta = await this.alertController.create({
      header: 'Producto guardado',
      message: 'El producto fue registrado correctamente.',
      buttons: ['Aceptar']
    });

    await alerta.present();
    await alerta.onDidDismiss();

    await this.modalController.dismiss({
      guardado: true
    });
  } catch (error) {
    console.error('Error al guardar el producto:', error);

    const alerta = await this.alertController.create({
      header: 'Error',
      message: 'No fue posible guardar el producto. Revisa los datos, la conexión y los permisos de creación en Directus.',
      buttons: ['Aceptar']
    });

    await alerta.present();
  } finally {
    this.guardando = false;
  }
}
```

Después de guardar correctamente se ejecuta:

```typescript
this.modalController.dismiss({
  guardado: true
});
```

Ese valor regresará a:

```typescript
modal.onDidDismiss()
```

en `productos-list.page.ts`.

---

## 18. Código completo de `productos-form.page.ts`

El archivo deberá quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface ProductoCrear {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.page.html',
  styleUrls: ['./productos-form.page.scss'],
  standalone: false,
})
export class ProductosFormPage implements OnInit {

  productoForm!: FormGroup;
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

  ngOnInit(): void {
    this.crearFormulario();
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

    const producto: ProductoCrear = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion?.trim() ?? '',
      precio: Number(valores.precio),
      stock: Number(valores.stock)
    };

    try {
      await axios.post(
        `${environment.apiUrl}/items/productos`,
        producto,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const alerta = await this.alertController.create({
        header: 'Producto guardado',
        message: 'El producto fue registrado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.modalController.dismiss({
        guardado: true
      });
    } catch (error) {
      console.error('Error al guardar el producto:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el producto. Revisa los datos, la conexión y los permisos de creación en Directus.',
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

## 19. Configurar el HTML del modal

Abre:

```text
src/app/productos-form/productos-form.page.html
```

Utiliza:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button (click)="cerrarModal()">
        Cancelar
      </ion-button>
    </ion-buttons>
    <ion-title>Nuevo producto</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form *ngIf="productoForm" [formGroup]="productoForm" (ngSubmit)="guardarProducto()">
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

    <ion-button expand="block" type="submit" class="ion-margin-top" [disabled]="guardando">
      {{ guardando ? 'Guardando...' : 'Guardar' }}
    </ion-button>
  </form>
</ion-content>
```

---

## 20. Cómo se actualiza el listado

En esta variante no es necesario modificar `ngOnInit()` por `ionViewWillEnter()` para resolver la actualización posterior al guardado.

El listado permanece abierto debajo del modal.

Cuando el formulario guarda correctamente devuelve:

```typescript
{
  guardado: true
}
```

Después:

```typescript
const { data } = await modal.onDidDismiss();

if (data?.guardado) {
  await this.cargarProductos();
}
```

vuelve a consultar Directus.

El flujo exacto será:

```text
POST exitoso
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

---

## 21. Probar el modal

Abre:

```text
http://localhost:8100/productos-list
```

Presiona:

```text
Nuevo
```

El formulario deberá aparecer como modal.

Prueba enviar el formulario vacío para comprobar los mensajes devueltos por:

```typescript
getError()
```

Después captura:

```text
Nombre: Mouse
Descripción: Mouse inalámbrico
Precio: 450
Stock: 10
```

Presiona:

```text
Guardar
```

Después de aceptar el mensaje:

1. el modal debe cerrarse;
2. debe ejecutarse `cargarProductos()`;
3. el nuevo producto debe aparecer inmediatamente en el listado;
4. no debe ser necesario recargar el navegador.

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

## 22. Resumen

Esta variante utiliza:

```text
ModalController
```

en lugar de navegar hacia una página independiente.

Los elementos principales son:

1. Permiso `Create` en Directus.
2. `productos-form` utilizado como contenido del modal.
3. `ReactiveFormsModule`.
4. Formularios reactivos.
5. Mensajes de validación almacenados en `page.ts`.
6. Método `getError()`.
7. `ModalController.create()` para abrir el formulario.
8. Petición `POST` con Axios.
9. `dismiss({ guardado: true })` para informar que se creó un producto.
10. `onDidDismiss()` para recibir el resultado.
11. `cargarProductos()` para actualizar inmediatamente el listado.

La diferencia principal entre ambas variantes es:

| Página normal | Modal |
| --- | --- |
| Navega a `/productos-form` | Permanece en `productos-list` |
| Utiliza `Router` al terminar | Utiliza `ModalController.dismiss()` |
| El listado se actualiza con `ionViewWillEnter()` | El listado se actualiza después de `onDidDismiss()` |
| Cambia la ruta visible | No cambia la ruta del listado |
