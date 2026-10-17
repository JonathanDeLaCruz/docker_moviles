import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ColeccionesFormPage } from './colecciones-form.page';
@NgModule({ declarations: [ColeccionesFormPage], imports: [CommonModule, ReactiveFormsModule, IonicModule, RouterModule.forChild([{ path: '', component: ColeccionesFormPage }])] })
export class ColeccionesFormPageModule {}
