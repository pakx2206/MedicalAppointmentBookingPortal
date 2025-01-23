import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  currentUser: any = null;

login(user: any) {
  this.currentUser = user;
  console.log('Użytkownik zalogowany:', this.currentUser);
}

  constructor(private router: Router) {
    this.loadCurrentUser();
  }

  ngOnInit() {
    this.ensureAdminAccountExists();
  }
  
  ensureAdminAccountExists(): void {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
  
    
    const adminExists = users.some((user: any) => user.email === "admin@example.com");
  
    if (!adminExists) {
      const adminAccount = {
        name: "Administrator",
        email: "admin@admin.com",
        password: "admin123", 
        role: "admin"
      };
      
      users.push(adminAccount);
      localStorage.setItem("users", JSON.stringify(users));
    }
  }
  
  loadCurrentUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } else {
      this.currentUser = null;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
    this.currentUser = null;
    this.router.navigate(['/']);
    alert('Wylogowano pomyślnie.');
  }
}
