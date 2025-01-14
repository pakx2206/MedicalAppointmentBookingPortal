import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent {
  registrationForm: FormGroup;
  currentUser: any;

  constructor(private fb: FormBuilder) {
    this.loadCurrentUser();

    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(18)]],
      city: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  loadCurrentUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some((user: any) => user.email === this.registrationForm.value.email);

      if (emailExists) {
        alert('Ten e-mail został już użyty przez kogoś innego.');
        return;
      }

      users.push(this.registrationForm.value);
      localStorage.setItem('users', JSON.stringify(users));

      alert('Zarejestrowano pomyślnie.');
      this.registrationForm.reset();
    } else {
      alert('Prosze uzupełnić formularz rejestracyjny poprawnie.');
    }
  }
}
