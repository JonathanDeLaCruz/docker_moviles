import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PedidosFormPage } from './pedidos-form.page';
@NgModule({ declarations: [PedidosFormPage], imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: PedidosFormPage }])] })
export class PedidosFormPageModule {}
