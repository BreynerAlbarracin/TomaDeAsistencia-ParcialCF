import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-inicio-sesion',
  templateUrl: 'inicioSesion.html',
})
export class InicioSesionPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioSesionPage');
  }

  disbleBt() {
    
  }

  login() {
    console.log("Logind pressed");
    /* let headers = new Headers();
     headers.append('Content-Type', 'application/json');
 
     let credentials = {
       username: this.username,
       password: this.password
     };
 
     this.http.post('http://localhost:3000/auth/login', JSON.stringify(credentials), { headers: headers })
       .subscribe(res => {
         this.todoService.init(res.json());
         this.nav.setRoot(HomePage);
       }, (err) => {
         console.log(err);
       });*/
  }

}
