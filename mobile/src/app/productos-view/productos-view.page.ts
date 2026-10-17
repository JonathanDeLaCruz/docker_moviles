import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Producto, ProductosService } from '../services/productos';
import { ImagenesService } from '../services/imagenes';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-productos-view',
  templateUrl: './productos-view.page.html',
  styleUrls: ['./productos-view.page.scss'],
  standalone: false
})
export class ProductosViewPage implements OnDestroy {
  imagenUrl = '';
  mensajeImagen = '';

  producto: Producto | null = null;
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private imagenesService: ImagenesService,
    private loading: LoadingController
  ) { }

  ionViewWillEnter() {
    this.cargarProducto();
  }

  async cargarProducto(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (this.imagenUrl) URL.revokeObjectURL(this.imagenUrl);
    this.imagenUrl = '';
    this.mensajeImagen = '';
    this.producto = null;
    this.mensajeError = '';

    if (!id) {
      this.mensajeError = 'No se recibió el ID del producto.';
      return;
    }

    const loading = await this.loading.create({
      message: 'Cargando producto...',
      spinner: 'bubbles',
    });

    await loading.present();

    try {
      this.producto = await firstValueFrom(this.productosService.detalle(Number(id)));
      if (this.producto.imagen) {
        try { this.imagenUrl = URL.createObjectURL(await this.imagenesService.obtener(this.producto.imagen)); }
        catch { this.mensajeImagen = 'No fue posible cargar la imagen del producto.'; }
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      this.mensajeError = 'No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.';
    } finally {
      await loading.dismiss();
    }
  }

  ngOnDestroy(): void {
    if (this.imagenUrl) URL.revokeObjectURL(this.imagenUrl);
  }

  abrirPagina(): void {
    if (!this.producto) {
      return;
    }

    const url = `${environment.apiUrl}/items/productos/${this.producto.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

}
