import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  constructor(public afAuth: AngularFireAuth) {
  }
  login_with_google() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  login_with_email(email, password) {
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  add_email (email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }

  update_user_info (displayName) {
    this.afAuth.auth.currentUser.updateProfile(displayName);
  }
}
