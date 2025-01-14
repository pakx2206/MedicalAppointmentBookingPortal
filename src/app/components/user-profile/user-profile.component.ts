import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  currentUser: any;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
  }
}
