import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';

@Component({
  template: `
  <ion-list lines="none">
    <ion-list-header class="ion-padding-bottom">Morten</ion-list-header>
    <ion-item button><ion-icon slot ="start" name="person-circle-outline"></ion-icon> View profile</ion-item>
    <ion-item (click)="logout()" button><ion-icon color="danger" slot ="start" name="log-out-outline"></ion-icon> Logout</ion-item>
  </ion-list>
  `
})
export class PopoverComponent {
  constructor(
    public router: Router,
    public authService: AuthService,
  ) {}

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
