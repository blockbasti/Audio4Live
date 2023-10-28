import { Component, OnInit } from '@angular/core';
import { Auth, User, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  refresh: Subject<any> = new Subject();
  user?: User;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router
  ) {
    user(auth).subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }

  signout() {
    signOut(this.auth).then(() => {
      this.router.navigateByUrl('/admin');
    });
  }
}
