import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buchung } from './buchung';

@Injectable({
  providedIn: 'root'
})
export class SubmitService {

  url = 'https://us-central1-audio4live-1d621.cloudfunctions.net/submit';

  constructor(private http: HttpClient) { }

  submitForm(buchung: Buchung) {
    return this.http.post(this.url,
      JSON.stringify(buchung),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' });
  }
}
