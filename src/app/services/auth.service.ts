import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user); 
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null); 
  }
}
