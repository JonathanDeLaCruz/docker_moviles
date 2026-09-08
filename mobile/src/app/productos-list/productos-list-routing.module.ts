import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosListPage } from './productos-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosListPageRoutingModule {}
