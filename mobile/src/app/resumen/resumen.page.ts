import { Component } from '@angular/core';
import { Resumen, ResumenService } from '../services/resumen';
@Component({ selector: 'app-resumen', templateUrl: './resumen.page.html', standalone: false })
export class ResumenPage {
  datos: Resumen | null = null; cargando = false; mensaje = '';
  constructor(private servicio: ResumenService) {}
  ionViewWillEnter(): void { void this.cargar(); }
  async cargar(): Promise<void> {
    if (this.cargando) return;
    this.cargando = true; this.mensaje = ''; this.datos = null;
    try { this.datos = await this.servicio.consultar(); }
    catch { this.mensaje = 'No se pudo cargar el resumen. Intenta actualizarlo.'; }
    finally { this.cargando = false; }
  }
}
