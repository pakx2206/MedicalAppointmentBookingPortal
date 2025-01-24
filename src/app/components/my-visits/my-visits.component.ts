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

  loadVisits() {
    let storedVisits = localStorage.getItem('appointments');
    if (storedVisits) {
      this.visits = JSON.parse(storedVisits);
      console.log("Załadowane wizyty:", this.visits);
    }
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
      this.visits = this.visits.filter(v => v !== visit);
      localStorage.setItem('appointments', JSON.stringify(this.visits));
  }
}

  editAppointment(visit: any) { 
    localStorage.setItem('editAppointment', JSON.stringify(visit));
    this.router.navigate(['/appointment']); 
  }
}
