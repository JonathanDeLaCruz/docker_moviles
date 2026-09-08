import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MateriasListPage } from './materias-list.page';

const routes: Routes = [
  {
    path: '',
    component: MateriasListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MateriasListPageRoutingModule {}
