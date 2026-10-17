import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosFormPage } from './productos-form.page';

const routes: Routes = [
  {
    path: ':id',
    component: ProductosFormPage
  },
  {
    path: '',
    component: ProductosFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosFormPageRoutingModule {}
