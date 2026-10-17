import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
interface SesionDirectus {
  access_token: string;
  refresh_token: string;
  expires: number;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = '';
  private refreshToken = '';
  private expira = 0;
  readonly cliente = axios.create({ baseURL: environment.apiUrl });

  constructor() {
    this.cliente.interceptors.request.use(config => {
      if (this.token) config.headers.set('Authorization', 'Bearer ' + this.token);
      return config;
    });
  }

  private guardar(datos: SesionDirectus): void {
    this.token = datos.access_token;
    this.refreshToken = datos.refresh_token;
    this.expira = Date.now() + Number(datos.expires);
  }

  async ingresar(email: string, password: string): Promise<void> {
    const response = await axios.post<{ data: SesionDirectus }>(environment.apiUrl + '/auth/login', {
      email: email.trim(), password, mode: 'json'
    });
    this.guardar(response.data.data);
  }

  async registrar(email: string, password: string, nombre: string): Promise<void> {
    await axios.post(environment.apiUrl + '/users/register', {
      email: email.trim(), password, first_name: nombre.trim()
    });
  }

  activa(): boolean {
    return !!this.token && Date.now() < this.expira;
  }

  async renovar(): Promise<void> {
    const response = await axios.post<{ data: SesionDirectus }>(environment.apiUrl + '/auth/refresh', {
      refresh_token: this.refreshToken, mode: 'json'
    });
    this.guardar(response.data.data);
  }

  async validarSesion(): Promise<boolean> {
    try {
      if (!this.activa()) {
        if (!this.refreshToken) return false;
        await this.renovar();
      }
      await this.cliente.get('/users/me', { params: { fields: 'id' } });
      return true;
    } catch {
      this.limpiar();
      return false;
    }
  }

  private limpiar(): void {
    this.token = '';
    this.refreshToken = '';
    this.expira = 0;
  }

  async cerrarSesion(): Promise<void> {
    try {
      if (this.refreshToken) await axios.post(environment.apiUrl + '/auth/logout', {
        refresh_token: this.refreshToken, mode: 'json'
      });
    } finally { this.limpiar(); }
  }
}
