import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDate, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
registerLocaleData(localePl, 'pl');
@Component({
	selector: 'app-appointment-form',
	standalone: true,
	templateUrl: './appointment-form.component.html',
	styleUrls: ['../appointment-form/appointment-form.component.scss'],
	imports: [CommonModule, ReactiveFormsModule],
})
export class AppointmentFormComponent implements OnInit {
	currentMonth: Date = new Date();
	formattedMonth: string = '';
	weekdays: string[] = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
	hours: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
	weeksInMonth: any[] = [];
	selectedDay: any = null;
	selectedHour: string | null = null;
	showAppointmentForm: boolean = false;
	appointmentForm: FormGroup;
	appointments: { date: string;hour: string;doctor: string;details: any } [] = [];
	private monthNames: string[] = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
	specializations = ['Kardiolog', 'Neurolog', 'Ortopeda', 'Dermatolog'];
	doctors: {
		[key: string]: string[] } = {
		Kardiolog: ['Dr. Kowalski', 'Dr. Nowak', 'Dr. Wiśniewski', 'Dr. Dąbrowski'],
		Neurolog: ['Dr. Zieliński', 'Dr. Szymański', 'Dr. Woźniak', 'Dr. Kamiński'],
		Ortopeda: ['Dr. Lewandowski', 'Dr. Jankowski', 'Dr. Wójcik', 'Dr. Kaczmarek'],
		Dermatolog: ['Dr. Mazur', 'Dr. Krawczyk', 'Dr. Piotrowski', 'Dr. Grabowski'],
	};
	constructor(private fb: FormBuilder, private router: Router) {
		this.appointmentForm = this.fb.group({
			specialization: ['', Validators.required],
			doctor: ['', Validators.required],
			description: ['', [Validators.required, Validators.minLength(10)]],
			paymentMethod: ['', Validators.required],
			currency: [''],
			agreement: [false, Validators.requiredTrue],
			hour: [''],
		});
	}
	successMessage: string | null = null;
	ngOnInit() {
		this.updateFormattedMonth();
		this.loadAppointments();
		this.generateCalendar();
		this.appointmentForm
			.get('paymentMethod')
			?.valueChanges.subscribe((value) => {
				if (value !== 'gotowka') {
					this.appointmentForm.get('currency')
						?.setValue('');
				}
			});
		if (localStorage.getItem('appointmentSuccess') === 'true') {
			this.successMessage =
				'✅ Twoja rezerwacja się powiodła. Sprawdź szczegóły w zakładce "Moje wizyty" ✅';
			localStorage.removeItem('appointmentSuccess');
		}
	}
	validateForm(): void {
		Object.keys(this.appointmentForm.controls)
			.forEach((field) => {
				const control = this.appointmentForm.get(field);
				control?.markAsTouched({ onlySelf: true });
			});
	}
	updateFormattedMonth() {
		this.formattedMonth = `${
      this.monthNames[this.currentMonth.getMonth()]
    } ${this.currentMonth.getFullYear()}`;
	}
	getErrorMessage(field: string): string {
		const control = this.appointmentForm.get(field);
		if (control?.hasError('required')) {
			return 'To pole jest wymagane.';
		}
		if (field === 'description' && control?.hasError('minlength')) {
			return 'Opis musi zawierać co najmniej 10 znaków.';
		}
		return '';
	}
	generateCalendar() {
		let start = new Date(
			this.currentMonth.getFullYear(),
			this.currentMonth.getMonth(),
			1
		);
		let end = new Date(
			this.currentMonth.getFullYear(),
			this.currentMonth.getMonth() + 1,
			0
		);
		let today = new Date();
		today.setSeconds(0, 0);
		let days: any[] = [];
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			let formattedDate = formatDate(d, 'yyyy-MM-dd', 'pl');
			let isPast = d < today;
			let availableHours = this.hours.filter((hour) => {
				if (d.toDateString() === today.toDateString()) {
					let hourInt = parseInt(hour.split(':')[0]);
					return hourInt > today.getHours();
				}
				return true;
			});
			days.push({
				date: new Date(d),
				isPast: isPast,
				isAvailable: !isPast && availableHours.length > 0,
				isFullyBooked: availableHours.length === 0,
				appointments: availableHours,
			});
		}
		this.weeksInMonth = this.chunkIntoWeeks(days);
	}
	chunkIntoWeeks(days: any[]) {
		let weeks = [];
		let week = [];
		let firstDayIndex = days[0].date.getDay();
		firstDayIndex = (firstDayIndex + 6) % 7;
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
		this.selectedDay = day;
		this.selectedHour = null;
		this.showAppointmentForm = false;
	}
	selectHour(hour: string) {
		if (!this.hasAvailableDoctors(this.selectedDay.date, hour)) return;
		this.selectedHour = hour;
		this.appointmentForm.patchValue({ hour: hour });
		this.showAppointmentForm = true;
	}
	previousMonth() {
		const previous = new Date(this.currentMonth);
		previous.setMonth(previous.getMonth() - 1);
		const today = new Date();
		today.setDate(1);
		if (previous >= today) {
			this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
			this.updateFormattedMonth();
			this.generateCalendar();
		}
	}
	nextMonth() {
		this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
		this.updateFormattedMonth();
		this.generateCalendar();
	}
	getFormattedDateForSelection(): string {
		if (!this.selectedDay) return '';
		const day = this.selectedDay.date.getDate();
		const month = this.monthNames[this.selectedDay.date.getMonth()];
		const year = this.selectedDay.date.getFullYear();
		return `${day} ${month} ${year}`;
	}
	isHourInFuture(date: Date, hour: string): boolean {
		let today = new Date();
		today.setSeconds(0, 0);
		let hourInt = parseInt(hour.split(':')[0]);
		return (
			date > today ||
			(date.toDateString() === today.toDateString() &&
				hourInt > today.getHours())
		);
	}
	bookAppointment() {
		if (this.appointmentForm.invalid) {
			this.validateForm();
			return;
		}
		const formattedDate = formatDate(this.selectedDay.date, 'yyyy-MM-dd', 'pl');
		const confirmBooking = window.confirm(
			`Czy na pewno chcesz zapisać wizytę na ${formattedDate} o godzinie ${this.selectedHour}?`
		);
		if (!confirmBooking) {
			return;
		}
		const newAppointment = {
			date: formattedDate,
			hour: this.selectedHour,
			doctor: this.appointmentForm.value.doctor,
			details: this.appointmentForm.value,
		};
		let storedAppointments = localStorage.getItem('appointments');
		let appointments: any[] = storedAppointments ?
			JSON.parse(storedAppointments) :
			[];
		appointments.push(newAppointment);
		localStorage.setItem('appointments', JSON.stringify(appointments));
		this.loadAppointments();
		this.generateCalendar();
		localStorage.setItem('appointmentSuccess', 'true');
		setTimeout(() => {
			location.reload();
		}, 500);
	}
	hasAvailableDoctors(date: Date, hour: string): boolean {
		const formattedDate = formatDate(date, 'yyyy-MM-dd', 'pl');
		return this.specializations.some(
			(spec) => this.getAvailableDoctorsForHour(hour, spec)
			.length > 0
		);
	}
	getAvailableDoctorsForHour(
		hour: string | null,
		specialization: string | null
	): string[] {
		if (!hour || !this.selectedDay || !specialization) return [];
		const formattedDate = formatDate(this.selectedDay.date, 'yyyy-MM-dd', 'pl');
		const bookedAppointments = this.appointments.filter(
			(app) =>
			app.date === formattedDate &&
			app.hour === hour &&
			app.details.specialization === specialization
		);
		return this.doctors[specialization].filter(
			(doc) => !bookedAppointments.some((app) => app.doctor === doc)
		);
	}
	isHourFullyBooked(date: Date, hour: string): boolean {
		const formattedDate = formatDate(date, 'yyyy-MM-dd', 'pl');
		const bookedAppointments = this.appointments.filter(
			(app) => app.date === formattedDate && app.hour === hour
		);
		const totalDoctors = Object.values(this.doctors)
			.flat()
			.length;
		const bookedDoctors = bookedAppointments.length;
		return bookedDoctors >= totalDoctors;
	}
	isDayFullyBooked(date: Date): boolean {
		return this.hours.every((hour) => !this.hasAvailableDoctors(date, hour));
	}
	loadAppointments() {
		let storedAppointments = localStorage.getItem('appointments');
		try {
			this.appointments = storedAppointments ?
				JSON.parse(storedAppointments) :
				[];
			if (!Array.isArray(this.appointments)) {
				this.appointments = [];
			}
		}
		catch (error) {
			console.error('Błąd podczas ładowania wizyt:', error);
			this.appointments = [];
		}
	}
	getAvailableSpecializations(hour: string | null): string[] {
		if (!hour || !this.selectedDay) return [];
		return this.specializations.filter(
			(spec) => this.getAvailableDoctorsForHour(hour, spec)
			.length > 0
		);
	}
}