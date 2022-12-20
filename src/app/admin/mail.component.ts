import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { addDoc, collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileInput, FileValidator } from 'ngx-material-file-input';
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
    content: new FormControl('', [Validators.required]),
    attachments: [undefined, [FileValidator.maxContentSize(1 * 2 ** 20)]]
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
    this.sendMail();
  }

  getBase64Attachment(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async getAttachments() {
    if (this.form.get('attachments').value == null || this.form.get('attachments').value.length == 0) return null;
    return await Promise.all(
      (this.form.get('attachments').value as FileInput).files.map(async (file) => {
        return {
          filename: file.name,
          path: (await this.getBase64Attachment(file)) as string
        };
      })
    );
  }

  async sendMail(): Promise<void> {
    let attachments = await this.getAttachments();

    let mail = new Mail(this.form.value.to, this.form.value.from, this.form.value.cc, this.form.value.bcc, {
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
