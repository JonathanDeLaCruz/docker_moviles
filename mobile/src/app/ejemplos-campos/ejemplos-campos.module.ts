import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EjemplosCamposPage } from './ejemplos-campos.page';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, RouterModule.forChild([{ path: '', component: EjemplosCamposPage }])],
  declarations: [EjemplosCamposPage]
})
export class EjemplosCamposPageModule {}
