import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { dinero, importe, Pedido, PedidosService } from '../services/pedidos';
@Component({ selector: 'app-pedidos-list', templateUrl: './pedidos-list.page.html', standalone: false })
export class PedidosListPage {
  registros: Pedido[] = []; total = 0; pagina = 1; texto = ''; mensaje = ''; dinero = dinero; importe = importe;
  readonly usarBotonFlotante = false; private solicitud = 0;
  constructor(private servicio: PedidosService, private alertas: AlertController) {}
  ionViewWillEnter(): void { void this.cargar(); }
  async cargar(): Promise<void> { const n = ++this.solicitud; this.mensaje = ''; try { const r = await this.servicio.listado(this.pagina, this.texto); if(n !== this.solicitud) return; this.registros = r.registros; this.total = r.total; if(this.pagina > 1 && !r.registros.length) {this.pagina--; await this.cargar();} } catch { if(n === this.solicitud) {this.registros = []; this.total = 0; this.mensaje = 'No se pudieron consultar los pedidos.';} } }
  buscar(e: CustomEvent): void { this.texto = e.detail.value ?? ''; this.pagina = 1; void this.cargar(); }
  async eliminar(p: Pedido): Promise<void> {
    const alerta = await this.alertas.create({ header: 'Eliminar pedido', message: 'Se eliminarán el pedido y sus renglones.', buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'destructive' }] });
    await alerta.present(); if((await alerta.onDidDismiss()).role !== 'destructive') return;
    try { await this.servicio.eliminar(p.id); await this.cargar(); } catch { this.mensaje = 'No se pudo eliminar el pedido.'; }
  }
}
