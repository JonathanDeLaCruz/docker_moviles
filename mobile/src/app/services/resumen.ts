import { Injectable } from '@angular/core';
import { AuthService } from './auth';
export interface Resumen {
  productos: number; unidades: number; sinStock: number;
  pendientes: number; entregados: number; cancelados: number; pedidos: number;
}
@Injectable({ providedIn: 'root' })
export class ResumenService {
  constructor(private auth: AuthService) {}
  async consultar(): Promise<Resumen> {
    const [productos, agotados, pedidos] = await Promise.all([
      this.auth.cliente.get<{ data: { count: number | string; sum: { stock: number | string | null } }[] }>('/items/productos', { params: { 'aggregate[count]': '*', 'aggregate[sum]': 'stock' } }),
      this.auth.cliente.get<{ data: { count: number | string }[] }>('/items/productos', { params: { 'aggregate[count]': '*', 'filter[stock][_eq]': 0 } }),
      this.auth.cliente.get<{ data: { estado: string; count: number | string }[] }>('/items/pedidos', { params: { 'aggregate[count]': '*', 'groupBy[]': 'estado' } })
    ]);
    const total = (estado: string) => Number(pedidos.data.data.find(p => p.estado === estado)?.count ?? 0);
    return {
      productos: Number(productos.data.data[0]?.count ?? 0), unidades: Number(productos.data.data[0]?.sum?.stock ?? 0),
      sinStock: Number(agotados.data.data[0]?.count ?? 0), pendientes: total('pendiente'), entregados: total('entregado'),
      cancelados: total('cancelado'), pedidos: pedidos.data.data.reduce((suma, p) => suma + Number(p.count), 0)
    };
  }
}
