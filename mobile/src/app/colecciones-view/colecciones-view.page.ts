import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buscarColeccion, rutaColeccion } from '../catalogos/colecciones.config';
import { ColeccionesService, Registro } from '../services/colecciones';
@Component({ selector: 'app-colecciones-view', templateUrl: './colecciones-view.page.html', standalone: false })
export class ColeccionesViewPage {
  config = buscarColeccion(this.route.snapshot.data['coleccion']); base = rutaColeccion(this.config);
  registro: Registro | null = null; mensaje = '';
  constructor(private route: ActivatedRoute, private servicio: ColeccionesService) {}
  async ionViewWillEnter(): Promise<void> {
    this.mensaje = ''; this.registro = null;
    try { this.registro = await this.servicio.detalle(this.config, Number(this.route.snapshot.paramMap.get('id'))); }
    catch (e) { this.mensaje = this.servicio.mensaje(e); }
  }
  mostrar(valor: any): string {
    if (valor === null || valor === undefined || valor === '') return 'Sin dato';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (Array.isArray(valor)) return valor.join(', ') || 'Sin selección';
    if (typeof valor === 'object') return valor.nombre || valor.codigo || 'Sin dato';
    return String(valor);
  }
}
