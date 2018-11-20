import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { AlertController } from 'ionic-angular'
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-inicio-sesion',
  templateUrl: 'inicioSesion.html',
})
export class InicioSesionPage {

  username: string;
  password: string;

  constructor(private alertCtrl: AlertController, private http: HTTP, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioSesionPage');
    if (localStorage.getItem('idUser')) {
      this.navCtrl.setRoot(HomePage);
    }
  }

  disbleBt() {

  }

  login() {
    console.log("Logind pressed");
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let username = this.username
    let password = this.password

    let url = 'http://192.168.0.11/app/login/' + username + '/' + password

    console.log(url)

    this.http.get(url, {}, {}).then(data => {
      if (data.data != 0) {
        localStorage.setItem('idUser', data.data)
        let alert = this.alertCtrl.create({
          title: 'Correcto',
          subTitle: 'Login completado',
          buttons: ['Ok']
        });
        alert.present();
        this.navCtrl.setRoot(HomePage);
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Contraseña o usuario incorrecto',
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
  }

}
