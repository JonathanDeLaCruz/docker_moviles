import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({ selector: 'app-producto-imagen', templateUrl: './producto-imagen.page.html', styleUrls: ['./producto-imagen.page.scss'], standalone: false })
export class ProductoImagenPage implements OnInit, OnDestroy {
  idProducto = 0;
  archivo: File | null = null;
  imagenUrl = '';
  mensaje = '';
  enviando = false;
  constructor(private route: ActivatedRoute, private auth: AuthService) {}
  async ngOnInit(): Promise<void> {
    this.idProducto = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.idProducto) || this.idProducto < 1) {
      this.mensaje = 'Selecciona un producto válido.'; return;
    }
    try {
      const response = await this.auth.cliente.get<{ data: { imagen: string | null } }>('/items/productos/' + this.idProducto, { params: { fields: 'imagen' } });
      if (response.data.data.imagen) await this.mostrar(response.data.data.imagen);
    } catch { this.mensaje = 'No fue posible cargar la imagen del producto.'; }
  }
  onFileSelected(event: Event): void {
    this.archivo = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.mensaje = '';
  }
  private async mostrar(id: string): Promise<void> {
    const response = await this.auth.cliente.get<Blob>('/assets/' + id, { responseType: 'blob' });
    if (this.imagenUrl) URL.revokeObjectURL(this.imagenUrl);
    this.imagenUrl = URL.createObjectURL(response.data);
  }
  async subir(): Promise<void> {
    if (!this.archivo || this.idProducto < 1) return;
    this.enviando = true;
    this.mensaje = '';
    try {
      const datos = new FormData();
      datos.append('file', this.archivo);
      const response = await this.auth.cliente.post<{ data: { id: string } }>('/files', datos);
      const id = response.data.data.id;
      await this.auth.cliente.patch('/items/productos/' + this.idProducto, { imagen: id });
      await this.mostrar(id);
      this.mensaje = 'Imagen guardada en el producto.';
    } catch { this.mensaje = 'No fue posible guardar la imagen. Revisa el archivo y los permisos configurados.'; }
    finally { this.enviando = false; }
  }
  ngOnDestroy(): void { if (this.imagenUrl) URL.revokeObjectURL(this.imagenUrl); }
}
