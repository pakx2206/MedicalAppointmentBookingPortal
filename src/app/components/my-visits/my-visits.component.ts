import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-visits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-visits.component.html',
  styleUrls: ['./my-visits.component.scss'],
})
export class MyVisitsComponent implements OnInit {
  visits: any[] = [];

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    const storedVisits = localStorage.getItem('appointments');
    if (storedVisits) {
      this.visits = JSON.parse(storedVisits).map((visit: any) => ({
        ...visit,
        date: new Date(visit.date),
      }));
    }
  }

  cancelVisit(visit: any) {
    this.visits = this.visits.filter(v => v !== visit);
    localStorage.setItem('appointments', JSON.stringify(this.visits));
  }
}
