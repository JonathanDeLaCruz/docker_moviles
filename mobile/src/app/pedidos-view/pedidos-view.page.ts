import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dinero, importe, Pedido, PedidosService } from '../services/pedidos';
@Component({ selector: 'app-pedidos-view', templateUrl: './pedidos-view.page.html', standalone: false })
export class PedidosViewPage {
  pedido: Pedido | null = null; mensaje = ''; dinero = dinero; importe = importe;
  constructor(private servicio: PedidosService, private route: ActivatedRoute) {}
  async ionViewWillEnter(): Promise<void> { this.pedido = null; this.mensaje = ''; try { this.pedido = await this.servicio.detalle(Number(this.route.snapshot.paramMap.get('id'))); } catch { this.mensaje = 'No se pudo cargar el pedido.'; } }
}
