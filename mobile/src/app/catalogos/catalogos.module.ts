import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CatalogosPage } from './catalogos.page';
@NgModule({ declarations: [CatalogosPage], imports: [CommonModule, IonicModule, RouterModule.forChild([{ path: '', component: CatalogosPage }])] })
export class CatalogosPageModule {}
