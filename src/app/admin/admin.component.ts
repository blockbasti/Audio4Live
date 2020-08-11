import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Buchung } from '../buchen/buchung';

import { format } from 'date-fns';
import { Subject } from 'rxjs';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    db
      .collection<any>('blocker', (ref) => ref.where('end', '>=', new Date()))
      .valueChanges({ idField: 'id' })
      .subscribe((blocker) => {
        this.blocker = blocker.map((b) => {
          return {
            interval: {
              start: (b.start as firebase.firestore.Timestamp).toDate(),
              end: (b.end as firebase.firestore.Timestamp).toDate()
            },
            id: b.id
          };
        });
        this.refresh.next(null);
      });
  }

  refresh: Subject<any> = new Subject();
  user?: firebase.User;
  bookings?: Buchung[];
  blocker: { interval: Interval, id: string }[];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  ngOnInit(): void {
    this.auth.currentUser.then((user) => (this.user = user));
    this.db
      .collection<any>('booking')
      .valueChanges()
      .subscribe((bookings) => {
        this.bookings = bookings.map((b) => {
          b.date = {
            start: (b.date.start as firebase.firestore.Timestamp).toDate(),
            end: (b.date.end as firebase.firestore.Timestamp).toDate(),
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

  formatDate(date: Date, hours: boolean): string {
    if (hours) { return format(date, 'dd.MM.yyyy HH:mm'); } else { return format(date, 'dd.MM.yyyy'); }
  }

  addBlocker() {
    this.db.collection<any>('blocker').add({ start: this.range.get('start').value, end: this.range.get('end').value });
    this.range.setValue([{ start: null }, { end: null }]);
  }

  deleteBlocker(id: string) {
    this.db.doc(`blocker/${id}`).delete().then(() => {
    });
  }
}
