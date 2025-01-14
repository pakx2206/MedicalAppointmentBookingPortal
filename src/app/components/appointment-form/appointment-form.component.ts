import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  imports: [CommonModule],
})
export class AppointmentFormComponent {
  currentDate = new Date();
  daysInMonth: { date: Date; appointments: string[] }[] = [];
  hours: number[] = Array.from({ length: 9 }, (_, i) => 9 + i);

  constructor() {
    this.generateDaysInMonth();
  }

  generateDaysInMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      this.daysInMonth.push({
        date: new Date(year, month, day),
        appointments: [],
      });
    }
  }

  bookAppointment(day: Date, hour: number) {
    const dayKey = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '{}');

    if (!storedAppointments[dayKey]) {
      storedAppointments[dayKey] = [];
    }

    const timeSlot = `${hour}:00`;
    if (!storedAppointments[dayKey].includes(timeSlot)) {
      storedAppointments[dayKey].push(timeSlot);
      localStorage.setItem('appointments', JSON.stringify(storedAppointments));
      alert(`Appointment booked for ${timeSlot} on ${dayKey}`);
    } else {
      alert('This time slot is already booked.');
    }
  }
}
