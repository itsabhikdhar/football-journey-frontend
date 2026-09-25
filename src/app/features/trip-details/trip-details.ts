import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Trip } from '../../core/services/trip';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './trip-details.html',
})
export class TripDetails {
  private route = inject(ActivatedRoute);
  private tripService = inject(Trip);
  private fb = inject(FormBuilder);

  trip = signal<any>(null);
  expenses = signal<any[]>([]);
  showToast = signal<boolean>(false);

  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]],
    expenseDate: ['', Validators.required],
    category: ['Match Tickets', Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTripDetails(+id);
    }
  }

  loadTripDetails(id: number) {
    this.tripService.getTripById(id).subscribe({
      next: (data) => {
        this.trip.set(data);
        this.expenses.set(data.expenses || []);
      },
      error: (err) => console.error('Error fetching trip details:', err)
    });
  }

  onSubmitExpense() {
    if (this.expenseForm.valid && this.trip()) {
      const expenseData = this.expenseForm.value;

      this.tripService.addExpense(this.trip().id, expenseData).subscribe({
        next: (savedExpense) => {
          this.expenses.update((expenses: any) => [...expenses, savedExpense]);
          this.expenseForm.reset();

          this.showToast.set(true);
          setTimeout(() => this.showToast.set(false), 3000);
        },
        error: (err) => console.error('Error adding expense:', err)
      });
    }
  }

  getTotalExpenses() {
    return this.expenses().reduce((total: any, expense: { amount: any; }) => total + expense.amount, 0);
  }
}