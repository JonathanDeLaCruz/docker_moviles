# Eliminar un elemento con Ionic

En esta práctica se eliminará un producto existente directamente desde el listado de productos.

Se utilizarán las mismas tecnologías y la misma colección de las prácticas anteriores:

```text
Ionic
Angular
TypeScript
Axios
Directus
MariaDB
```

La petición de eliminación será:

```text
DELETE http://localhost:8000/items/productos/{id}
```

Antes de eliminar el registro se mostrará una alerta de confirmación mediante `AlertController`.

Después de eliminar correctamente el producto, el listado volverá a ejecutar `cargarProductos()` para consultar nuevamente los registros disponibles.

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Agregar un botón para eliminar cada producto.
2. Solicitar confirmación antes de eliminar.
3. Enviar el `id` del producto seleccionado al método de eliminación.
4. Eliminar el producto mediante `DELETE`.
5. Mostrar un mensaje cuando la eliminación sea correcta.
6. Mostrar un mensaje si ocurre un error.
7. Volver a ejecutar `cargarProductos()` después de eliminar.
8. Actualizar el listado sin recargar manualmente el navegador.

El flujo será:

```text
productos-list
      |
      | Eliminar
      v
AlertController
      |
      | Confirmar
      v
DELETE /items/productos/{id}
      |
      v
Directus
      |
      v
MariaDB
      |
      | eliminación correcta
      v
Mensaje de confirmación
      |
      v
cargarProductos()
      |
      v
Listado actualizado
```

---

## 1. Permitir la eliminación en Directus

La política utilizada durante las prácticas debe tener permiso:

```text
Delete
```

sobre:

```text
productos
```

Este permiso es necesario para ejecutar:

```text
DELETE /items/productos/{id}
```

Por ejemplo, para eliminar el producto con:

```text
id = 5
```

la petición será:

```text
DELETE http://localhost:8000/items/productos/5
```

La eliminación borra el registro seleccionado de la colección, por lo que debe solicitarse confirmación antes de realizar la petición.

---

## 2. Agregar el botón `Eliminar`

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Dentro del elemento donde se muestra cada producto agrega un botón similar a:

```html
<ion-button fill="clear" color="danger" (click)="confirmarEliminar(producto.id, producto.nombre)">
  <ion-icon slot="icon-only" name="trash"></ion-icon>
</ion-button>
```

La parte importante es:

```html
(click)="confirmarEliminar(producto.id, producto.nombre)"
```

Se enviarán dos valores:

```text
producto.id
producto.nombre
```

El `id` permitirá identificar qué registro debe eliminarse.

El `nombre` se utilizará únicamente para mostrar un mensaje de confirmación más claro al usuario.

Por ejemplo, si el producto seleccionado contiene:

```text
id = 5
nombre = Mouse
```

se ejecutará:

```typescript
confirmarEliminar(5, 'Mouse')
```

---

## 3. Importar `AlertController`

Abre:

```text
src/app/productos-list/productos-list.page.ts
```

Importa:

```typescript
import { AlertController } from '@ionic/angular';
```

Si la rama utilizada trabaja también con `ModalController`, ambos pueden importarse en la misma línea:

```typescript
import { AlertController, ModalController } from '@ionic/angular';
```

---

## 4. Agregar `AlertController` al constructor

Dentro de `ProductosListPage` agrega `AlertController` al constructor.

Si tu listado utiliza únicamente `AlertController`, el constructor puede quedar así:

```typescript
constructor(
  private alertController: AlertController
) {}
```

Si estás trabajando con la rama que utiliza modales para crear y actualizar, probablemente ya tienes `ModalController`.

En ese caso utiliza:

```typescript
constructor(
  private modalController: ModalController,
  private alertController: AlertController
) {}
```

Cada controlador tiene una responsabilidad diferente:

```text
ModalController
      |
      v
Abrir y cerrar formularios mediante modal
```

```text
AlertController
      |
      v
Mostrar mensajes y solicitar confirmación
```

---

## 5. Crear `confirmarEliminar()`

Dentro de `ProductosListPage` agrega:

```typescript
async confirmarEliminar(id: number, nombre: string): Promise<void> {
  const alerta = await this.alertController.create({
    header: 'Eliminar producto',
    message: `¿Estás seguro de eliminar el producto "${nombre}"?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          void this.eliminarProducto(id);
        }
      }
    ]
  });

  await alerta.present();
}
```

Este método todavía no elimina el producto.

Su responsabilidad es solicitar confirmación antes de continuar.

La alerta tendrá dos opciones:

```text
Cancelar
Eliminar
```

Si se selecciona:

```text
Cancelar
```

no se realiza ninguna petición a Directus.

Si se selecciona:

```text
Eliminar
```

se ejecuta:

```typescript
this.eliminarProducto(id)
```

El flujo será:

```text
Botón Eliminar
      |
      v
confirmarEliminar(id, nombre)
      |
      v
AlertController
      |
      +-------------------+
      |                   |
   Cancelar            Eliminar
      |                   |
      v                   v
   Terminar       eliminarProducto(id)
```

---

## 6. Crear `eliminarProducto()`

Agrega el siguiente método:

```typescript
async eliminarProducto(id: number): Promise<void> {
  try {
    await axios.delete(
      `${environment.apiUrl}/items/productos/${id}`
    );

    const alerta = await this.alertController.create({
      header: 'Producto eliminado',
      message: 'El producto fue eliminado correctamente.',
      buttons: ['Aceptar']
    });

    await alerta.present();
    await alerta.onDidDismiss();

    await this.cargarProductos();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);

    const alerta = await this.alertController.create({
      header: 'Error',
      message: 'No fue posible eliminar el producto. Revisa la conexión, los permisos de eliminación en Directus y las relaciones del registro.',
      buttons: ['Aceptar']
    });

    await alerta.present();
  }
}
```

La petición utilizada es:

```typescript
await axios.delete(
  `${environment.apiUrl}/items/productos/${id}`
);
```

Si:

```text
id = 5
```

la URL generada será:

```text
http://localhost:8000/items/productos/5
```

Directus eliminará el registro correspondiente a ese identificador.

No es necesario enviar los datos del producto en el cuerpo de la petición.

---

## 7. Actualizar el listado después de eliminar

Después de una eliminación correcta se ejecuta:

```typescript
await this.cargarProductos();
```

Este método vuelve a consultar:

```text
GET /items/productos
```

por lo que el producto eliminado desaparecerá inmediatamente del listado.

El flujo será:

```text
DELETE exitoso
      |
      v
Mensaje de confirmación
      |
      v
cargarProductos()
      |
      v
GET /items/productos
      |
      v
this.productos = response.data.data
      |
      v
Vista actualizada
```

---

## 8. Importaciones necesarias

La parte principal de las importaciones de `productos-list.page.ts` deberá contener:

```typescript
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
```

Si utilizas la rama mediante modal para crear y actualizar productos, conserva también:

```typescript
import { ModalController } from '@ionic/angular';
import { ProductosFormPage } from '../productos-form/productos-form.page';
```

En ese caso puedes agrupar los controladores de Ionic:

```typescript
import { AlertController, ModalController } from '@ionic/angular';
```

---

## 9. Fragmento principal de `productos-list.page.ts`

Si se muestran solamente las partes necesarias para listar y eliminar productos, el archivo puede quedar de forma similar a:

```typescript
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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

  constructor(
    private alertController: AlertController
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

  async confirmarEliminar(id: number, nombre: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de eliminar el producto "${nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarProducto(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarProducto(id: number): Promise<void> {
    try {
      await axios.delete(
        `${environment.apiUrl}/items/productos/${id}`
      );

      const alerta = await this.alertController.create({
        header: 'Producto eliminado',
        message: 'El producto fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarProductos();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el producto. Revisa la conexión, los permisos de eliminación en Directus y las relaciones del registro.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
```

Si tu `productos-list.page.ts` ya contiene los métodos de creación y actualización de las prácticas anteriores, no debes reemplazar todo el archivo.

Únicamente agrega:

```text
AlertController
confirmarEliminar()
eliminarProducto()
```

conservando los métodos que ya existen.

---

## 10. Integrarlo con la rama mediante modal

Si estás utilizando los manuales de creación y actualización mediante modal, `productos-list.page.ts` ya contiene:

```typescript
private modalController: ModalController
```

El constructor puede quedar así:

```typescript
constructor(
  private modalController: ModalController,
  private alertController: AlertController
) {}
```

Los tres procesos quedarán dentro del mismo listado:

```text
Nuevo
   |
   v
nuevoProducto()
   |
   v
Modal
```

```text
Editar
   |
   v
editarProducto(id)
   |
   v
Modal
```

```text
Eliminar
   |
   v
confirmarEliminar(id, nombre)
   |
   v
DELETE
```

La eliminación no abre `productos-form`.

Se realiza directamente desde el listado.

---

## 11. Integrarlo con la rama mediante página

Si utilizas la rama donde crear y actualizar navegan hacia `productos-form`, la eliminación funciona exactamente igual.

El botón:

```html
<ion-button fill="clear" color="danger" (click)="confirmarEliminar(producto.id, producto.nombre)">
  <ion-icon slot="icon-only" name="trash"></ion-icon>
</ion-button>
```

continúa llamando al método ubicado en:

```text
productos-list.page.ts
```

Después de eliminar se ejecuta:

```typescript
await this.cargarProductos();
```

Por lo tanto, para esta operación no existe una diferencia entre:

```text
Modal
Página
```

Las ramas solamente cambian la forma de abrir el formulario de creación o actualización.

---

## 12. Qué ocurre si el producto tiene relaciones

Un producto puede estar relacionado con registros de otras colecciones.

Dependiendo de cómo estén configuradas las relaciones y las restricciones de la base de datos, Directus podría impedir la eliminación.

Por esa razón el método utiliza:

```typescript
try {
  // DELETE
} catch (error) {
  // Mostrar mensaje
}
```

Si ocurre un error, se mostrará:

```text
No fue posible eliminar el producto. Revisa la conexión, los permisos de eliminación en Directus y las relaciones del registro.
```

No se debe asumir que cualquier error corresponde necesariamente a una relación con otra tabla.

También podría deberse a:

```text
Directus no está disponible
No existe el permiso Delete
El registro ya no existe
La petición no puede llegar al servidor
Existe una restricción de integridad
```

Por eso se utiliza un mensaje general para el usuario y se conserva:

```typescript
console.error('Error al eliminar el producto:', error);
```

para revisar el error técnico durante el desarrollo.

---

## 13. Probar la eliminación

Abre:

```text
http://localhost:8100/productos-list
```

Localiza un producto que puedas eliminar.

Por ejemplo:

```text
ID: 5
Nombre: Mouse
Descripción: Mouse inalámbrico
Precio: 450
Stock: 10
```

Presiona el botón con el icono:

```text
trash
```

Deberá aparecer un mensaje similar a:

```text
¿Estás seguro de eliminar el producto "Mouse"?
```

Primero presiona:

```text
Cancelar
```

El producto deberá permanecer en el listado.

Después vuelve a presionar el botón y selecciona:

```text
Eliminar
```

La aplicación deberá ejecutar:

```text
DELETE /items/productos/5
```

Después de una eliminación correcta:

1. debe mostrarse el mensaje `Producto eliminado`;
2. al aceptar el mensaje debe ejecutarse `cargarProductos()`;
3. debe realizarse nuevamente `GET /items/productos`;
4. el producto eliminado ya no debe aparecer en el listado;
5. no debe ser necesario recargar manualmente el navegador.

---

## 14. Errores que deben evitarse

### Eliminar sin confirmación

No llames directamente:

```typescript
eliminarProducto(producto.id)
```

desde el botón de la vista.

Primero utiliza:

```typescript
confirmarEliminar(producto.id, producto.nombre)
```

para evitar eliminaciones accidentales.

---

## 15. Resumen

Esta práctica utiliza:

```text
AlertController
```

para solicitar confirmación antes de eliminar.

Los elementos principales son:

1. Permiso `Delete` en Directus.
2. Botón `Eliminar` dentro de `productos-list`.
3. Método `confirmarEliminar()`.
4. Uso de `AlertController` para solicitar confirmación.
5. Envío del `id` del producto seleccionado.
6. Petición `DELETE` con Axios.
7. URL construida con `environment.apiUrl`.
8. Manejo de errores mediante `try/catch`.
9. Mensaje de confirmación después de eliminar.
10. `cargarProductos()` para actualizar inmediatamente el listado.

El flujo final será:

```text
Producto
   |
   | id + nombre
   v
confirmarEliminar()
   |
   v
¿Confirmar?
   |
   +----------------------+
   |                      |
Cancelar               Eliminar
   |                      |
   v                      v
Terminar          eliminarProducto(id)
                          |
                          v
                  DELETE /items/productos/{id}
                          |
                          v
                      Directus
                          |
                          v
                      MariaDB
                          |
                          v
                  Producto eliminado
                          |
                          v
                  cargarProductos()
                          |
                          v
                  Listado actualizado
```

A diferencia de crear y actualizar, la eliminación no necesita dos versiones diferentes para modal y página, porque la operación se realiza directamente desde `productos-list` en ambas ramas.
