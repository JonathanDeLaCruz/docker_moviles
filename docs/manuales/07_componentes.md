# Creación de componentes reutilizables con Ionic y Angular

En esta práctica se creará un componente reutilizable llamado `ToolbarComponent`.

El componente permitirá mostrar una barra superior que pueda utilizarse en diferentes páginas de la aplicación sin repetir el mismo código HTML.

Se utilizará la arquitectura del proyecto trabajada durante el curso:

```text
Ionic
Angular
TypeScript
NgModule
```

En este proyecto los componentes se trabajarán con:

```typescript
standalone: false
```

porque serán declarados y exportados mediante módulos de Angular.

---

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Crear un componente llamado `toolbar`.
2. Mantener los componentes reutilizables dentro de `src/app/components`.
3. Configurar el componente con `standalone: false`.
4. Crear un módulo para exportar el componente.
5. Recibir información desde una página mediante `@Input()`.
6. Mostrar el valor recibido dentro del componente.
7. Importar el módulo del componente en las páginas donde se necesite.
8. Reutilizar el mismo componente en diferentes páginas.

El flujo será:

```text
Página
  |
  | nombre
  v
ToolbarComponent
  |
  v
ion-header
  |
  v
ion-toolbar
  |
  v
ion-title
```

---

## 1. Crear el componente

Desde la raíz del proyecto ejecuta:

```powershell
docker compose exec mobile ionic g component components/toolbar
```

Se generará una estructura similar a:

```text
src/app/components/toolbar/
├── toolbar.component.html
├── toolbar.component.scss
├── toolbar.component.spec.ts
└── toolbar.component.ts
```

La carpeta:

```text
components
```

se utilizará para almacenar componentes que puedan reutilizarse en diferentes partes de la aplicación.

---

## 2. Configurar el componente para trabajar con módulos

Abre:

```text
src/app/components/toolbar/toolbar.component.ts
```

Verifica que el decorador `@Component()` contenga:

```typescript
standalone: false
```

El archivo deberá quedar inicialmente de forma similar a:

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false
})
export class ToolbarComponent {

  @Input() nombre: string = '';

  constructor() {}

}
```

La propiedad:

```typescript
standalone: false
```

indica que el componente será administrado mediante un `NgModule`.

En esta práctica crearemos un módulo llamado:

```text
ToolbarModule
```

que será responsable de declarar y exportar el componente.

---

## 3. Identificar el selector del componente

Dentro del decorador encontramos:

```typescript
selector: 'app-toolbar'
```

El selector es el nombre que utilizaremos para insertar el componente dentro de otro archivo HTML.

Por ejemplo:

```html
<app-toolbar></app-toolbar>
```

Por lo tanto:

```text
ToolbarComponent
       |
       v
selector
       |
       v
app-toolbar
       |
       v
<app-toolbar></app-toolbar>
```

---

## 4. Crear una propiedad con `@Input()`

Dentro de `ToolbarComponent` agregamos:

```typescript
@Input() nombre: string = '';
```

Para utilizar `@Input()` debemos importar:

```typescript
import { Component, Input } from '@angular/core';
```

`@Input()` permite que un componente reciba información desde el componente que lo utiliza.

En este ejemplo:

```typescript
@Input() nombre: string = '';
```

el componente podrá recibir un texto llamado:

```text
nombre
```

Por ejemplo:

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

El valor:

```text
Productos
```

será recibido por:

```typescript
nombre
```

dentro de `ToolbarComponent`.

El flujo será:

```text
<app-toolbar nombre="Productos">
             |
             v
      @Input() nombre
             |
             v
         Productos
```

---

## 5. Configurar el HTML del componente

Abre:

```text
src/app/components/toolbar/toolbar.component.html
```

Agrega:

```html
<ion-header [translucent]="true">
  <ion-toolbar>

    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>

    <ion-title>
      {{ nombre }}
    </ion-title>

  </ion-toolbar>
</ion-header>
```

La interpolación:

```html
{{ nombre }}
```

muestra el valor recibido mediante:

```typescript
@Input() nombre
```

Por ejemplo, si una página utiliza:

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

el componente mostrará:

```text
Productos
```

como título.

### Nota sobre `ion-menu-button`

La sección:

```html
<ion-buttons slot="start">
  <ion-menu-button></ion-menu-button>
</ion-buttons>
```

es útil cuando la aplicación utiliza un menú lateral mediante `ion-menu`.

Si tu aplicación no utiliza un menú lateral, puedes eliminarla y dejar:

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      {{ nombre }}
    </ion-title>
  </ion-toolbar>
</ion-header>
```

---

## 6. Crear el módulo del componente

Dentro de:

```text
src/app/components/toolbar/
```

crea el archivo:

```text
toolbar.module.ts
```

La estructura quedará:

```text
src/app/components/toolbar/
├── toolbar.component.html
├── toolbar.component.scss
├── toolbar.component.spec.ts
├── toolbar.component.ts
└── toolbar.module.ts
```

En:

```text
toolbar.module.ts
```

agrega:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule {}
```

---

## 7. ¿Qué hace `ToolbarModule`?

El módulo tiene tres partes importantes.

### `declarations`

```typescript
declarations: [
  ToolbarComponent
]
```

Indica que:

```text
ToolbarComponent
```

pertenece a:

```text
ToolbarModule
```

### `imports`

```typescript
imports: [
  CommonModule,
  IonicModule
]
```

`CommonModule` proporciona funcionalidades comunes de Angular.

`IonicModule` permite que el componente utilice elementos de Ionic como:

```html
<ion-header>
<ion-toolbar>
<ion-buttons>
<ion-menu-button>
<ion-title>
```

### `exports`

```typescript
exports: [
  ToolbarComponent
]
```

Esta sección permite que otros módulos puedan utilizar:

```html
<app-toolbar>
```

cuando importen:

```typescript
ToolbarModule
```

El flujo será:

```text
ToolbarComponent
       |
       | declarations
       v
ToolbarModule
       |
       | exports
       v
Otros módulos
       |
       v
<app-toolbar>
```

---

## 8. Importar `ToolbarModule` en una página

Supongamos que queremos utilizar el componente en:

```text
productos-list
```

Abre:

```text
src/app/productos-list/productos-list.module.ts
```

Importa:

```typescript
import { ToolbarModule } from '../components/toolbar/toolbar.module';
```

Después agrega:

```typescript
ToolbarModule
```

al arreglo `imports`.

El módulo quedará de forma similar a:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductosListPageRoutingModule } from './productos-list-routing.module';
import { ProductosListPage } from './productos-list.page';
import { ToolbarModule } from '../components/toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosListPageRoutingModule,
    ToolbarModule
  ],
  declarations: [
    ProductosListPage
  ]
})
export class ProductosListPageModule {}
```

La ruta correcta utiliza:

```text
components
```

porque nuestro componente se encuentra en:

```text
src/app/components/toolbar/
```

---

## 9. Utilizar el componente

Abre:

```text
src/app/productos-list/productos-list.page.html
```

Agrega:

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

Después puedes continuar con el contenido normal de la página:

```html
<app-toolbar nombre="Productos"></app-toolbar>

<ion-content class="ion-padding">

  <h1>Listado de productos</h1>

</ion-content>
```

---

## 10. Reutilizar el componente

La ventaja de un componente es que el mismo código puede utilizarse en diferentes páginas.

Por ejemplo:

### Página de productos

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

### Página de usuarios

```html
<app-toolbar nombre="Usuarios"></app-toolbar>
```

### Página de categorías

```html
<app-toolbar nombre="Categorías"></app-toolbar>
```

No necesitamos volver a escribir el encabezado completo en cada página. Únicamente cambiamos el valor enviado a `nombre`.

---

## 11. Enviar una variable al componente

Hasta ahora utilizamos un texto fijo:

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

También podemos enviar una variable.

Por ejemplo, en:

```text
productos-list.page.ts
```

agrega:

```typescript
titulo: string = 'Listado de productos';
```

Después, en:

```text
productos-list.page.html
```

utiliza:

```html
<app-toolbar [nombre]="titulo"></app-toolbar>
```

Los corchetes:

```text
[nombre]
```

indican que Angular debe evaluar una expresión o variable.

Por lo tanto:

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

envía directamente el texto `Productos`, mientras que:

```html
<app-toolbar [nombre]="titulo"></app-toolbar>
```

envía el contenido de la variable `titulo`.

---

## 12. Agregar más propiedades al componente

Un componente puede recibir más de una propiedad.

Por ejemplo:

```typescript
@Input() nombre: string = '';
@Input() color: string = 'primary';
```

El componente quedaría:

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false
})
export class ToolbarComponent {

  @Input() nombre: string = '';
  @Input() color: string = 'primary';

  constructor() {}
}
```

Después podemos utilizar el color dentro del HTML:

```html
<ion-header [translucent]="true">
  <ion-toolbar [color]="color">

    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>

    <ion-title>
      {{ nombre }}
    </ion-title>

  </ion-toolbar>
</ion-header>
```

Ahora una página puede utilizar:

```html
<app-toolbar
  nombre="Productos"
  color="primary"
></app-toolbar>
```

Esto permite que el mismo componente tenga diferentes configuraciones.

---

## 13. Resumen

Para crear un componente reutilizable mediante la arquitectura utilizada en el curso:

1. Generamos el componente:

```powershell
docker compose exec mobile ionic g component components/toolbar
```

2. Verificamos:

```typescript
standalone: false
```

3. Creamos:

```text
toolbar.module.ts
```

4. Declaramos el componente:

```typescript
declarations: [
  ToolbarComponent
]
```

5. Exportamos el componente:

```typescript
exports: [
  ToolbarComponent
]
```

6. Creamos las propiedades que recibirá:

```typescript
@Input() nombre: string = '';
```

7. Importamos `ToolbarModule` en el módulo de cada página que necesite utilizar el componente.

8. Finalmente utilizamos:

```html
<app-toolbar nombre="Productos"></app-toolbar>
```

La idea principal es:

```text
Componente reutilizable
        |
        v
Se declara en su módulo
        |
        v
Se exporta
        |
        v
La página importa el módulo
        |
        v
Usa el selector
        |
        v
<app-toolbar>
```

De esta manera evitamos repetir código y mantenemos una estructura más ordenada en la aplicación.