import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { addDoc, collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Mail } from './mail';
const mjml2html = require('mjml-browser');

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html'
})
export class MailComponent implements OnInit {
  refresh: Subject<any> = new Subject();
  mailCollection: CollectionReference<DocumentData>;

  template: string;

  form: FormGroup = this.fb.group({
    to: new FormControl(null, [Validators.required, Validators.email]),
    from: new FormControl('info@audio4live.de', [Validators.required, Validators.email]),
    cc: new FormControl(null, [Validators.email]),
    bcc: new FormControl(null, [Validators.email]),
    subject: new FormControl('Nachricht', [Validators.required]),
    content: new FormControl(null, [Validators.required])
  });

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder, db: Firestore, http: HttpClient) {
    this.mailCollection = collection(db, 'mail');
    http.get('assets/message.mjml', { responseType: 'text' }).subscribe((data) => (this.template = data));
  }

  ngOnInit(): void {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }

  onSubmit(): void {
    if (!this.form.valid) return;
    console.log(this.form.value);
    console.log(this.getFormattedMessage());
    this.sendMail();
  }

  sendMail(): void {
    let mail = new Mail(this.form.value.to, this.form.value.from, this.form.value.cc, this.form.value.bcc, {
      subject: this.form.value.subject,
      html: this.getFormattedMessage()
    });
    addDoc(this.mailCollection, JSON.parse(JSON.stringify(mail)));
  }

  byPassHTML(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getFormattedMessage() {
    let html: string = mjml2html(this.template, {}).html;
    html = html.replace('{{body}}', this.form.get('content').value);
    return html;
  }
}
