import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as mjml2html from 'mjml-browser';
import { Subject } from 'rxjs';
import { Mail } from './mail';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html'
})
export class MailComponent implements OnInit {
  refresh: Subject<any> = new Subject();
  mailCollection: CollectionReference<DocumentData>;

  template: string;

  public files: FileList;

  form: FormGroup = this.fb.group({
    to: new FormControl(null, [Validators.required, Validators.email]),
    from: new FormControl('"Audio4Live" info@audio4live.de', [
      Validators.required,
      Validators.pattern(
        /^("?.*" )?([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/
      )
    ]),
    cc: new FormControl(null, [Validators.email]),
    bcc: new FormControl(null, [Validators.email]),
    subject: new FormControl('Nachricht', [Validators.required]),
    content: new FormControl('Text', [Validators.required]),
    attachments: new FormControl(undefined, [])
  });

  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    db: Firestore,
    http: HttpClient
  ) {
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
    this.sendMail();
  }

  getBase64Attachment(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async getAttachments() {
    console.log(this.files);
    if (this.files.length == 0) return null;
    return await Promise.all(
      Array.from(this.files).map(async (file) => {
        return {
          filename: file.name,
          path: (await this.getBase64Attachment(file)) as string
        };
      })
    );
  }

  async sendMail(): Promise<void> {
    let attachments = await this.getAttachments();

    let mail = new Mail(this.form.value.to, this.form.value.from, this.form.value.from, this.form.value.cc, this.form.value.bcc, {
      subject: this.form.value.subject,
      html: this.getFormattedMessage(),
      attachments: attachments
    });

    console.log(mail);

    addDoc(this.mailCollection, JSON.parse(JSON.stringify(mail)))
      .then((_) => alert('Email erfolgreich gesendet!'))
      .catch((reason) => alert(reason));
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
