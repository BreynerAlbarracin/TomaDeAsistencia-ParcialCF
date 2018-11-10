import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioSesionPage } from './inicioSesion';

@NgModule({
  declarations: [
    InicioSesionPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioSesionPage),
  ],
})
export class InicioSesionPageModule {}
