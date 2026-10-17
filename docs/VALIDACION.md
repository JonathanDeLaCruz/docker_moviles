# Registro de validación de manuales

Revisión del 16 de octubre de 2026. Las pruebas se ejecutaron sobre la aplicación Ionic existente del proyecto y el servicio Directus de Docker. Las capturas son de la aplicación en funcionamiento; no se creó un sitio para previsualizar los manuales.

## Entorno observado

Ionic 8.8.17, Angular 20.3.30, Node.js 22 en el contenedor móvil, Directus 12.3.1 y MariaDB 11.8. Los cambios de esquema se limitaron a las relaciones de las prácticas 14 y 15 autorizadas por el propietario.

## Alcance y resultados

| Manual | Comprobación | Resultado |
| --- | --- | --- |
| 01–03 | Revisión de estructura, código, recursos y referencias. Las capturas y pruebas corresponden a la revisión anterior. | Conservan implementación en el punto 3 y figuras centradas. |
| 04, página | Edición de producto, validación de campos y regreso al listado. | Comprobado en Ionic. |
| 04, modal | Apertura, validación y actualización de un producto. | Comprobado en Ionic; API confirmó la actualización. |
| 05 | Cancelación y eliminación de un registro exclusivo de prueba, con recarga de lista. | Cancelación comprobada en Ionic; eliminación comprobada ejecutando la clase del manual contra la API real. |
| 06 | Fuente local y color de la barra. | Comprobados visualmente y mediante estilos calculados del navegador. |
| 07 | Componente de barra, contenido proyectado y navegación mediante +. | Comprobado en Ionic. |
| 08 | Páginas inicial, intermedia y final, total y límites. | Comprobado con ocho registros y tres por página. |
| 09 | Apertura del menú, navegación y cierre. | Comprobado en Ionic. |
| 10 | Búsqueda por nombre, mayúsculas y sin coincidencias. | Comprobado en Ionic. |
| 11 | Listado, detalle, creación, actualización, conteo y eliminación mediante el servicio. | Servicio ejecutado contra la API real; detalle comprobado en Ionic. |
| 12 | Validaciones, rechazo de credenciales incorrectas y acceso con cuenta activa. | Acceso comprobado. Registro completo pendiente: el entorno tiene registro público deshabilitado y no dispone de SMTP configurado para la verificación. |
| 13 | Redirección de ruta protegida, retorno tras acceso y cierre de sesión. | Comprobado en Ionic. Se corrigió la navegación con replaceUrl. |
| 14 | Creación, edición y detalle con categorías; altas y bajas de enlaces. | Comprobado en Ionic con el producto 13. Guardado sin cambios y retirada de todas las categorías comprobados además mediante la API con la cuenta de prueba. |
| 15 | Selección real, carga, asociación y recuperación de imagen. | Comprobado en Ionic con una cuenta sin acceso administrativo y permisos compartidos de Create/Read sobre directus_files y Read/Update sobre productos. |
| 16 | Imagen en formulario de creación/edición y detalle con categorías. | Comprobado en Ionic; compilación final de desarrollo correcta y capturas reales del producto 14. |

## Compilación

La aplicación con las prácticas hasta el manual 15 compiló en desarrollo. La compilación de producción para Android utiliza una URL HTTPS absoluta; en la comprobación se usó https://api.example.com porque aún no existe un servidor público. Los avisos de deprecación de Sass sobre @import no impidieron compilar.

## Evidencia y límites

Cada captura pertenece a la etapa indicada por su manual; los productos, fechas y tema pueden variar entre etapas. Las figuras se incluyen con pie y referencia desde el texto. La existencia de un archivo y una ruta correcta no demuestra por sí sola que una vista Markdown lo renderice: la revisión visual se registra aparte de la comprobación de enlaces.

Se verificó en la vista Markdown de GitHub la figura del manual 08: archivo cargado, ancho 390 y alineación centrada. Las figuras 09–15 acompañan los manuales publicados para revisión; su comprobación en GitHub se registra por separado. La comprobación completa del manual 15 se registra en la sección de carga de archivos compartidos.

El propietario autorizó publicar el conjunto para revisarlo en GitHub. El resultado parcial del manual 12 conserva sus limitaciones explícitas.

## Corrección de flujos para visores móviles

Se reemplazaron los bloques Mermaid visibles por 19 imágenes PNG: 18 de los manuales y una del README. Los recorridos utilizan el mismo diseño y orientación vertical; cada imagen está centrada, con pie y referencia en el texto. Se conservaron las fuentes editables; la herramienta local de generación no se incluye en el repositorio.

La comprobación de referencias abarcó 20 documentos y 49 figuras, sin recursos ausentes ni párrafos HTML sin cierre. Se inspeccionaron visualmente los PNG de los manuales 01 y 13. La apertura del README en Codex quedó en cola; no se pudo confirmar su vista previa desde esta herramienta. La presentación de los nuevos flujos en la aplicación GitHub móvil queda pendiente de comprobación en ese visor.

Después de publicar, se comprobó el README en la vista Markdown de GitHub: sus dos imágenes cargaron y quedaron centradas. En el manual 14 se comprobó la captura y el flujo PNG con ancho de navegador de 390 px: ambas imágenes cargaron, se ajustaron a 309 px dentro del contenido y quedaron centradas. Esto verifica el navegador con tamaño móvil; no constituye una prueba en la aplicación nativa de GitHub.

## Diseño de los diagramas con ramificaciones

Se revisaron visualmente los 19 diagramas: los 18 de los manuales y el del README. Se contrastaron sus pasos con los ejemplos de código y las explicaciones de cada práctica. El recorrido principal se orienta hacia abajo; las decisiones, cancelaciones, intercambios con MariaDB y ciclos de retorno mantienen conexiones propias. Las figuras siguen centradas y con pie de figura.

Las imágenes PNG conservan la visualización independiente de Mermaid. Las fuentes JSON, DOT y Mermaid reflejan los nodos y las aristas del flujo. Las herramientas locales de generación permanecen fuera del repositorio. Esta revisión de diagramas no constituye una nueva ejecución de las pruebas de Ionic registradas en las secciones anteriores.

## Carga de archivos compartidos del manual 15

Se sustituyeron las reglas por propietario por permisos normales, autorizados por el usuario: Create/Read en directus_files y Read/Update en productos. No se concedió acceso administrativo ni lectura pública de archivos. En Ionic se inició sesión con la cuenta de prueba, se seleccionó producto-ejemplo.svg, se subió y se mostró la confirmación con la imagen. Al regresar al listado y volver a abrir la página, la imagen se recuperó con el selector vacío. Se verificó la imagen cargada en ambas vistas y la asociación persistida: producto 1, archivo 277338c8-d2d9-4b44-8315-038d9d1df881, 505 bytes, image/svg+xml. Las figuras 1 y 2 son capturas reales de estos resultados.

## Categorías completas e imagen integrada

La etapa del manual 14 se compiló y ejecutó antes de incorporar imágenes: creación del producto 13 con dos categorías, consulta de sus nombres en el detalle, carga de las selecciones al editar, eliminación de Accesorios y alta posterior desde Ionic. Se corrigió la relación productos_categorias.productos_id para que one_deselect_action sea delete; después de recargar Directus, la eliminación de enlaces funcionó con permisos normales. La API autenticada verificó que create/delete vacíos conservan los mismos IDs de enlace y que retirar todos deja cero asociaciones; se restituyeron las dos selecciones del ejemplo. El catálogo no se eliminó.

La etapa final del manual 16 se compiló en desarrollo y se probó en Ionic: creación del producto 14 con archivo y categoría Periféricos, recuperación del archivo existente en edición, reemplazo por producto-ejemplo-azul.svg y visualización de la nueva imagen junto a la categoría en el detalle. Las capturas de creación, edición y detalle pertenecen a ese mismo producto. En la prueba inicial del producto 12 se actualizó stock sin seleccionar otro archivo y se comprobó que conservaba su ID de imagen sin crear otro archivo. El producto 13 también mostró imagen y ambas categorías juntas. No se instaló una licencia ni otro almacenamiento; se utilizaron las políticas básicas de la cuenta autenticada.

El manual de Rocky Linux y sus recursos se retiraron de docs y se conservaron localmente hasta comprobar el despliegue con un servidor. El manual de imagen en formulario y detalle pasó del número 17 al 16; se actualizaron el índice, los enlaces y los nombres de sus recursos. Las capturas y el código probado se conservan.

## Manual 17: campos de formulario y valores automáticos

El 17 de octubre de 2026 se creó ejemplos_campos en Directus con 21 campos y permisos normales Create/Read para la cuenta de práctica, sin acceso administrativo. El primer POST desde Ionic recibió 403 por caché de la nueva configuración; se reinició el servicio existente de Directus y se repitió la prueba satisfactoriamente.

Se probaron formulario vacío, correo inválido, edad inferior a 18 y monto negativo; no crearon registros. Ionic creó y volvió a consultar el registro 2 con selección simple, radio, dos tecnologías, dos canales, aceptación y avisos, fecha y hora. Los JSON de envío y respuesta están en recursos/17_campos. Directus añadió fecha_creacion sin recibirla del cliente. La interfaz administrativa mostró los mismos valores.

Se guardó desde Ionic un segundo ejemplo (registro 4) con monto 0, recibir_avisos false, arreglos vacíos, campos opcionales null y prioridad modificada de 3 a 4. Una prueba adicional de API (registro 3) omitió estado y origen y confirmó sus predeterminados. Se probó que + reinicia el formulario con botón de barra y con botón flotante, por separado. Las capturas son reales de Ionic y Directus. La prueba del navegador no equivale a una instalación Android.

La compilación final de desarrollo del ejemplo fue correcta. Se comprobó que los cinco archivos del punto 4 coinciden con los utilizados en la aplicación, que las ocho figuras tienen sus etiquetas cerradas y que los 20 diagramas del repositorio conservan referencias y fuentes válidas. La apertura de la vista Markdown local en Codex quedó en cola; su presentación se verificará en GitHub tras publicar.

Después de publicar el manual 17 se verificó su vista Markdown en GitHub: las ocho imágenes cargaron con tamaño natural válido y quedaron centradas (desfase de 0 px respecto a su párrafo). Se inspeccionó visualmente la figura 1 dentro del documento; el PNG del flujo también se había revisado visualmente antes de publicar. Esta comprobación corresponde al navegador de GitHub, no a su aplicación móvil nativa.


## Ajuste del manual 17: ENUM y catálogo relacionado

Se redujeron correo y sitio_web a VARCHAR(100), con validación y maxlength de 100 en Ionic. Se conservaron los cuatro ejemplos existentes. Tipo, modalidad y estado se convirtieron en ENUM nativos de MariaDB; origen pasó a llave foránea entera hacia origenes_ejemplo.id. El catálogo contiene app_ionic e importacion y la cuenta de práctica solo necesita Read sobre él. La aplicación busca el ID por código, lo envía en el POST y expande la relación para mostrar nombre y código al consultar.

Se comprobó en MariaDB el tipo nativo de las seis columnas y la restricción de origen. La API autenticada aceptó correo y sitio web de 100 caracteres, rechazó 101 (VALUE_TOO_LONG), valores fuera de los tres ENUM (CONTAINS_NULL_VALUES) y un origen inexistente (INVALID_FOREIGN_KEY). Al omitir estado aplicó pendiente. Las observaciones están en recursos/17_campos/pruebas-esquema.json.

Directus 12.3.1 reconoce los ENUM nativos como unknown en su modelo. Se verificó en esta versión el guardado y consulta REST, así como las interfaces administrativas configuradas de desplegable y radio; no se afirma soporte de edición nativa del ENUM desde su diseñador. El manual indica el SQL necesario. En Ionic se creó y volvió a consultar el registro 8, mostrando Aplicación Ionic (app_ionic). Se actualizaron los JSON, las capturas afectadas y el flujo; se añadió una captura de la relación en Directus. El registro mínimo 4 se volvió a consultar con la relación expandida. La compilación de desarrollo fue correcta.

Tras publicar esta corrección se verificaron en el Markdown de GitHub las nueve imágenes cargadas y centradas. Se inspeccionó visualmente la captura actualizada del registro 8, donde aparece Aplicación Ionic (app_ionic), dentro del documento.

## Manual 18: tabs y colecciones integradas

Se añadieron marcas, proveedores, clientes y pedidos, con relaciones hacia productos y restricciones de integridad. La cuenta de práctica recibió los permisos CRUD autorizados sobre las ocho colecciones de la aplicación, sin acceso administrativo. La tabla de enlaces de categorías se administra desde el formulario de productos.

Se probaron mediante la API altas, consultas, cambios y eliminación de registros temporales en las ocho colecciones. En Ionic visible se comprobaron los tres tabs, búsqueda y paginación, validación, creación y edición de marcas, proveedores, clientes, productos y pedidos, cancelación y confirmación de eliminación, y protección de relaciones en uso. El producto 16 conservó imagen y categoría al actualizar su stock; el pedido 2 recuperó cliente y producto y cambió a entregado. El ejemplo 8 conservó selecciones múltiples y valores automáticos al editarse desde el formulario integrado. Se probaron por separado el botón de barra y el flotante.

MariaDB rechaza cantidades inválidas y eliminaciones de registros relacionados. Directus 12.3.1 devuelve un error 500 genérico para estas restricciones; la aplicación valida la cantidad y comprueba las relaciones antes de eliminar. Esta limitación se explica en el manual y en recursos/18_tabs/pruebas.json.

La compilación final de desarrollo terminó correctamente el 17 de octubre de 2026 (hash 12b55de7e2fc56df). Los 23 archivos de código incluidos en el manual coinciden con la aplicación. Se verificaron 18 figuras centradas con sus etiquetas cerradas y los 22 diagramas con fuentes y referencias válidas. Las 16 capturas proceden de Ionic y los dos diagramas se inspeccionaron visualmente. Estas pruebas corresponden al navegador; no equivalen a una prueba de esta integración en Android. La apertura de la vista Markdown local quedó en cola; la revisión del documento publicado se registra por separado.

Después de publicar se comprobó el manual 18 en la vista Markdown de GitHub: las 18 imágenes cargaron con tamaño natural válido y todas quedaron centradas, con desfase de 0 px respecto a su párrafo. Se inspeccionó visualmente la figura 10 dentro del documento publicado. La aplicación Ionic quedó abierta mostrando el detalle del producto 16 con imagen, marca, proveedor y categoría. Esta comprobación corresponde al navegador, no a la aplicación nativa de GitHub.

## Corrección del manual 18: menú y tab Resumen

Los catálogos pasan a accesos directos del menú lateral, con rutas protegidas /catalogos/... fuera del contenedor de tabs. El tercer tab es Resumen: tarjetas de productos, unidades y registros sin stock, además de total y barras por estado de pedidos. Se retiró la página que repetía el menú como listado de catálogos. Las rutas anteriores conservan redirecciones.

La compilación de desarrollo pasó (ae7551de17ed80c5). Se probó en Ionic la entrada y actualización de Resumen y se contrastaron sus totales con MariaDB: 13 productos, 214 unidades, 0 sin stock, 1 pedido entregado. Se abrieron desde el menú las seis colecciones auxiliares. Se volvió a comprobar la carga de formularios y detalles, la validación de cantidad cero sin guardar y la protección del cliente 3 relacionado con el pedido. Se renovaron las capturas afectadas y el flujo de navegación; se añadió la figura del resumen. El manual conserva la implementación en el punto 3 y el código completo coincide con los 25 archivos actuales.
