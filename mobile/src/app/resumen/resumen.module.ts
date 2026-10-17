import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ResumenPage } from './resumen.page';
@NgModule({ declarations: [ResumenPage], imports: [CommonModule, IonicModule, RouterModule.forChild([{ path: '', component: ResumenPage }])] })
export class ResumenPageModule {}
