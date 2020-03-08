import { Component, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  faBars = faBars;

  constructor() { }

  ngOnInit(): void {
  }

  toggleNavBar() {
    let navbar = document.getElementById('navbar')
    let mainNav = document.getElementById('js-menu')
    mainNav.classList.toggle('active')
    navbar.classList.toggle('active')
  }

  closeNavBar() {
    let navbar = document.getElementById('navbar')
    let mainNav = document.getElementById('js-menu')
    mainNav.classList.remove('active')
    navbar.classList.remove('active')
  }

}
