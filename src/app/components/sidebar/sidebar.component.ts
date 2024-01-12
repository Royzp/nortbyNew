import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRADOR, CUENTA, SUPERUSUARIO } from 'app/services/auth.model';
import { AuthService } from 'app/services/auth.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: Array<string>;
}
export const ROUTES: RouteInfo[] = [
  { path: '/home', title: 'Inicio', icon: 'home', class: '' },
  // { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  // { path: '/user-profile', title: 'User Profile',  icon: 'person', class: '' },
  { path: '/upload', title: 'Cargas/Upload', icon: 'upload', class: '' },
  { path: '/profile', title: 'Perfil/Profile', icon: 'person', class: '' },
  { path: '/users', title: 'Usuarios/Users',  icon: 'person', class: '', roles: [ADMINISTRADOR] },
  // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  // { path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '' },
  // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  usuario: string;
  menuItems: any[];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const role = this.authService.getRole();
    this.menuItems = ROUTES.filter((menuItem) => menuItem && (menuItem.roles === undefined || menuItem.roles.find(r => r === role)));
    this.usuario = this.authService.getUsuario();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
