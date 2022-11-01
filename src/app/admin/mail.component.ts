import { Component, OnInit } from '@angular/core';
import { Functions } from '@angular/fire/functions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
})
export class MailComponent implements OnInit {
  refresh: Subject<any> = new Subject();

  constructor(private readonly fns: Functions) {
  }

  ngOnInit(): void {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }

}
