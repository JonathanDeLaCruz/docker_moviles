import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { COLECCIONES } from '../catalogos/colecciones.config';
import { authGuard } from '../guard/auth.guard';
import { rutasColeccion } from '../catalogos/rutas-coleccion';
const routes: Routes = [{ path: '', component: TabsPage, canActivateChild: [authGuard], children: [
  { path: 'productos/formulario', loadChildren: () => import('../productos-form/productos-form.module').then(m => m.ProductosFormPageModule) },
  { path: 'productos/detalle/:id', loadChildren: () => import('../productos-view/productos-view.module').then(m => m.ProductosViewPageModule) },
  { path: 'productos/imagen/:id', loadChildren: () => import('../producto-imagen/producto-imagen.module').then(m => m.ProductoImagenPageModule) },
  { path: 'productos', loadChildren: () => import('../productos-list/productos-list.module').then(m => m.ProductosListPageModule) },
  ...rutasColeccion('pedidos', 'pedidos'),
  { path: 'resumen', loadChildren: () => import('../resumen/resumen.module').then(m => m.ResumenPageModule) },
  ...COLECCIONES.filter(c => c.tabla !== 'pedidos').reduce<Routes>((rutas, c) => [...rutas, ...rutasColeccion('catalogos/' + c.ruta, c.ruta)], []),
  { path: 'catalogos', redirectTo: 'resumen', pathMatch: 'full' },
  { path: 'tab1', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'tab2', redirectTo: 'pedidos', pathMatch: 'full' },
  { path: 'tab3', redirectTo: 'resumen', pathMatch: 'full' },
  { path: '', redirectTo: 'productos', pathMatch: 'full' }
]}];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class TabsPageRoutingModule {}
