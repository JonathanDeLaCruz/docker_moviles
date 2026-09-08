import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'productos-list',
    loadChildren: () => import('./productos-list/productos-list.module').then( m => m.ProductosListPageModule)
  },
  {
    path: 'usuarios-list',
    loadChildren: () => import('./usuarios-list/usuarios-list.module').then( m => m.UsuariosListPageModule)
  },
  {
    path: 'materias-list',
    loadChildren: () => import('./materias-list/materias-list.module').then( m => m.MateriasListPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
