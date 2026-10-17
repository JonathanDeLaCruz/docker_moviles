import { Injectable } from '@angular/core';
import { defer, map } from 'rxjs';
import { AuthService } from './auth';
export interface Categoria { id: number; nombre: string; }
@Injectable({ providedIn: 'root' })
export class CategoriasService {
  constructor(private auth: AuthService) {}
  listado() {
    return defer(() => this.auth.cliente.get<{ data: Categoria[] }>('/items/categorias', {
      params: { limit: 100, sort: 'id' }
    })).pipe(map(response => response.data.data));
  }
}
