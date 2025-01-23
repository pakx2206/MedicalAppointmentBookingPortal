import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MyVisitsComponent } from './components/my-visits/my-visits.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { HomeComponent } from './components/home/home.component';
import { ReportIssueFormComponent } from './components/report-issue-form/report-issue-form.component';

export const routes: Routes = [
  { path: 'register', component: RegistrationFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'appointment', component: AppointmentFormComponent },
  { path: 'my-visits', component: MyVisitsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'report-issue', component: ReportIssueFormComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' } 
];
