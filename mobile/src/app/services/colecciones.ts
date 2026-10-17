import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Coleccion } from '../catalogos/colecciones.config';
export type Registro = Record<string, any>;
@Injectable({ providedIn: 'root' })
export class ColeccionesService {
  constructor(private auth: AuthService) {}
  private campos(config: Coleccion): string {
    const relacionados = config.campos.filter(c => c.relacion).map(c => c.clave + '.nombre');
    if (config.tabla === 'ejemplos_campos') relacionados.push('origen.nombre', 'origen.codigo');
    return ['*', ...relacionados, ...config.campos.filter(c => c.relacion).map(c => c.clave + '.id')].join(',');
  }
  async listado(config: Coleccion, pagina: number, porPagina: number, texto = ''): Promise<{ registros: Registro[]; total: number }> {
    const filtro = texto.trim() ? { filter: JSON.stringify({ _or: config.buscar.map(c => ({ [c]: { _icontains: texto.trim() } })) }) } : {};
    const url = '/items/' + config.tabla;
    const [lista, conteo] = await Promise.all([
      this.auth.cliente.get<{ data: Registro[] }>(url, { params: { fields: this.campos(config), sort: '-id', page: pagina, limit: porPagina, ...filtro } }),
      this.auth.cliente.get<{ data: { count: string | number }[] }>(url, { params: { 'aggregate[count]': '*', ...filtro } })
    ]);
    return { registros: lista.data.data, total: Number(conteo.data.data[0]?.count ?? 0) };
  }
  async detalle(config: Coleccion, id: number): Promise<Registro> {
    const r = await this.auth.cliente.get<{ data: Registro }>('/items/' + config.tabla + '/' + id, { params: { fields: this.campos(config) } });
    return r.data.data;
  }
  async opciones(tabla: string): Promise<Registro[]> {
    const r = await this.auth.cliente.get<{ data: Registro[] }>('/items/' + tabla, { params: { fields: 'id,nombre', sort: 'nombre', limit: -1 } });
    return r.data.data;
  }
  async guardar(config: Coleccion, datos: Registro, id?: number): Promise<Registro> {
    if (config.tabla === 'ejemplos_campos' && id === undefined) {
      const origen = await this.auth.cliente.get<{ data: Registro[] }>('/items/origenes_ejemplo', { params: { 'filter[codigo][_eq]': 'app_ionic', limit: 1 } });
      if (!origen.data.data.length) throw new Error('Falta el origen app_ionic en el catálogo.');
      datos = { ...datos, origen: origen.data.data[0]['id'], estado: 'pendiente', fecha_envio: new Date().toISOString() };
    }
    const url = '/items/' + config.tabla;
    const r = id === undefined ? await this.auth.cliente.post<{ data: Registro }>(url, datos) : await this.auth.cliente.patch<{ data: Registro }>(url + '/' + id, datos);
    return r.data.data;
  }
  async eliminar(config: Coleccion, id: number): Promise<void> {
    const referencias: Record<string, [string, string]> = {
      marcas: ['productos', 'marca'], proveedores: ['productos', 'proveedor'],
      clientes: ['pedidos', 'cliente'], categorias: ['productos_categorias', 'categorias_id'],
      origenes_ejemplo: ['ejemplos_campos', 'origen']
    };
    const referencia = referencias[config.tabla];
    if (referencia) {
      const [tabla, campo] = referencia;
      const r = await this.auth.cliente.get<{ data: Registro[] }>('/items/' + tabla, {
        params: { fields: 'id', limit: 1, ['filter[' + campo + '][_eq]']: id }
      });
      if (r.data.data.length) throw new Error('Este registro está en uso. Modifica sus relaciones antes de eliminarlo.');
    }
    await this.auth.cliente.delete('/items/' + config.tabla + '/' + id);
  }
  mensaje(error: any): string {
    const codigo = error?.response?.data?.errors?.[0]?.extensions?.code;
    if (codigo === 'RECORD_NOT_UNIQUE') return 'Ese valor ya está registrado.';
    if (codigo === 'RECORD_REFERENCED' || codigo === 'INVALID_FOREIGN_KEY') return 'Hay registros relacionados. Revisa las relaciones antes de continuar.';
    if (codigo === 'FORBIDDEN') return 'La cuenta no tiene permiso para esta operación.';
    return error?.response ? 'No se pudo completar la operación. Revisa los datos y las relaciones.' : (error?.message || 'No se pudo conectar con Directus.');
  }
}
