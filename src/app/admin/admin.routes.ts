import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Routes } from '@angular/router';
import { provideQuillConfig } from 'ngx-quill/config';
import { redirectLoggedInTo, redirectUnauthorizedTo } from '../firebase/auth.guard';
import { provideFirebase } from '../firebase/firebase.providers';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';

export const adminRoutes: Routes = [
  {
    path: '',
    providers: [
      provideFirebase(),
      provideHttpClient(),
      provideNativeDateAdapter(),
      provideQuillConfig({ theme: 'snow' }),
      { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
    ],
    children: [
      {
        path: '',
        component: AdminComponent,
        canActivate: [redirectUnauthorizedTo(['admin/login'])]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [redirectLoggedInTo(['admin'])]
      }
    ]
  }
];

export default adminRoutes;
