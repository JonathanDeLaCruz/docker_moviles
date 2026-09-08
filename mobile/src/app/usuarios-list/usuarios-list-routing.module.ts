import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosListPage } from './usuarios-list.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosListPageRoutingModule {}
