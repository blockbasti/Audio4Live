import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
    selector: 'app-agb',
    templateUrl: './agb.component.html',
    styleUrls: ['./agb.component.scss'],
    standalone: false
})
export class AGBComponent {
  constructor(public readonly modalRef: MdbModalRef<AGBComponent>) {}
}
