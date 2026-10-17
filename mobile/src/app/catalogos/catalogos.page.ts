import { Component } from '@angular/core';
import { COLECCIONES } from './colecciones.config';
@Component({ selector: 'app-catalogos', templateUrl: './catalogos.page.html', standalone: false })
export class CatalogosPage {
  colecciones = COLECCIONES.filter(c => c.tabla !== 'pedidos');
}
