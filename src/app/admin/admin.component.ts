import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Buchung } from '../buchen/buchung';

import { format } from 'date-fns';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) { }

  user?: firebase.User;
  bookings?: Buchung[];

  ngOnInit(): void {
    this.auth.currentUser.then(user => this.user = user);
    this.db.collection<any>('booking').valueChanges().subscribe(bookings => {
      this.bookings = bookings.map(b => {
        b.date = {
          start: (b.date.start as firebase.firestore.Timestamp).toDate(),
          end: (b.date.end as firebase.firestore.Timestamp).toDate()
        };
        return b as Buchung;
      });
    });
  }

  signout() {
    this.auth.signOut().then(() => {
      window.location.replace('/');
    });
  }

  formatDate(date: Date): string {
    return format(date, 'dd.MM.yyyy HH:mm');
  }

}
