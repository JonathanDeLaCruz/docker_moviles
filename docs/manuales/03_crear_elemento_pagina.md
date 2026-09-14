# Crear un elemento con Ionic mediante una página

En esta práctica se continuará con el proyecto desarrollado en los manuales anteriores para crear un nuevo producto desde **Ionic con Angular y TypeScript**.

La aplicación enviará una petición `POST` a Directus y Directus almacenará el registro en MariaDB.

Se utilizará la colección:

```text
productos
```

La petición se realizará a:

```text
http://localhost:8000/items/productos
```

Esta práctica parte de la configuración realizada anteriormente. Por lo tanto, no se volverá a instalar Axios ni a configurar `environment`, CORS o la conexión con Directus.

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Crear la página `productos-form`.
2. Abrir el formulario desde `productos-list`.
3. Configurar un formulario reactivo.
4. Mantener los mensajes de validación en `page.ts`.
5. Consultar los errores mediante un método `getError()`.
6. Enviar los datos mediante una petición `POST` a Directus.
7. Regresar al listado después de guardar.
8. Recargar automáticamente el listado para mostrar el nuevo producto.

El flujo será:

```text
productos-list
      |
      | Nuevo
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
      | Guardado
      v
productos-list
      |
      v
GET /items/productos
```

---

## 1. Permitir la creación de productos en Directus

En Directus, la política utilizada durante las prácticas ya tiene permiso de lectura sobre la colección `productos`.

Para crear registros también debe habilitarse:

```text
Create
```

Ingresa a:

```text
http://localhost:8000
```

Abre **Access Policies**, localiza la política utilizada y habilita el permiso `Create` para:

```text
productos
```

Los campos que se enviarán en esta práctica son:

```text
nombre
descripcion
precio
stock
```

No se enviarán manualmente:

```text
id
fecha_registro
```

porque estos valores son generados por la base de datos.

---

## 2. Crear la página `productos-form`

Desde la carpeta donde se encuentra `docker-compose.yml`, ejecuta:

```powershell
docker compose exec mobile ionic g page productos-form
```

Ionic generará:

```text
src/app/productos-form/
├── productos-form-routing.module.ts
├── productos-form.module.ts
├── productos-form.page.html
├── productos-form.page.scss
├── productos-form.page.spec.ts
└── productos-form.page.ts
```

En esta versión del proyecto es necesario agregar manualmente:

```typescript
standalone: false,
```

en:

```text
src/app/productos-form/productos-form.page.ts
```

El decorador deberá quedar de forma similar a:

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

Modifica la importación de formularios:

```typescript
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
```

Después agrega:

```typescript
ReactiveFormsModule
```

al arreglo `imports`.

El módulo deberá quedar de forma similar a:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosFormPageRoutingModule } from './productos-form-routing.module';

import { ProductosFormPage } from './productos-form.page';

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

`ReactiveFormsModule` permitirá utilizar:

```html
[formGroup]
```

y:

```html
formControlName
```

en la vista.

---

## 4. Hacer que el listado se recargue al regresar

En el manual 01 los productos se cargaron desde:

```typescript
ngOnInit()
```

El problema es que Ionic puede conservar la página en memoria cuando se navega hacia otra página.

Al regresar a `productos-list`, `ngOnInit()` no necesariamente vuelve a ejecutarse.

Para que el listado se consulte cada vez que la página vuelva a mostrarse se utilizará el ciclo de vida de Ionic:

```typescript
ionViewWillEnter()
```

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

Si actualmente tienes:

```typescript
ngOnInit(): void {
  this.cargarProductos();
}
```

reemplázalo por:

```typescript
ionViewWillEnter(): void {
  this.cargarProductos();
}
```

Si la clase tiene:

```typescript
implements OnInit
```

elimínalo.

También puedes retirar `OnInit` de la importación:

```typescript
import { Component } from '@angular/core';
```

La parte principal del archivo quedará de forma similar a:

```typescript
@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.page.html',
  styleUrls: ['./productos-list.page.scss'],
  standalone: false,
})
export class ProductosListPage {

  productos: Producto[] = [];

  constructor() {}

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

A partir de este momento:

```text
Entrar a productos-list
        |
        v
ionViewWillEnter()
        |
        v
cargarProductos()
        |
        v
GET /items/productos
```

Esto permitirá mostrar un producto recién creado cuando el usuario regrese al listado.

---

## 5. Agregar el botón para crear un producto

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Dentro de `ion-toolbar`, después de `ion-title`, agrega:

```html
<ion-buttons slot="end">
  <ion-button [routerLink]="['/productos-form']">
    Nuevo
  </ion-button>
</ion-buttons>
```

La cabecera quedará de forma similar a:

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Productos</ion-title>

    <ion-buttons slot="end">
      <ion-button [routerLink]="['/productos-form']">
        Nuevo
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

Al presionar el botón Angular navegará a:

```text
/productos-form
```

---

## 6. Importar los elementos del formulario

Abre:

```text
src/app/productos-form/productos-form.page.ts
```

Utiliza las siguientes importaciones:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';
```

| Importación | Uso |
| --- | --- |
| `FormBuilder` | Crear el formulario |
| `FormGroup` | Representar el formulario |
| `Validators` | Definir validaciones |
| `AlertController` | Mostrar mensajes |
| `Router` | Regresar al listado |
| `axios` | Enviar la petición `POST` |
| `environment` | Obtener la URL base de Directus |

---

## 7. Crear la interfaz de los datos

Antes de la clase agrega:

```typescript
interface ProductoCrear {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}
```

La interfaz contiene únicamente los datos que serán enviados a Directus.

---

## 8. Crear las variables del formulario

Dentro de la clase agrega:

```typescript
productoForm!: FormGroup;
guardando: boolean = false;
```

`productoForm` contendrá los controles del formulario.

`guardando` permitirá evitar múltiples peticiones mientras se realiza el `POST`.

---

## 9. Mantener los mensajes de validación en `page.ts`

Para mantener el HTML más limpio, los mensajes de validación se definirán en TypeScript.

Dentro de la clase agrega:

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

Cada control contiene los mensajes asociados con los errores que pueden devolver los `Validators`.

Por ejemplo:

```text
nombre
  |
  ├── required
  └── maxlength
```

---

## 10. Configurar el constructor

Reemplaza el constructor vacío por:

```typescript
constructor(
  private formBuilder: FormBuilder,
  private alertController: AlertController,
  private router: Router
) {}
```

---

## 11. Crear el formulario

Dentro de `ngOnInit()` ejecuta:

```typescript
ngOnInit(): void {
  this.crearFormulario();
}
```

Después agrega:

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

Los controles utilizados son:

```text
nombre
descripcion
precio
stock
```

---

## 12. Crear el método `getError()`

Dentro de la clase agrega:

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

El método recibe el nombre de un control:

```typescript
getError('nombre')
```

Después:

1. busca el control dentro del formulario;
2. comprueba si contiene errores;
3. obtiene el primer tipo de error;
4. busca su mensaje en `mensajesValidacion`;
5. devuelve el mensaje correspondiente.

Por ejemplo:

```text
nombre
   |
   v
required
   |
   v
El nombre es obligatorio.
```

De esta forma los textos de validación permanecen en `page.ts` y el HTML solamente solicita el mensaje que debe mostrar.

---

## 13. Crear el método `guardarProducto()`

Dentro de la clase agrega:

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
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('/productos-list');
          }
        }
      ]
    });

    await alerta.present();
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

---

## 14. Validar antes de enviar

La condición:

```typescript
if (this.productoForm.invalid) {
  this.productoForm.markAllAsTouched();
  return;
}
```

impide enviar información inválida.

`markAllAsTouched()` provoca que los mensajes controlados por `getError()` puedan mostrarse cuando el usuario intenta guardar un formulario incorrecto.

---

## 15. Preparar los datos

Los valores se obtienen mediante:

```typescript
const valores = this.productoForm.value;
```

Después se construye:

```typescript
const producto: ProductoCrear = {
  nombre: valores.nombre.trim(),
  descripcion: valores.descripcion?.trim() ?? '',
  precio: Number(valores.precio),
  stock: Number(valores.stock)
};
```

El JSON enviado será similar a:

```json
{
  "nombre": "Mouse",
  "descripcion": "Mouse inalámbrico",
  "precio": 450,
  "stock": 10
}
```

---

## 16. Realizar la petición `POST`

La petición:

```typescript
await axios.post(
  `${environment.apiUrl}/items/productos`,
  producto,
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
```

durante el desarrollo se enviará a:

```text
http://localhost:8000/items/productos
```

Directus recibirá el JSON y creará el registro en MariaDB.

---

## 17. Código completo de `productos-form.page.ts`

El archivo deberá quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
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
    private router: Router
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
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.router.navigateByUrl('/productos-list');
            }
          }
        ]
      });

      await alerta.present();
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

## 18. Configurar `productos-form.page.html`

Abre:

```text
src/app/productos-form/productos-form.page.html
```

Reemplaza el contenido por:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/productos-list"></ion-back-button>
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

El HTML ya no contiene los textos específicos de cada validación. Solamente llama a:

```typescript
getError(...)
```

y muestra el mensaje devuelto desde `page.ts`.

---

## 19. Probar la creación

Abre:

```text
http://localhost:8100/productos-list
```

Presiona:

```text
Nuevo
```

Prueba primero enviar el formulario vacío.

Los errores deberán mostrarse debajo de los campos.

Después captura, por ejemplo:

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

Al aceptar el mensaje de confirmación la aplicación regresará a:

```text
productos-list
```

Al entrar nuevamente en la página se ejecutará:

```typescript
ionViewWillEnter()
```

y el listado realizará otra petición:

```text
GET /items/productos
```

por lo que el producto recién creado deberá aparecer sin recargar manualmente el navegador.

---

## 20. Resumen

Los elementos nuevos de esta práctica son:

1. Permiso `Create` de Directus.
2. Página `productos-form`.
3. `ReactiveFormsModule`.
4. Formularios reactivos.
5. `Validators`.
6. Mensajes de validación almacenados en `page.ts`.
7. Método `getError()`.
8. Petición `POST` con Axios.
9. Navegación al listado con `Router`.
10. Uso de `ionViewWillEnter()` para actualizar automáticamente el listado al regresar.

No fue necesario repetir la instalación de Axios, la configuración de `environment` ni la configuración CORS, porque forman parte de las prácticas anteriores.
