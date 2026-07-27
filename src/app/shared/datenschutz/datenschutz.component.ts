import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss']
})
export class DatenschutzComponent {
  constructor(public readonly modalRef: MdbModalRef<DatenschutzComponent>) {}
}
