import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Trip } from '../../core/services/trip';
import { Auth } from '../../core/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private trip = inject(Trip);
  auth = inject(Auth);

  trips = signal<any[]>([]);

  ngOnInit() {
    this.trip.getTrips().subscribe({
      next: (data) => {
        this.trips.set(data);
      },
      error: (err) => console.error('Error fetching trips:', err)
    });
  }
}
