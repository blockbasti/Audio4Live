import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatenschutzModalService } from '../../shared/datenschutz-modal.service';

@Component({
  selector: 'app-landing',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(route: ActivatedRoute, modalService: DatenschutzModalService) {
    route.data.subscribe(data => {
      if (data.openPrivacy) { modalService.showModal(); }
    });
  }

  ngOnInit(): void {
  }

}
