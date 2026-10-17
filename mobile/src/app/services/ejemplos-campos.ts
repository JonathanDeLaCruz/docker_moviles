import { Injectable } from '@angular/core';
import { AuthService } from './auth';

export interface EjemploCrear {
  nombre: string;
  correo: string;
  telefono: string | null;
  sitio_web: string | null;
  descripcion: string | null;
  edad: number | null;
  monto: number;
  tipo: 'curso' | 'taller';
  modalidad: 'presencial' | 'en_linea';
  tecnologias: string[];
  canales: string[];
  acepta_terminos: boolean;
  recibir_avisos: boolean;
  prioridad: number;
  fecha_evento: string | null;
  hora_evento: string | null;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
  origen: number;
  fecha_envio: string;
}
export interface OrigenEjemplo { id: number; codigo: string; nombre: string; }
export interface EjemploGuardado extends Omit<EjemploCrear, 'monto' | 'origen'> {
  origen: OrigenEjemplo;
  id: number;
  monto: string | number;
  fecha_creacion: string;
}
@Injectable({ providedIn: 'root' })
export class EjemplosCamposService {
  constructor(private auth: AuthService) {}
  private readonly campos = '*,origen.id,origen.codigo,origen.nombre';
  async obtenerOrigenApp(): Promise<OrigenEjemplo> {
    const response = await this.auth.cliente.get<{ data: OrigenEjemplo[] }>('/items/origenes_ejemplo', {
      params: { 'filter[codigo][_eq]': 'app_ionic', limit: 1 }
    });
    const origen = response.data.data[0];
    if (!origen) throw new Error('No existe el origen app_ionic en el catálogo.');
    return origen;
  }
  async crear(datos: EjemploCrear): Promise<EjemploGuardado> {
    const response = await this.auth.cliente.post<{ data: EjemploGuardado }>('/items/ejemplos_campos', datos, { params: { fields: this.campos } });
    return response.data.data;
  }
  async obtener(id: number): Promise<EjemploGuardado> {
    const response = await this.auth.cliente.get<{ data: EjemploGuardado }>('/items/ejemplos_campos/' + id, { params: { fields: this.campos } });
    return response.data.data;
  }
}
