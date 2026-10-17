import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PaginacionModule } from '../components/paginacion/paginacion.module';
import { ColeccionesListPage } from './colecciones-list.page';
@NgModule({ declarations: [ColeccionesListPage], imports: [CommonModule, IonicModule, PaginacionModule, RouterModule.forChild([{ path: '', component: ColeccionesListPage }])] })
export class ColeccionesListPageModule {}
