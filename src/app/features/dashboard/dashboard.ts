import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Trip } from '../../core/services/trip';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private trip = inject(Trip);
  auth = inject(Auth);

  trips: any[] = [];

  ngOnInit() {
    this.trip.getTrips().subscribe({
      next: (data) => {
        console.log('Raw trip data:', data);
        this.trips = data;
      },
      error: (err) => console.error('Error fetching trips:', err)
    });
  }
}
