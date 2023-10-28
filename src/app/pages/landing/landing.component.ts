import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AGBComponent } from 'src/app/shared/agb/agb.component';
import { DatenschutzComponent } from 'src/app/shared/datenschutz/datenschutz.component';
import { ImpressumComponent } from 'src/app/shared/impressum/impressum.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  datenschutzModalRef: MdbModalRef<DatenschutzComponent> | null = null;
  impressumModalRef: MdbModalRef<ImpressumComponent> | null = null;
  AGBModalRef: MdbModalRef<AGBComponent> | null = null;

  config = {
    animation: true,
    backdrop: true,
    containerClass: 'right',
    ignoreBackdropClick: false,
    keyboard: true,
    modalClass: 'modal-top-right modal-dialog-scrollable'
  };

  constructor(
    readonly route: ActivatedRoute,
    readonly titleService: Title,
    private readonly modalService: MdbModalService
  ) {
    titleService.setTitle('Audio4Live Veranstaltungstechnik');
    route.data.subscribe((data) => {
      if (data.openPrivacy) {
        this.datenschutzModalRef = this.modalService.open(DatenschutzComponent, this.config);
      }
      if (data.openImprint) {
        this.impressumModalRef = this.modalService.open(ImpressumComponent, this.config);
      }
      if (data.openAGB) {
        this.AGBModalRef = this.modalService.open(AGBComponent, this.config);
      }
    });
  }
}
