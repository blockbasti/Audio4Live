import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
})
export class ImpressumComponent {
  constructor(public readonly modalRef: MdbModalRef<ImpressumComponent>) {}
}
