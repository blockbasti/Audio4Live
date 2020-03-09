import { Component, OnInit, HostListener } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  faBars = faBars;

  constructor() { }

  ngOnInit(): void {
  }

  toggleNavBar() {
    const navbar = document.getElementById('navbar');
    const mainNav = document.getElementById('js-menu');
    mainNav.classList.toggle('active');
    navbar.classList.toggle('active');
  }

  closeNavBar() {
    const navbar = document.getElementById('navbar');
    const mainNav = document.getElementById('js-menu');
    mainNav.classList.remove('active');
    navbar.classList.remove('active');
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(_event) {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 0) navbar.classList.add('navbar-dark');
    else navbar.classList.remove('navbar-dark');
  }

}
