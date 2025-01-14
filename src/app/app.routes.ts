import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { HomeComponent } from './components/home/home.component'; // Import HomeComponent

export const routes: Routes = [
  { path: 'register', component: RegistrationFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'appointment', component: AppointmentFormComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Przekierowanie do 'home'
  { path: 'home', component: HomeComponent }, // Strona główna
  { path: '**', redirectTo: 'home', pathMatch: 'full' } // Obsługa nieistniejących tras
];
