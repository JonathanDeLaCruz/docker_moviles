import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'tabs', canActivate: [authGuard], loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'productos-list', redirectTo: 'tabs/productos', pathMatch: 'full' },
  { path: 'productos-view/:id', redirectTo: 'tabs/productos/detalle/:id', pathMatch: 'full' },
  { path: 'productos-form/:id', redirectTo: 'tabs/productos/formulario/:id', pathMatch: 'full' },
  { path: 'productos-form', redirectTo: 'tabs/productos/formulario', pathMatch: 'full' },
  { path: 'producto-imagen/:id', redirectTo: 'tabs/productos/imagen/:id', pathMatch: 'full' },
  { path: 'ejemplos-campos', canActivate: [authGuard], loadChildren: () => import('./ejemplos-campos/ejemplos-campos.module').then(m => m.EjemplosCamposPageModule) },
  { path: '', redirectTo: 'tabs/productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/productos' }
];
@NgModule({ imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })], exports: [RouterModule] })
export class AppRoutingModule {}
