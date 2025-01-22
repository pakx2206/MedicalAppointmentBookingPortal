import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDate, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

registerLocaleData(localePl, 'pl');

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['../appointment-form/appointment-form.component.scss']
  ,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AppointmentFormComponent implements OnInit {
  currentMonth: Date = new Date();
  formattedMonth: string = '';
  weekdays: string[] = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
  hours: string[] = ['09', '10', '11', '12', '13', '14', '15', '16'];
  weeksInMonth: any[] = [];
  selectedDay: any = null;
  selectedHour: string | null = null;
  showAppointmentForm: boolean = false;
  appointmentForm: FormGroup;
  appointments: { date: string; hour: string; details: any }[] = [];

  specializations = ['Kardiolog', 'Neurolog', 'Ortopeda', 'Dermatolog'];
  doctors: { [key: string]: string[] } = {
    Kardiolog: ['Dr. Kowalski', 'Dr. Nowak', 'Dr. Wiśniewski', 'Dr. Dąbrowski'],
    Neurolog: ['Dr. Zieliński', 'Dr. Szymański', 'Dr. Woźniak', 'Dr. Kamiński'],
    Ortopeda: ['Dr. Lewandowski', 'Dr. Jankowski', 'Dr. Wójcik', 'Dr. Kaczmarek'],
    Dermatolog: ['Dr. Mazur', 'Dr. Krawczyk', 'Dr. Piotrowski', 'Dr. Grabowski']
  };

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      specialization: ['', Validators.required],
      doctor: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      paymentMethod: ['', Validators.required],
      currency: [''],
      agreement: [false, Validators.requiredTrue],
      hour: [''] // Added hour field
    });
  }

  ngOnInit() {
    this.updateFormattedMonth();
    this.loadAppointments();
    this.generateCalendar();
  }

  updateFormattedMonth() {
    this.formattedMonth = formatDate(this.currentMonth, 'MMMM yyyy', 'pl');
  }

  generateCalendar() {
    let start = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    let end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    let days: any[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      let formattedDate = formatDate(d, 'yyyy-MM-dd', 'pl');
      let bookedHours = this.appointments
        .filter(app => app.date === formattedDate)
        .map(app => app.hour);

      days.push({
        date: new Date(d),
        isAvailable: bookedHours.length < this.hours.length, // If all hours booked, unavailable
        appointments: this.hours.filter(hour => !bookedHours.includes(hour))
      });
    }

    this.weeksInMonth = this.chunkIntoWeeks(days);
  }

  chunkIntoWeeks(days: any[]) {
    let weeks = [];
    let week = [];
    let firstDayIndex = days[0].date.getDay();

    for (let i = 0; i < firstDayIndex; i++) {
      week.push(null);
    }

    for (let day of days) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }

  selectDay(day: any) {
    if (!day) return;
    console.log('Kliknięto dzień:', day.date);
    console.log('Dostępne godziny:', day.appointments);

    this.selectedDay = day;
    this.selectedHour = null;
    this.showAppointmentForm = false;
  }

  selectHour(hour: string) {
    this.selectedHour = hour;
    this.appointmentForm.patchValue({ hour: hour }); // Update form field
    this.showAppointmentForm = true;
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.updateFormattedMonth();
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.updateFormattedMonth();
    this.generateCalendar();
  }

  bookAppointment() {
    if (!this.selectedDay || !this.selectedHour) return;

    const newAppointment = {
      date: formatDate(this.selectedDay.date, 'yyyy-MM-dd', 'pl'),
      hour: this.selectedHour,
      details: this.appointmentForm.value
    };

    let storedAppointments = localStorage.getItem('appointments');
    let appointments: any[] = storedAppointments ? JSON.parse(storedAppointments) : [];

    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    this.selectedDay.appointments = this.selectedDay.appointments.filter((h: string) => h !== this.selectedHour);
    this.selectedDay.isAvailable = this.selectedDay.appointments.length > 0; // Mark unavailable if no more slots

    this.selectedHour = null;
    this.showAppointmentForm = false;

    console.log("Zapisana wizyta:", newAppointment);
  }

  isHourBooked(date: Date, hour: string): boolean {
    let formattedDate = formatDate(date, 'yyyy-MM-dd', 'pl');
    return this.appointments.some(app => app.date === formattedDate && app.hour === hour);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  loadAppointments() {
    let storedAppointments = localStorage.getItem('appointments');
    try {
      this.appointments = storedAppointments ? JSON.parse(storedAppointments) : [];
      if (!Array.isArray(this.appointments)) {
        this.appointments = [];
      }
    } catch (error) {
      console.error('Błąd podczas ładowania wizyt:', error);
      this.appointments = [];
    }
  }

  isDayFullyBooked(date: Date): boolean {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'pl');
    const bookedAppointments = this.appointments.filter(app => app.date === formattedDate);
    return bookedAppointments.length >= this.hours.length;
  }
}
