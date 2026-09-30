# Cambio de fuente y estilos a los componentes de Ionic

En esta práctica se personalizará la apariencia de una aplicación **Ionic con Angular** utilizando:

```text
Fuentes locales
CSS variables
Colores de Ionic
Estilos globales
Estilos por página
```

Para mantener la configuración visual en un lugar fácil de localizar, utilizaremos:

```text
src/app/app.component.scss
```

como archivo principal para definir la fuente y los colores personalizados de la aplicación.

Después importaremos ese archivo desde:

```text
src/global.scss
```

De esta manera, los estilos definidos en `app.component.scss` estarán disponibles de forma global.

---

## Objetivo

Al finalizar la práctica, la aplicación deberá:

1. Utilizar una fuente personalizada almacenada dentro del proyecto.
2. Registrar la fuente mediante `@font-face`.
3. Aplicar la fuente globalmente mediante `--ion-font-family`.
4. Utilizar los colores predeterminados de Ionic.
5. Crear un color personalizado para los componentes de Ionic.
6. Centralizar la configuración visual principal en `app.component.scss`.
7. Utilizar archivos `.page.scss` cuando un estilo pertenezca únicamente a una página.

---

## 1. Descargar una fuente

Puedes descargar una fuente desde:

[Google Fonts](https://fonts.google.com/)

Para esta práctica utilizaremos como ejemplo:

```text
YoungSerif-Regular.ttf
```

Las fuentes web pueden encontrarse en formatos como:

```text
.woff2
.woff
.ttf
```

En esta práctica utilizaremos un archivo `.ttf` para mantener el ejemplo sencillo.

---

## 2. Crear la carpeta para las fuentes

Dentro de:

```text
src/assets/
```

crea la carpeta:

```text
font
```

La estructura quedará de forma similar a:

```text
src/
└── assets/
    └── font/
        └── YoungSerif-Regular.ttf
```

Copia el archivo de la fuente dentro de esa carpeta.

---

## 3. Importar `app.component.scss` desde `global.scss`

Abre:

```text
src/global.scss
```

Al final del archivo agrega:

```scss
@import "./app/app.component.scss";
```

Esto permite que los estilos escritos en:

```text
src/app/app.component.scss
```

se carguen como estilos globales de la aplicación.

El flujo será:

```text
global.scss
    |
    v
app.component.scss
    |
    v
Fuente y colores personalizados
    |
    v
Toda la aplicación
```

---

## 4. Registrar la fuente en `app.component.scss`

Abre:

```text
src/app/app.component.scss
```

Agrega:

```scss
@font-face {
  font-family: 'Young Serif';
  src: url('../assets/font/YoungSerif-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

La regla:

```scss
@font-face
```

permite registrar una fuente almacenada dentro del proyecto.

La propiedad:

```scss
font-family: 'Young Serif';
```

define el nombre con el que utilizaremos la fuente dentro de CSS.

La propiedad:

```scss
src: url('../assets/font/YoungSerif-Regular.ttf') format('truetype');
```

indica la ubicación del archivo de la fuente.

Como `app.component.scss` se encuentra dentro de:

```text
src/app/
```

la ruta:

```text
../assets/font/
```

permite regresar a `src/` y entrar después a `assets/font/`.

La propiedad:

```scss
font-display: swap;
```

permite mostrar temporalmente una fuente disponible mientras termina de cargar la fuente personalizada.

---

## 5. Aplicar la fuente a toda la aplicación

En el mismo archivo:

```text
src/app/app.component.scss
```

agrega:

```scss
:root {
  --ion-font-family: 'Young Serif', serif;
}
```

Ionic utiliza la variable:

```text
--ion-font-family
```

para definir la familia tipográfica principal de la aplicación.

El valor:

```scss
'Young Serif', serif
```

indica que se utilizará `Young Serif` y, si por alguna razón no puede cargarse, se utilizará una fuente genérica de tipo `serif`.

No es necesario escribir manualmente:

```scss
font-family: 'Young Serif';
```

para cada página o componente.

---

## 6. Código completo de la configuración de la fuente

Hasta este punto:

```text
src/app/app.component.scss
```

quedará de forma similar a:

```scss
@font-face {
  font-family: 'Young Serif';
  src: url('../assets/font/YoungSerif-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --ion-font-family: 'Young Serif', serif;
}
```

---

## 7. Colores predeterminados de Ionic

Muchos componentes de Ionic cuentan con la propiedad:

```text
color
```

que permite utilizar los colores configurados en la aplicación.

Por ejemplo:

```html
<ion-button>Default</ion-button>
<ion-button color="primary">Primary</ion-button>
<ion-button color="secondary">Secondary</ion-button>
<ion-button color="tertiary">Tertiary</ion-button>
<ion-button color="success">Success</ion-button>
<ion-button color="warning">Warning</ion-button>
<ion-button color="danger">Danger</ion-button>
<ion-button color="light">Light</ion-button>
<ion-button color="medium">Medium</ion-button>
<ion-button color="dark">Dark</ion-button>
```

Los colores utilizados normalmente por Ionic son:

```text
primary
secondary
tertiary
success
warning
danger
light
medium
dark
```

La propiedad `color` tendrá efecto en los componentes de Ionic que soporten esta propiedad.

---

## 8. Crear un color personalizado

Continuaremos trabajando en:

```text
src/app/app.component.scss
```

Dentro de `:root` agrega las variables del nuevo color:

```scss
:root {
  --ion-font-family: 'Young Serif', serif;

  --ion-color-personalizado: #686090;
  --ion-color-personalizado-rgb: 104, 96, 144;
  --ion-color-personalizado-contrast: #ffffff;
  --ion-color-personalizado-contrast-rgb: 255, 255, 255;
  --ion-color-personalizado-shade: #5c547f;
  --ion-color-personalizado-tint: #77709b;
}
```

Después, fuera de `:root`, agrega:

```scss
.ion-color-personalizado {
  --ion-color-base: var(--ion-color-personalizado);
  --ion-color-base-rgb: var(--ion-color-personalizado-rgb);
  --ion-color-contrast: var(--ion-color-personalizado-contrast);
  --ion-color-contrast-rgb: var(--ion-color-personalizado-contrast-rgb);
  --ion-color-shade: var(--ion-color-personalizado-shade);
  --ion-color-tint: var(--ion-color-personalizado-tint);
}
```

---

## 9. ¿Qué representa cada variable del color?

La variable:

```text
--ion-color-personalizado
```

contiene el color principal.

La variable:

```text
--ion-color-personalizado-rgb
```

contiene el mismo color separado en valores RGB.

En este ejemplo:

```text
104, 96, 144
```

La variable:

```text
--ion-color-personalizado-contrast
```

define el color que deberá utilizarse sobre el color principal.

En este ejemplo será:

```text
#ffffff
```

es decir, blanco.

La variable:

```text
--ion-color-personalizado-shade
```

representa una variante ligeramente más oscura.

La variable:

```text
--ion-color-personalizado-tint
```

representa una variante ligeramente más clara.

---

## 10. Utilizar el color personalizado

Después de crear las variables y la clase, el color puede utilizarse de la misma manera que los colores predeterminados de Ionic.

Por ejemplo:

```html
<ion-button color="personalizado">
  Personalizado
</ion-button>
```

También puede utilizarse en otros componentes compatibles:

```html
<ion-icon name="heart" color="personalizado"></ion-icon>

<ion-chip color="personalizado">
  <ion-label>Producto</ion-label>
</ion-chip>
```

Cuando escribimos:

```html
color="personalizado"
```

Ionic utiliza la clase:

```text
.ion-color-personalizado
```

para obtener las variables necesarias.

---

## 11. Utilizar el generador de colores de Ionic

Ionic proporciona una herramienta que ayuda a generar las variantes necesarias de un color.

Puedes utilizar:

[Ionic Color Generator](https://ionicframework.com/docs/theming/color-generator)

Introduce el color hexadecimal que deseas utilizar.

Por ejemplo:

```text
#686090
```

El generador puede proporcionar valores para:

```text
RGB
contrast
contrast-rgb
shade
tint
```

Esto evita calcular manualmente todas las variantes.

---

## 12. Código completo de `app.component.scss`

Después de configurar la fuente y el color personalizado, el archivo:

```text
src/app/app.component.scss
```

quedará de forma similar a:

```scss
@font-face {
  font-family: 'Young Serif';
  src: url('../assets/font/YoungSerif-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --ion-font-family: 'Young Serif', serif;

  --ion-color-personalizado: #686090;
  --ion-color-personalizado-rgb: 104, 96, 144;
  --ion-color-personalizado-contrast: #ffffff;
  --ion-color-personalizado-contrast-rgb: 255, 255, 255;
  --ion-color-personalizado-shade: #5c547f;
  --ion-color-personalizado-tint: #77709b;
}

.ion-color-personalizado {
  --ion-color-base: var(--ion-color-personalizado);
  --ion-color-base-rgb: var(--ion-color-personalizado-rgb);
  --ion-color-contrast: var(--ion-color-personalizado-contrast);
  --ion-color-contrast-rgb: var(--ion-color-personalizado-contrast-rgb);
  --ion-color-shade: var(--ion-color-personalizado-shade);
  --ion-color-tint: var(--ion-color-personalizado-tint);
}
```

De esta manera, la configuración visual principal queda concentrada en un solo archivo fácil de encontrar.

---

## 13. Estilos específicos de una página

Aunque la fuente y los colores globales estarán centralizados en:

```text
app.component.scss
```

los estilos que solamente pertenecen a una página deben colocarse dentro de su archivo `.page.scss`.

Por ejemplo:

```text
src/app/productos-list/productos-list.page.scss
```

Puedes agregar:

```scss
ion-card {
  --background: #ffffff;
  border-radius: 12px;
}

.boton-producto {
  --border-radius: 10px;
  --padding-start: 20px;
  --padding-end: 20px;
}
```

Y utilizar la clase en el HTML:

```html
<ion-button class="boton-producto" color="personalizado">
  Guardar
</ion-button>
```

Las propiedades que comienzan con:

```text
--
```

son variables CSS.

Muchos componentes de Ionic exponen variables CSS para modificar su apariencia.

---

## 14. Organización de los estilos

Para estas prácticas utilizaremos la siguiente organización:

| Archivo | Uso |
| --- | --- |
| `src/global.scss` | Carga de los estilos globales e importación de `app.component.scss` |
| `src/app/app.component.scss` | Fuente, colores personalizados y configuración visual global de la aplicación |
| `*.page.scss` | Estilos exclusivos de una página |
| `*.component.scss` | Estilos exclusivos de otros componentes reutilizables |

Esto permite tener un punto central fácil de identificar:

```text
app.component.scss
```

para la configuración visual general del proyecto.

---

## 15. Probar la fuente

Agrega temporalmente en alguna página:

```html
<ion-content class="ion-padding">
  <h1>Prueba de fuente</h1>

  <p>
    Este texto debe utilizar la fuente Young Serif.
  </p>
</ion-content>
```

Si la fuente no cambia, verifica:

1. que el archivo exista en `src/assets/font/`;
2. que el nombre del archivo coincida exactamente;
3. que `global.scss` importe `app.component.scss`;
4. que la ruta de `@font-face` sea correcta;
5. que `--ion-font-family` utilice el mismo nombre definido en `font-family`.

---

## 16. Probar el color personalizado

Agrega:

```html
<ion-button color="personalizado">
  Botón personalizado
</ion-button>
```

El botón debe utilizar como color principal:

```text
#686090
```

Si se muestra un color diferente o el botón utiliza el color predeterminado, verifica que en:

```text
src/app/app.component.scss
```

existan tanto las variables:

```text
--ion-color-personalizado
```

como la clase:

```text
.ion-color-personalizado
```

También verifica que:

```scss
@import "./app/app.component.scss";
```

se encuentre en `global.scss`.

---

## 17. Resumen

Para personalizar la aplicación se utilizaron:

1. Una fuente almacenada en `src/assets/font`.
2. `@font-face` dentro de `app.component.scss`.
3. La variable global `--ion-font-family`.
4. Los colores predeterminados de Ionic.
5. Variables CSS para crear un color personalizado.
6. La clase `.ion-color-personalizado`.
7. La propiedad `color` en los componentes compatibles de Ionic.
8. `global.scss` para importar `app.component.scss`.
9. Archivos `.page.scss` para estilos exclusivos de cada página.

La estructura utilizada será:

```text
src/
├── app/
│   └── app.component.scss
├── assets/
│   └── font/
│       └── YoungSerif-Regular.ttf
└── global.scss
```

El flujo general será:

```text
Fuente                 -> src/assets/font/
Configuración visual   -> app.component.scss
Carga global           -> global.scss
Estilos de cada página -> *.page.scss
```
