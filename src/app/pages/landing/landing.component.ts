import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatenschutzModalService } from '../../shared/datenschutz-modal.service';
import { ImpressumModalService } from 'src/app/shared/impressum-modal.service';

@Component({
  selector: 'app-landing',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(
    route: ActivatedRoute,
    datenschutzModalService: DatenschutzModalService,
    impressumModalService: ImpressumModalService
  ) {
    route.data.subscribe((data) => {
      if (data.openPrivacy) {
        datenschutzModalService.showModal();
      }
      if (data.openImprint) {
        impressumModalService.showModal();
      }
    });
  }

  ngOnInit(): void {}
}
