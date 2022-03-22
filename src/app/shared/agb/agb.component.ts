import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss'],
})
export class AGBComponent {
  constructor(public modalRef: MdbModalRef<AGBComponent>) {}
}
