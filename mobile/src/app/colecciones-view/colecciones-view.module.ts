import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ColeccionesViewPage } from './colecciones-view.page';
@NgModule({ declarations: [ColeccionesViewPage], imports: [CommonModule, IonicModule, RouterModule.forChild([{ path: '', component: ColeccionesViewPage }])] })
export class ColeccionesViewPageModule {}
