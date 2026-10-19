import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PedidosViewPage } from './pedidos-view.page';
@NgModule({ declarations: [PedidosViewPage], imports: [CommonModule, IonicModule, RouterModule.forChild([{ path: '', component: PedidosViewPage }])] })
export class PedidosViewPageModule {}
