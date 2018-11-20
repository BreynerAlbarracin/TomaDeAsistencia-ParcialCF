import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScannerPage } from '../scanner/scanner';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-horario',
  templateUrl: 'horario.html',
})
export class HorarioPage {

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HorarioPage');
  }

  goScanner() {
    let idUser = localStorage.getItem('idUser')
    if (idUser != null) {
      this.navCtrl.setRoot(ScannerPage);
    } else {
      let alert = this.alertCtrl.create({
        title: 'No Login',
        subTitle: 'Debe loguearse antes de registrarse en una clase',
        buttons: ['Ok']
      });
      alert.present();
    }
  }
}
