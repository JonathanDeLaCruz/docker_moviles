import { Injectable } from '@angular/core';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ImagenesService {
  constructor(private auth: AuthService) {}

  async subir(archivo: File): Promise<string> {
    const datos = new FormData();
    datos.append('file', archivo);
    const response = await this.auth.cliente.post<{ data: { id: string } }>('/files', datos);
    return response.data.data.id;
  }

  async obtener(id: string): Promise<Blob> {
    const response = await this.auth.cliente.get<Blob>('/assets/' + id, { responseType: 'blob' });
    return response.data;
  }
}
