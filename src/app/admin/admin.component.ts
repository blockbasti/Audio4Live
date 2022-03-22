import { Component, OnInit } from '@angular/core';
import { Auth, signOut, user, User } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { addWeeks, format } from 'date-fns';
import { Subject } from 'rxjs';
import { Blocker } from '../buchen/blocker';
import { Buchung } from '../buchen/buchung';

type Booking = Buchung | { id: string };
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  refresh: Subject<any> = new Subject();
  user?: User;

  blockerCollection: CollectionReference<Blocker>;
  blocker: Blocker[];

  bookingCollection: CollectionReference<Buchung | { id: string }>;
  bookings: Booking[];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  isSingleDay = new FormControl();

  constructor(private readonly auth: Auth, private readonly db: Firestore, private readonly router: Router) {
    user(auth).subscribe((user) => (this.user = user));

    // get blocker
    this.blockerCollection = collection(db, 'blocker').withConverter<Blocker>({
      fromFirestore: (snapshot) => {
        return new Blocker(
          {
            start: (snapshot.data().start as Timestamp).toDate(),
            end: (snapshot.data().end as Timestamp).toDate(),
          },
          snapshot.data().isSingleDay,
          snapshot.id
        );
      },
      toFirestore: (blocker: Blocker) => {
        return { start: blocker.interval.start, end: blocker.interval.end, isSingleDay: blocker.isSingleDay };
      },
    });

    const blockerquery = query(this.blockerCollection, where('end', '>=', new Date()), orderBy('end'));

    collectionData(blockerquery, { idField: 'id' }).subscribe((blocker) => {
      this.blocker = blocker;
      this.refresh.next(null);
    });

    // get bookings
    this.bookingCollection = collection(db, 'booking').withConverter<Booking>({
      fromFirestore: (snapshot) => {
        let buchung = snapshot.data() as Buchung;
        if (snapshot.data().date.start && snapshot.data().date.end) {
          buchung.date = {
            start: (snapshot.data().date.start as Timestamp).toDate(),
            end: (snapshot.data().date.end as Timestamp).toDate(),
          };
        }
        return {
          ...buchung,
          id: snapshot.id,
        };
      },
      toFirestore: (it: any) => it,
    });

    collectionData(this.bookingCollection, { idField: 'id' }).subscribe((bookings) => {
      this.bookings = bookings;
      this.refresh.next(null);
    });
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

  formatDate(date: Date, hours: boolean): string {
    try {
      if (hours) {
        return format(date, 'dd.MM.yyyy HH:mm');
      } else {
        return format(date, 'dd.MM.yyyy');
      }
    } catch (error) {
      return '';
    }
  }

  addBlocker() {
    if (!this.range.get('start').value || !this.range.get('end').value) {
      return;
    }

    addDoc(this.blockerCollection, {
      interval: {
        start: this.range.get('start').value,
        end: this.range.get('end').value,
      },
      isSingleDay: this.isSingleDay.value,
    });
  }

  nextWeek() {
    if (!this.range.get('start').value || !this.range.get('end').value) {
      return;
    }
    this.range.setValue({
      start: addWeeks(new Date(this.range.get('start').value), 1),
      end: addWeeks(new Date(this.range.get('end').value), 1),
    });
  }

  async deleteBooking(id: string) {
    if (confirm('Wirklich löschen?')) {
      await deleteDoc(doc(this.db, this.bookingCollection.path, id));
    }
  }

  async deleteBlocker(id: string) {
    if (confirm('Wirklich löschen?')) {
      await deleteDoc(doc(this.db, this.blockerCollection.path, id));
    }
  }
}
