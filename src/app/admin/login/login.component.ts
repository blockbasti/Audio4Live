import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { AUTH } from '../../firebase/firebase.providers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule]
})
export class LoginComponent implements OnInit {
  private fireauth = inject(AUTH);

  constructor(private readonly router: Router) {}

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
