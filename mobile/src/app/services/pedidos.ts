import { Injectable } from '@angular/core';
import { AuthService } from './auth';
export interface LineaPedido { id: number; producto: { id: number; nombre: string }; cantidad: number; precio_unitario: string; }
export interface Pedido { id: number; cliente: { id: number; nombre: string }; estado: string; observaciones: string | null; fecha_creacion: string; detalles: LineaPedido[]; }
export interface LineaGuardar { id?: number; producto: number; cantidad: number; precio_unitario: string; }
export interface PedidoGuardar { cliente: number; estado: string; observaciones: string | null; detalles: LineaGuardar[]; }
// Los cálculos se hacen con centavos enteros; el precio se guarda como decimal.
export function centavos(precio: string | number): number {
  const texto = String(precio);
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(texto)) throw new Error('Precio inválido.');
  const [entero, decimal = ''] = texto.split('.');
  return Number(entero) * 100 + Number(decimal.padEnd(2, '0'));
}
export function importe(lineas: { cantidad: number; precio_unitario: string }[]): number {
  return lineas.reduce((total, linea) => total + Number(linea.cantidad) * centavos(linea.precio_unitario), 0);
}
export function dinero(valor: number): string { return (valor / 100).toFixed(2); }
@Injectable({ providedIn: 'root' })
export class PedidosService {
  constructor(private auth: AuthService) {}
  private fields = 'id,cliente.id,cliente.nombre,estado,observaciones,fecha_creacion,detalles.id,detalles.producto.id,detalles.producto.nombre,detalles.cantidad,detalles.precio_unitario';
  async catalogos(): Promise<{ clientes: { id: number; nombre: string }[]; productos: { id: number; nombre: string; precio: string }[] }> {
    const [clientes, productos] = await Promise.all([
      this.auth.cliente.get('/items/clientes', { params: { fields: 'id,nombre', sort: 'nombre', limit: -1 } }),
      this.auth.cliente.get('/items/productos', { params: { fields: 'id,nombre,precio', sort: 'nombre', limit: -1 } })
    ]);
    return { clientes: clientes.data.data, productos: productos.data.data };
  }
  async listado(pagina: number, texto: string): Promise<{ registros: Pedido[]; total: number }> {
    const filtro = texto.trim() ? { 'filter[observaciones][_icontains]': texto.trim() } : {};
    const [lista, total] = await Promise.all([
      this.auth.cliente.get<{ data: Pedido[] }>('/items/pedidos', { params: { fields: this.fields, page: pagina, limit: 3, sort: '-id', ...filtro } }),
      this.auth.cliente.get('/items/pedidos', { params: { 'aggregate[count]': '*', ...filtro } })
    ]);
    return { registros: lista.data.data, total: Number(total.data.data[0]?.count ?? 0) };
  }
  async detalle(id: number): Promise<Pedido> {
    return (await this.auth.cliente.get<{ data: Pedido }>('/items/pedidos/' + id, { params: { fields: this.fields } })).data.data;
  }
  async guardar(datos: PedidoGuardar, id?: number, anteriores: number[] = []): Promise<number> {
    if (!datos.detalles.length) throw new Error('Agrega al menos un producto.');
    if (new Set(datos.detalles.map(l => l.producto)).size !== datos.detalles.length) throw new Error('Cada producto debe aparecer una sola vez.');
    for (const l of datos.detalles) {
      if (!Number.isInteger(l.cantidad) || l.cantidad < 1 || l.cantidad > 9999) throw new Error('Cantidad inválida.');
      centavos(l.precio_unitario);
    }
    const { detalles, ...cabecera } = datos;
    // Una sola petición anidada: Directus guarda cabecera e hijos conjuntamente.
    const cuerpo = id === undefined ? { ...cabecera, detalles: detalles.map(({ id: ignorado, ...l }) => l) }
      : { ...cabecera, detalles: {
        create: detalles.filter(l => !l.id).map(({ id: ignorado, ...l }) => l),
        update: detalles.filter(l => !!l.id),
        delete: anteriores.filter(anterior => !detalles.some(l => l.id === anterior))
      } };
    const r = id === undefined ? await this.auth.cliente.post('/items/pedidos', cuerpo) : await this.auth.cliente.patch('/items/pedidos/' + id, cuerpo);
    return r.data.data.id;
  }
  async eliminar(id: number): Promise<void> { await this.auth.cliente.delete('/items/pedidos/' + id); }
}
