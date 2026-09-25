import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Trip } from '../../core/services/trip';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import id from '@angular/common/locales/id';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './trip-details.html',
})
export class TripDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private tripService = inject(Trip);
  private fb = inject(FormBuilder);

  trip = signal<any>(null);
  expenses = signal<any[]>([]);
  showToast = signal<boolean>(false);

  chartData = computed<ChartData<'doughnut'>>(() => {
    const currentExpenses = this.expenses();

    const grouped = currentExpenses.reduce((acc: any, curr: any) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(grouped),
      datasets: [{
        data: Object.values(grouped),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'],
      }]
    };
  });

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

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