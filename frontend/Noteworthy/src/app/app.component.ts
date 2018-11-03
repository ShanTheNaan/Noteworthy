import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  template : `
    <p> Hello </p>
    <button (click)="login()">Login with Google</button>

  `
})
export class AppComponent {
  title = 'Noteworthy';
  constructor(public afAuth: AngularFireAuth) {

  }
  login () {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}
