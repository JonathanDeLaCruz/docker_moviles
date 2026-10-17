import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
@Component({ selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'], standalone: false })
export class AppComponent {
  enlaces = [
    { ruta: '/tabs/productos', texto: 'Productos' },
    { ruta: '/tabs/pedidos', texto: 'Pedidos' },
    { ruta: '/tabs/catalogos', texto: 'Catálogos' },
    { ruta: '/tabs/catalogos/ejemplos-campos', texto: 'Ejemplos de campos' }
  ];
  constructor(private auth: AuthService, private router: Router) {}
  async salir(): Promise<void> { try { await this.auth.cerrarSesion(); } finally { await this.router.navigateByUrl('/login', { replaceUrl: true }); } }
}
