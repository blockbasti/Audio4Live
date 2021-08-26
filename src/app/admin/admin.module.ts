import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BadgeModule, ButtonsModule, CardsModule, InputsModule, TableModule } from 'angular-bootstrap-md';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';

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
    MatInputModule,
  ],
})
export class AdminModule {}
