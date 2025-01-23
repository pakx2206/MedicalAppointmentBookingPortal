import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-registration-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"]
})
export class RegistrationFormComponent {
  registerForm: FormGroup;
  currentUser: any = null;
  isAdmin: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      this.isAdmin = this.currentUser?.role === "admin";
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      alert("⚠️ Formularz zawiera błędy. Proszę poprawić pola. ⚠️");
      return;
    }
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = this.registerForm.value;

    const emailExists = users.some((user: any) => user.email === newUser.email);

    if (emailExists) {
    alert("❌ Użytkownik z tym adresem e-mail już istnieje. Wybierz inny adres.");
    return;
    }
    newUser.role = newUser.email === "admin@admin.com" ? "admin" : "user";

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    this.loadCurrentUser(); 

    alert(`✅ Rejestracja zakończona! Witamy, ${newUser.name}. ✅`);
    
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); 
    });
  }
}
