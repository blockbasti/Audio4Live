import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { InputsModule, ButtonsModule, CardsModule, TableModule, BadgeModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  declarations: [AdminComponent, LoginComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    ButtonsModule,
    CardsModule,
    InputsModule.forRoot(),
    FormsModule,
    BadgeModule,
    ReactiveFormsModule,
    TableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule
  ],
})
export class AdminModule {}
