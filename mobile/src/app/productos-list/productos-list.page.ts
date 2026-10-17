import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ProductosService } from '../services/productos';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  fecha_registro: string;
}

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.page.html',
  styleUrls: ['./productos-list.page.scss'],
  standalone: false,
})
export class ProductosListPage {
  busqueda: string = '';

  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 3;

  titulo: string = 'Productos';

  constructor(private alertController: AlertController, private productosService: ProductosService, private auth: AuthService, private router: Router) { }

  productos: Producto[] = [];

  ionViewWillEnter(): void {
    void this.cargarDatos();
  }

  async cargarProductos(): Promise<void> {
    try {
      this.productos = await firstValueFrom(this.productosService.listado(this.paginaActual, this.porPagina, this.busqueda));
    } catch (error) { console.error('Error al cargar productos:', error); }
  }

  async confirmarEliminar(id: number, nombre: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de eliminar el producto "${nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarProducto(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarProducto(id: number): Promise<void> {
    try {
      await firstValueFrom(this.productosService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Producto eliminado',
        message: 'El producto fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el producto. Revisa la conexión, los permisos de eliminación en Directus y las relaciones del registro.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }

  async cargarTotal(): Promise<void> {
    try { this.total = await firstValueFrom(this.productosService.total(this.busqueda)); }
    catch (error) { this.total = 0; console.error('Error al contar productos:', error); }
  }

  private ajustarPaginaActual(): void {
    const totalPaginas = Math.ceil(
      this.total / this.porPagina
    );

    if (totalPaginas === 0) {
      this.paginaActual = 1;
      return;
    }

    if (this.paginaActual > totalPaginas) {
      this.paginaActual = totalPaginas;
    }
  }

  async cargarDatos(): Promise<void> {
    await this.cargarTotal();
    this.ajustarPaginaActual();
    await this.cargarProductos();
  }

  async cambiarPagina(pagina: number): Promise<void> {
    this.paginaActual = pagina;
    await this.cargarProductos();
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  async cerrarSesion(): Promise<void> {
    try { await this.auth.cerrarSesion(); }
    finally { await this.router.navigateByUrl('/login', { replaceUrl: true }); }
  }
}
