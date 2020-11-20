import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { addWeeks, format } from 'date-fns';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Buchung } from '../buchen/buchung';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    db.collection<any>('blocker', (ref) => ref.where('end', '>=', new Date()))
      .valueChanges({ idField: 'id' })
      .subscribe((blocker) => {
        this.blocker = blocker.map((b) => {
          return {
            interval: {
              start: (b.start as firebase.firestore.Timestamp).toDate(),
              end: (b.end as firebase.firestore.Timestamp).toDate(),
            },
            id: b.id,
          };
        });
        this.refresh.next(null);
      });
  }

  refresh: Subject<any> = new Subject();
  user?: firebase.User;

  bookings: {
    name: string;
    email: string;
    phone: string;
    call: boolean;
    message: string;
    date?: Interval;
    location: string;
    times: {
      start: string;
      end: string;
    };
    id: string;
  }[];

  blocker: { interval: Interval; id: string }[];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ngOnInit(): void {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);

    this.auth.currentUser.then((user) => (this.user = user));
    this.db
      .collection<any>('booking')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            return action;
          })
        )
      )
      .subscribe((rb) => {
        const arr: { [key: string]: Buchung } = {};
        rb.forEach((srb) => {
          const b = srb.payload.doc.data();
          const buchung: Buchung = b as Buchung;
          buchung.date = {
            start: (b.date.start as firebase.firestore.Timestamp).toDate(),
            end: (b.date.end as firebase.firestore.Timestamp).toDate(),
          };
          arr[srb.payload.doc.id] = buchung;
        });

        this.bookings = [
          ...Object.entries(arr).map((b) => {
            return { id: b[0], ...b[1] };
          }),
        ];
      });
  }

  signout() {
    this.auth.signOut().then(() => {
      window.location.replace('/');
    });
  }

  formatDate(date: Date, hours: boolean): string {
    if (hours) {
      return format(date, 'dd.MM.yyyy HH:mm');
    } else {
      return format(date, 'dd.MM.yyyy');
    }
  }

  addBlocker() {
    if (!this.range.get('start').value || !this.range.get('end').value) {
      return;
    }
    this.db.collection<any>('blocker').add({ start: this.range.get('start').value, end: this.range.get('end').value });
    this.range.setValue([{ start: null }, { end: null }]);
  }

  nextWeek() {
    if (!this.range.get('start').value || !this.range.get('end').value) {
      return;
    }
    this.range.setValue({
      start: addWeeks(new Date(this.range.get('start').value), 1).toISOString(),
      end: addWeeks(new Date(this.range.get('end').value), 1).toISOString(),
    });
  }

  deleteBooking(id: string) {
    if (confirm('Wirklich löschen?')) {
      this.db
        .doc(`booking/${id}`)
        .delete()
        .then(() => {});
    }
  }

  deleteBlocker(id: string) {
    if (confirm('Wirklich löschen?')) {
      this.db
        .doc(`blocker/${id}`)
        .delete()
        .then(() => {});
    }
  }
}
