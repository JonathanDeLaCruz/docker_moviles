# Agregar un menú lateral en Ionic

Agregarás un menú con los enlaces de la aplicación. El encabezado abrirá ese menú y cada opción navegará a su ruta y lo cerrará.

<p align="center">
  <img src="imagenes/09-menu.jpg" alt="Resultado de la práctica ejecutado en Ionic." width="390"><br>
  <em>Figura 1. Resultado de la práctica ejecutado en Ionic.</em>
</p>

## 1. Antes de comenzar

Continúa con el componente `ToolbarComponent` del [manual 07](07_componentes.md). Comprueba que existan las rutas del listado y de las pestañas que incluirás.

Las rutas pertenecen al proyecto Ionic en `mobile/`. Ejecuta los comandos Docker desde la carpeta que contiene `docker-compose.yml`. Al generar páginas o componentes, configura manualmente `standalone: false` en `@Component`; este curso utiliza NgModules.

## 2. Conceptos y métodos que utilizarás

| Elemento | Uso | Resultado |
| --- | --- | --- |
| `ion-menu` | `contentId="main"` | Asocia el menú con el contenido principal. |
| `ion-router-outlet` | `id="main"` | Muestra la página navegada. |
| `ion-menu-button` | `menu="principal"` | Abre el menú identificado. |
| `ion-menu-toggle` | Envuelve cada enlace. | Cierra el menú al navegar. |
| `routerLink` | Recibe la ruta de cada opción. | Realiza la navegación. |

## 3. Implementación paso a paso

### Paso 1. Definir las opciones

Agrega el arreglo `enlaces` de este paso a `AppComponent`. Cada objeto contiene `ruta` y `texto`. Conserva `standalone: false`.

**`mobile/src/app/app.component.ts`**. Dentro de `AppComponent`, antes del constructor, agrega la lista de destinos.

```typescript
  enlaces: { ruta: string; texto: string }[] = [
    { ruta: '/productos-list', texto: 'Productos' },
    { ruta: '/tabs/tab1', texto: 'Tab 1' },
    { ruta: '/tabs/tab2', texto: 'Tab 2' },
    { ruta: '/tabs/tab3', texto: 'Tab 3' }
  ];
```

### Paso 2. Agregar el menú

Reemplaza `app.component.html` por su contenido completo de este paso. El `contentId` del menú y el `id` del outlet deben ser **main**.

**`mobile/src/app/app.component.html`**. Coloca esta plantilla en la vista de la práctica. Si Ionic generó contenido de ejemplo, sustitúyelo.

```html
<ion-app>
  <ion-menu contentId="main" menuId="principal">
    <ion-header>
      <ion-toolbar color="personalizado"><ion-title>Menú</ion-title></ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-menu-toggle *ngFor="let enlace of enlaces" autoHide="false">
          <ion-item [routerLink]="enlace.ruta" routerDirection="root" button detail="false">
            <ion-label>{{ enlace.texto }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
  <ion-router-outlet id="main"></ion-router-outlet>
</ion-app>
```

### Paso 3. Agregar el acceso a la barra

En `mobile/src/app/components/toolbar/toolbar.component.html`, dentro de `ion-toolbar`, antes de `ion-title`, agrega:

```html
<ion-buttons slot="start">
  <ion-menu-button menu="principal" aria-label="Abrir menú"></ion-menu-button>
</ion-buttons>
```

Conserva el título y los botones de la página.

### Paso 4. Ajustar el ancho

Al final de `app.component.scss`, conserva la fuente y los colores y agrega `ion-menu { --width: 260px; }`.

## 4. Comprobar el resultado

1. Abre `/productos-list` y presiona el icono del menú. Debe abrirse la vista de la figura 1.
2. Presiona **Tab 1**: debe navegar y cerrar el menú.
3. Regresa al listado y abre el menú; elige **Productos**.
4. Verifica que el icono **+** y la paginación sigan funcionando.

La figura 1 muestra el resultado obtenido con el código de esta práctica. Las fechas, los productos y el tema visual dependen de tu entorno.

## 5. Explicación detallada del flujo

La figura 2 muestra el recorrido de arriba hacia abajo.

<p align="center">
  <img src="imagenes/flujo-09-menu-ramas.png" alt="Navegar mediante el menú" width="1000"><br>
  <em>Figura 2. Navegar mediante el menú.</em>
</p>

`ion-menu` permanece en el componente raíz y se vincula con el outlet mediante `contentId`. El arreglo `enlaces` define las opciones sin repetir manualmente cada fila. `*ngFor` crea un acceso por objeto y `routerLink` recibe su ruta.

`ion-menu-button` identifica el menú por `menuId`. `ion-menu-toggle` envuelve cada opción para cerrarlo al navegar. `routerDirection="root"` establece la navegación de esa selección como raíz. El componente de encabezado conserva sus entradas y las acciones proporcionadas por la página.
