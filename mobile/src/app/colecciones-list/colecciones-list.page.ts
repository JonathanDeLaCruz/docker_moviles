import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { buscarColeccion, rutaColeccion } from '../catalogos/colecciones.config';
import { ColeccionesService, Registro } from '../services/colecciones';
@Component({ selector: 'app-colecciones-list', templateUrl: './colecciones-list.page.html', standalone: false })
export class ColeccionesListPage {
  config = buscarColeccion(this.route.snapshot.data['coleccion']);
  base = rutaColeccion(this.config);
  registros: Registro[] = []; total = 0; pagina = 1; porPagina = 3; texto = ''; mensaje = ''; cargando = false;
  // Elige una ubicación: false = barra; true = botón flotante.
  readonly usarBotonFlotante = false;
  private solicitud = 0;
  constructor(private route: ActivatedRoute, private servicio: ColeccionesService, private alertas: AlertController) {}
  ionViewWillEnter(): void { void this.cargar(); }
  async cargar(): Promise<void> {
    const solicitud = ++this.solicitud; this.cargando = true; this.mensaje = '';
    try {
      const r = await this.servicio.listado(this.config, this.pagina, this.porPagina, this.texto);
      if (solicitud !== this.solicitud) return;
      this.registros = r.registros; this.total = r.total;
      if (this.pagina > 1 && !r.registros.length) { this.pagina--; await this.cargar(); }
    } catch (e) { if (solicitud === this.solicitud) { this.registros = []; this.total = 0; this.mensaje = this.servicio.mensaje(e); } }
    finally { if (solicitud === this.solicitud) this.cargando = false; }
  }
  buscar(event: CustomEvent): void { this.texto = event.detail.value ?? ''; this.pagina = 1; void this.cargar(); }
  cambiarPagina(pagina: number): void { this.pagina = pagina; void this.cargar(); }
  titulo(registro: Registro): string {
    return this.config.tabla === 'pedidos' ? 'Pedido #' + registro['id'] : registro['nombre'];
  }
  resumen(registro: Registro): string {
    if (this.config.tabla === 'pedidos') return registro['cliente']?.nombre + ' · ' + registro['producto']?.nombre + ' · ' + registro['cantidad'] + ' · ' + registro['estado'];
    return registro['correo'] || registro['codigo'] || registro['descripcion'] || '';
  }
  async eliminar(registro: Registro): Promise<void> {
    const alerta = await this.alertas.create({ header: 'Eliminar ' + this.config.singular, message: '¿Eliminar este registro?', buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'destructive' }] });
    await alerta.present();
    if ((await alerta.onDidDismiss()).role !== 'destructive') return;
    try { await this.servicio.eliminar(this.config, registro['id']); await this.cargar(); }
    catch (e) { this.mensaje = this.servicio.mensaje(e); }
  }
}
