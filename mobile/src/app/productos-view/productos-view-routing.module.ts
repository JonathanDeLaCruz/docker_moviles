import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosViewPage } from './productos-view.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosViewPageRoutingModule {}
