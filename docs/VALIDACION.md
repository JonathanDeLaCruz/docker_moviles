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
| 14 | Creación con dos categorías y consulta de los enlaces persistidos. | Comprobado: producto de prueba 11, categorías Periféricos y Accesorios. |
| 15 | Compilación, selección real de archivo e intento de carga. | Pendiente: Directus rechazó las reglas de archivos propios con RESOURCE_RESTRICTED / custom_permission_rules_enabled. No se concedió lectura pública ni acceso administrativo a la cuenta de prueba. |
| 16 | Compose con db y api, sintaxis de Nginx y compilación para Android. | Compose y Nginx comprobados localmente. APK debug creada y firma verificada; servidor público, instalación y solicitudes desde el celular pendientes. |

## Compilación

La aplicación con las prácticas hasta el manual 15 compiló en desarrollo. La compilación de producción para Android utiliza una URL HTTPS absoluta; en la comprobación se usó https://api.example.com porque aún no existe un servidor público. Los avisos de deprecación de Sass sobre @import no impidieron compilar.

## Evidencia y límites

Cada captura pertenece a la etapa indicada por su manual; los productos, fechas y tema pueden variar entre etapas. Las figuras se incluyen con pie y referencia desde el texto. La existencia de un archivo y una ruta correcta no demuestra por sí sola que una vista Markdown lo renderice: la revisión visual se registra aparte de la comprobación de enlaces.

Se verificó en la vista Markdown de GitHub la figura del manual 08: archivo cargado, ancho 390 y alineación centrada. Las figuras 09–15 acompañan los manuales publicados para revisión; su comprobación en GitHub se registra por separado. El manual 15 no se presenta como una práctica validada.

El propietario autorizó publicar el conjunto para revisarlo en GitHub. Los resultados parciales de los manuales 12, 15 y 16 conservan sus limitaciones explícitas.

## Corrección de flujos para visores móviles

Se reemplazaron los bloques Mermaid visibles por 19 imágenes PNG: 18 de los manuales y una del README. Los recorridos utilizan el mismo diseño y orientación vertical; cada imagen está centrada, con pie y referencia en el texto. Se conservaron las fuentes editables; la herramienta local de generación no se incluye en el repositorio.

La comprobación de referencias abarcó 20 documentos y 49 figuras, sin recursos ausentes ni párrafos HTML sin cierre. Se inspeccionaron visualmente los PNG de los manuales 01 y 13. La apertura del README en Codex quedó en cola; no se pudo confirmar su vista previa desde esta herramienta. La presentación de los nuevos flujos en la aplicación GitHub móvil queda pendiente de comprobación en ese visor.

Después de publicar, se comprobó el README en la vista Markdown de GitHub: sus dos imágenes cargaron y quedaron centradas. En el manual 14 se comprobó la captura y el flujo PNG con ancho de navegador de 390 px: ambas imágenes cargaron, se ajustaron a 309 px dentro del contenido y quedaron centradas. Esto verifica el navegador con tamaño móvil; no constituye una prueba en la aplicación nativa de GitHub.

## Compilación Android del manual 16

Se generó app-debug.apk con la aplicación de prácticas: 5 392 871 bytes, paquete mx.edu.moviles, mínimo SDK 24 y destino SDK 36. Gradle terminó con BUILD SUCCESSFUL in 2m 33s y 213 tareas ejecutadas. apksigner verificó la firma v2; se comprobó la presencia de AndroidManifest.xml, classes.dex y la URL https://api.example.com en los archivos empaquetados. El [registro de la APK](manuales/recursos/android/validacion-apk.json) incluye la huella SHA-256.

La compilación se ejecutó con JDK 21 y el wrapper de Linux en un contenedor temporal de herramientas; el proyecto Android se generó con cap add android y se actualizó con cap sync android. No se instalaron herramientas de compilación en el servidor de Azure.

El Compose corregido validó únicamente los servicios db y api. nginx -t comprobó la sintaxis de su proxy usando un certificado temporal de prueba, sin iniciar un servidor. El dominio real y su certificado todavía no están disponibles. La APK utiliza una URL de ejemplo, por lo que no se presenta como una aplicación conectada a Azure ni como instalada y probada en un celular.

## Diseño de los diagramas con ramificaciones

Se revisaron visualmente los 19 diagramas: los 18 de los manuales y el del README. Se contrastaron sus pasos con los ejemplos de código y las explicaciones de cada práctica. El recorrido principal se orienta hacia abajo; las decisiones, cancelaciones, intercambios con MariaDB y ciclos de retorno mantienen conexiones propias. Las figuras siguen centradas y con pie de figura.

Las imágenes PNG conservan la visualización independiente de Mermaid. Las fuentes JSON, DOT y Mermaid reflejan los nodos y las aristas del flujo. Las herramientas locales de generación permanecen fuera del repositorio. Esta revisión de diagramas no constituye una nueva ejecución de las pruebas de Ionic, Android o Azure registradas en las secciones anteriores.
