import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AngularFireAuth) { }

  credentials = { email: '', password: '' }

  ngOnInit(): void {
  }

  login() {
    this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password).then(cred => {
      this.auth.setPersistence(auth.Auth.Persistence.SESSION).then(() => {
        window.location.replace('/admin');
      });
    });
  }

}
