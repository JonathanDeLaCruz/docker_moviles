export interface Opcion { texto: string; valor: string; }
export interface Campo {
  clave: string; etiqueta: string;
  tipo: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'number' | 'boolean' | 'aceptacion' | 'select' | 'multiple' | 'radio' | 'casillas' | 'range' | 'date' | 'time';
  obligatorio?: boolean; longitud?: number; min?: number; max?: number; entero?: boolean;
  inicial?: any; opciones?: Opcion[]; relacion?: string;
}
export interface Coleccion {
  ruta: string; tabla: string; titulo: string; singular: string; icono: string;
  buscar: string[]; campos: Campo[];
}
const opciones = (...valores: string[]): Opcion[] => valores.map(valor => ({ texto: valor.replace(/_/g, ' '), valor }));
const nombre = (): Campo => ({ clave: 'nombre', etiqueta: 'Nombre', tipo: 'text', obligatorio: true, longitud: 100 });
const contacto = (): Campo[] => [
  { clave: 'correo', etiqueta: 'Correo', tipo: 'email', longitud: 100 },
  { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', longitud: 20 }
];
export const COLECCIONES: Coleccion[] = [
  { ruta: 'categorias', tabla: 'categorias', titulo: 'Categorías', singular: 'categoría', icono: 'pricetags', buscar: ['nombre'], campos: [nombre()] },
  { ruta: 'marcas', tabla: 'marcas', titulo: 'Marcas', singular: 'marca', icono: 'ribbon', buscar: ['nombre'], campos: [nombre(), { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' }] },
  { ruta: 'proveedores', tabla: 'proveedores', titulo: 'Proveedores', singular: 'proveedor', icono: 'business', buscar: ['nombre', 'correo'], campos: [nombre(), ...contacto(), { clave: 'activo', etiqueta: 'Activo', tipo: 'boolean', inicial: true }] },
  { ruta: 'clientes', tabla: 'clientes', titulo: 'Clientes', singular: 'cliente', icono: 'people', buscar: ['nombre', 'correo'], campos: [nombre(), ...contacto()] },
  { ruta: 'origenes-ejemplo', tabla: 'origenes_ejemplo', titulo: 'Orígenes de ejemplo', singular: 'origen', icono: 'list', buscar: ['nombre', 'codigo'], campos: [nombre(), { clave: 'codigo', etiqueta: 'Código', tipo: 'text', obligatorio: true, longitud: 30 }] },
  { ruta: 'pedidos', tabla: 'pedidos', titulo: 'Pedidos', singular: 'pedido', icono: 'receipt', buscar: ['observaciones'], campos: [
    { clave: 'cliente', etiqueta: 'Cliente', tipo: 'select', obligatorio: true, relacion: 'clientes' },
    { clave: 'producto', etiqueta: 'Producto', tipo: 'select', obligatorio: true, relacion: 'productos' },
    { clave: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', obligatorio: true, entero: true, min: 1, inicial: 1 },
    { clave: 'estado', etiqueta: 'Estado', tipo: 'select', obligatorio: true, inicial: 'pendiente', opciones: opciones('pendiente', 'entregado', 'cancelado') },
    { clave: 'observaciones', etiqueta: 'Observaciones', tipo: 'textarea' }
  ] },
  { ruta: 'ejemplos-campos', tabla: 'ejemplos_campos', titulo: 'Ejemplos de campos', singular: 'ejemplo', icono: 'options', buscar: ['nombre', 'correo'], campos: [
    nombre(), { clave: 'correo', etiqueta: 'Correo', tipo: 'email', obligatorio: true, longitud: 100 },
    { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', longitud: 20 },
    { clave: 'sitio_web', etiqueta: 'Sitio web', tipo: 'url', longitud: 100 },
    { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    { clave: 'edad', etiqueta: 'Edad', tipo: 'number', min: 18, max: 100, entero: true },
    { clave: 'monto', etiqueta: 'Monto', tipo: 'number', obligatorio: true, min: 0, max: 99999999.99 },
    { clave: 'tipo', etiqueta: 'Tipo', tipo: 'select', obligatorio: true, opciones: opciones('curso', 'taller') },
    { clave: 'modalidad', etiqueta: 'Modalidad', tipo: 'radio', obligatorio: true, inicial: 'presencial', opciones: opciones('presencial', 'en_linea') },
    { clave: 'tecnologias', etiqueta: 'Tecnologías', tipo: 'multiple', inicial: [], opciones: opciones('ionic', 'angular', 'directus') },
    { clave: 'canales', etiqueta: 'Canales', tipo: 'casillas', inicial: [], opciones: opciones('correo', 'whatsapp') },
    { clave: 'acepta_terminos', etiqueta: 'Acepto los términos del ejemplo', tipo: 'aceptacion', inicial: false },
    { clave: 'recibir_avisos', etiqueta: 'Recibir avisos', tipo: 'boolean', inicial: false },
    { clave: 'prioridad', etiqueta: 'Prioridad', tipo: 'range', inicial: 3, min: 0, max: 10, entero: true },
    { clave: 'fecha_evento', etiqueta: 'Fecha del evento', tipo: 'date' },
    { clave: 'hora_evento', etiqueta: 'Hora del evento', tipo: 'time' }
  ] }
];
export function buscarColeccion(ruta: string): Coleccion {
  const config = COLECCIONES.find(c => c.ruta === ruta);
  if (!config) throw new Error('Colección no configurada.');
  return config;
}
export function rutaColeccion(config: Coleccion): string {
  return config.tabla === 'pedidos' ? '/tabs/pedidos' : '/tabs/catalogos/' + config.ruta;
}
