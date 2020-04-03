import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { InputsModule, ButtonsModule, CardsModule, TableModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';

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
    TableModule
  ]
})
export class AdminModule { }
