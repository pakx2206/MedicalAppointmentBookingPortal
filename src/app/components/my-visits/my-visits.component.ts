import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-visits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-visits.component.html',
  styleUrls: ['./my-visits.component.scss'],
})
export class MyVisitsComponent implements OnInit {
  visits: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadVisits();
  }

  getUserId(): string {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    return user?.email || 'guest'; 
  }

  loadVisits() {
    const loggedUser = localStorage.getItem('currentUser');
    if (!loggedUser) {
        this.visits = [];
        return;
    }

    const user = JSON.parse(loggedUser);
    if (!user.email) {
        this.visits = [];
        return;
    }

    const userEmail = user.email;
    const appointmentKey = `appointments_${userEmail}`;

    let storedVisits = localStorage.getItem(appointmentKey);
    this.visits = storedVisits ? JSON.parse(storedVisits) : [];
  }

  getVisitCost(visit: any): string {
    if (visit.details.paymentMethod === 'karta' || visit.details.currency === 'PLN') {
      return '150 PLN';
    } else {
      return `${visit.details.convertedPrice} ${visit.details.currency}`;
    }
  }

  cancelVisit(visit: any) {
    const confirmation = window.confirm('Czy na pewno chcesz odwołać wizytę?');
    if (confirmation) {
        const loggedUser = localStorage.getItem('currentUser');
        if (!loggedUser) {
            alert("Błąd: Musisz być zalogowany, aby usunąć wizytę.");
            return;
        }

        const user = JSON.parse(loggedUser);
        const userEmail = user.email;
        const appointmentKey = `appointments_${userEmail}`;

        let storedAppointments = localStorage.getItem(appointmentKey);
        let appointments: any[] = storedAppointments ? JSON.parse(storedAppointments) : [];

        appointments = appointments.filter(app => app.id !== visit.id);

        localStorage.setItem(appointmentKey, JSON.stringify(appointments));
        this.visits = appointments; 
    }
  }

  editAppointment(visit: any) {
    localStorage.setItem('editAppointmentId', visit.id);
    localStorage.setItem('editAppointment', JSON.stringify(visit));
    this.router.navigate(['/appointment']);
}

}
