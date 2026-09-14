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
    path: 'productos-view/:id',
    loadChildren: () => import('./productos-view/productos-view.module').then( m => m.ProductosViewPageModule)
  },
  {
    path: 'productos-form',
    loadChildren: () => import('./productos-form/productos-form.module').then( m => m.ProductosFormPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
