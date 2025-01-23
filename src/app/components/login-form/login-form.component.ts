import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (u: any) =>
          u.email === this.loginForm.value.email &&
          u.password === this.loginForm.value.password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`✅ Witamy, ${user.name}! ✅`);
        this.loginForm.reset();
        this.router.navigate(['/home']).then(() => {
          window.location.reload(); 
        });
      } else {
        alert('❌ Niepoprawny e-mail lub hasło. ❌');
      }
    } else {
      alert('⚠️ Proszę wypełnić pola poprawnie. ⚠️');
    }
  }
}
