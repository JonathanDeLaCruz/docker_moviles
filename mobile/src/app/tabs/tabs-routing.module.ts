import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { COLECCIONES } from '../catalogos/colecciones.config';
import { authGuard } from '../guard/auth.guard';
const cargarLista = () => import('../colecciones-list/colecciones-list.module').then(m => m.ColeccionesListPageModule);
const cargarDetalle = () => import('../colecciones-view/colecciones-view.module').then(m => m.ColeccionesViewPageModule);
const cargarFormulario = () => import('../colecciones-form/colecciones-form.module').then(m => m.ColeccionesFormPageModule);
function rutasColeccion(ruta: string, coleccion: string): Routes {
  const data = { coleccion };
  return [
    { path: ruta + '/formulario/:id', data, loadChildren: cargarFormulario },
    { path: ruta + '/formulario', data, loadChildren: cargarFormulario },
    { path: ruta + '/detalle/:id', data, loadChildren: cargarDetalle },
    { path: ruta, data, loadChildren: cargarLista }
  ];
}
const routes: Routes = [{ path: '', component: TabsPage, canActivateChild: [authGuard], children: [
  { path: 'productos/formulario', loadChildren: () => import('../productos-form/productos-form.module').then(m => m.ProductosFormPageModule) },
  { path: 'productos/detalle/:id', loadChildren: () => import('../productos-view/productos-view.module').then(m => m.ProductosViewPageModule) },
  { path: 'productos/imagen/:id', loadChildren: () => import('../producto-imagen/producto-imagen.module').then(m => m.ProductoImagenPageModule) },
  { path: 'productos', loadChildren: () => import('../productos-list/productos-list.module').then(m => m.ProductosListPageModule) },
  ...rutasColeccion('pedidos', 'pedidos'),
  ...COLECCIONES.filter(c => c.tabla !== 'pedidos').reduce<Routes>((rutas, c) => [...rutas, ...rutasColeccion('catalogos/' + c.ruta, c.ruta)], []),
  { path: 'catalogos', loadChildren: () => import('../catalogos/catalogos.module').then(m => m.CatalogosPageModule) },
  { path: 'tab1', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'tab2', redirectTo: 'pedidos', pathMatch: 'full' },
  { path: 'tab3', redirectTo: 'catalogos', pathMatch: 'full' },
  { path: '', redirectTo: 'productos', pathMatch: 'full' }
]}];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class TabsPageRoutingModule {}
