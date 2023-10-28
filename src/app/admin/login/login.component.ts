import { Component, OnInit } from '@angular/core';
import { Auth, browserLocalPersistence, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  constructor(
    private fireauth: Auth,
    private readonly router: Router
  ) {}

  credentials = { email: '', password: '' };

  ngOnInit(): void {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
    this.fireauth.setPersistence(browserLocalPersistence);
  }

  login() {
    signInWithEmailAndPassword(this.fireauth, this.credentials.email, this.credentials.password).then((_) => {
      this.router.navigateByUrl('/admin');
    });
  }
}
