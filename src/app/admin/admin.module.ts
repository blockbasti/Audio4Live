import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { FirestoreModule, connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FunctionsModule, connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { initializeApp } from 'firebase/app';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { QuillModule } from 'ngx-quill';
import { environment } from 'src/environments/environment';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { BookingComponent } from './booking.component';
import { LoginComponent } from './login/login.component';
import { MailComponent } from './mail.component';
@NgModule({
  declarations: [AdminComponent, LoginComponent, BookingComponent, MailComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    FirestoreModule,
    FunctionsModule,
    MdbTabsModule,
    HttpClientModule,
    NgxMatFileInputModule,
    QuillModule.forRoot({
      theme: 'snow'
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    })
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'de-DE' }]
})
export class AdminModule {}
