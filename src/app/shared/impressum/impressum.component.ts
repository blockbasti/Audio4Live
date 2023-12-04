import { ChangeDetectionStrategy, Component } from '@angular/core';
import emailScramble from 'email-scramble';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ImpressumComponent {
  public showEmail = false;
  public emailContent = '';

  public decodeEmail() {
    let email = emailScramble.decode('vasb@nhqvb9yvir.qr');
    this.emailContent = 'E-Mail: <a href="mailto:' + email + '">' + email + '</a></br>';
    this.showEmail = true;
  }

  constructor(public readonly modalRef: MdbModalRef<ImpressumComponent>) {}
}
