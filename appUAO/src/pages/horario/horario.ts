import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HTTP } from '@ionic-native/http';

@IonicPage()
@Component({
  selector: 'page-horario',
  templateUrl: 'horario.html',
})
export class HorarioPage {

  constructor(private http: HTTP, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HorarioPage');
  }

  goScanner() {
    let idUser = localStorage.getItem('idUser')
    if (idUser != null) {
      this.barcodeScanner.scan().then(barcodeData => {
        let url = 'http://192.168.43.217/app/registro/' + idUser + '/' + barcodeData.text

        console.log(url)

        this.http.get(url, {}, {}).then(data => {
          if (data.data == 1) {
            let alert = this.alertCtrl.create({
              title: 'Correcto',
              subTitle: 'Registro completado',
              buttons: ['Ok']
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Usuario ya registrado o sin pre registro',
              buttons: ['Ok']
            });
            alert.present();
          }
          console.log(data.status);
          console.log(data.data); // data received by server
          console.log(data.headers);

        }).catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
      }, (err) => {
        console.log('Error: ', err);
      });
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
