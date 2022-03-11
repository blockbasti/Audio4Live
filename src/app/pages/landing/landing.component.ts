import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PreloadImgService } from '../../preload-img.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DatenschutzComponent } from 'src/app/shared/datenschutz/datenschutz.component';
import { ImpressumComponent } from 'src/app/shared/impressum/impressum.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  datenschutzModalRef: MdbModalRef<DatenschutzComponent> | null = null;
  impressumModalRef: MdbModalRef<ImpressumComponent> | null = null;

  config = {
    animation: true,
    backdrop: true,
    containerClass: 'right',
    ignoreBackdropClick: false,
    keyboard: true,
    modalClass: 'modal-top-right modal-dialog-scrollable',
  };

  constructor(
    route: ActivatedRoute,
    private preloadImageService: PreloadImgService,
    titleService: Title,
    private modalService: MdbModalService
  ) {
    titleService.setTitle('Audio4Live Veranstaltungstechnik');
    route.data.subscribe((data) => {
      if (data.openPrivacy) {
        this.datenschutzModalRef = this.modalService.open(DatenschutzComponent, this.config);
      }
      if (data.openImprint) {
        this.impressumModalRef = this.modalService.open(ImpressumComponent, this.config);
      }
    });
  }

  loaded() {
    this.preloadImageService.preloadImages();
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
