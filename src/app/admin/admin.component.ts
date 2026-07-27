import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, signOut } from 'firebase/auth';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { Subject } from 'rxjs';
import { authState } from '../firebase/auth-state';
import { AUTH } from '../firebase/firebase.providers';
import { BookingComponent } from './booking.component';
import { MailComponent } from './mail.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [MdbTabsModule, BookingComponent, MailComponent]
})
export class AdminComponent implements OnInit {
  refresh: Subject<any> = new Subject();
  user?: User;

  private readonly auth = inject(AUTH);

  constructor(private readonly router: Router) {
    authState(this.auth).subscribe((user) => (this.user = user));
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
