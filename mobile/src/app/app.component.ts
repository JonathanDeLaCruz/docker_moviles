import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { COLECCIONES } from './catalogos/colecciones.config';
@Component({ selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'], standalone: false })
export class AppComponent {
  enlaces = [
    { ruta: '/tabs/productos', texto: 'Productos' },
    { ruta: '/tabs/pedidos', texto: 'Pedidos' },
    { ruta: '/tabs/resumen', texto: 'Resumen' }
  ];
  catalogos = COLECCIONES.filter(c => c.tabla !== 'pedidos');
  constructor(private auth: AuthService, private router: Router) {}
  async salir(): Promise<void> { try { await this.auth.cerrarSesion(); } finally { await this.router.navigateByUrl('/login', { replaceUrl: true }); } }
}
