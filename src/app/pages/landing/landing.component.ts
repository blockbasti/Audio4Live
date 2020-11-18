import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImpressumModalService } from 'src/app/shared/impressum-modal.service';
import { DatenschutzModalService } from '../../shared/datenschutz-modal.service';

@Component({
  selector: 'app-landing',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(route: ActivatedRoute, datenschutzModalService: DatenschutzModalService, impressumModalService: ImpressumModalService) {
    route.data.subscribe((data) => {
      if (data.openPrivacy) {
        datenschutzModalService.showModal();
      }
      if (data.openImprint) {
        impressumModalService.showModal();
      }
    });
  }

  loaded() {
    document.getElementById('loader')?.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loader')?.remove();
    }, 2000);
  }
}
