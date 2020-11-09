import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private fireauth: AngularFireAuth) {}

  credentials = { email: '', password: '' };

  ngOnInit(): void {}

  login() {
    this.fireauth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password).then((cred) => {
      this.fireauth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        window.location.replace('/admin');
      });
    });
  }
}
