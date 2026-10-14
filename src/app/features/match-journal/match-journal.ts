import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Trip } from '../../core/services/trip';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-match-journal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './match-journal.html',
})
export class MatchJournal implements OnInit {
  private route = inject(ActivatedRoute);
  private tripService = inject(Trip);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  tripId = signal<number | null>(null);
  entries = signal<any[]>([]);
  matches = signal<any[]>([]);

  journalForm = this.fb.group({
    matchId: ['', Validators.required],
    seat: [''],
    ticketPrice: [0],
    rating: [5, [Validators.min(1), Validators.max(10)]],
    favouriteMoment: [''],
    notes: ['', Validators.required],
    photoUrl: [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tripId.set(+id);
      this.loadJournalEntries(+id);
    }

    this.http.get<any[]>('http://localhost:8080/api/matches').subscribe({
      next: (data) => this.matches.set(data),
      error: (err) => console.error('Failed to load matches', err)
    });
  }

  loadJournalEntries(tripId: number) {
    this.tripService.getTripById(tripId).subscribe({
      next: (data) => this.entries.set(data.journalEntries || []),
      error: (err) => console.error('Failed to load journal entries', err)
    });
  }
  
  onSubmit() {
    if (this.journalForm.valid && this.tripId()) {
      const payload = { ...this.journalForm.value, tripId: this.tripId() };
      this.http.post(`http://localhost:8080/api/journal`, payload).subscribe({
        next: (savedEntry: any) => {
          this.entries.update(curr => [savedEntry, ...curr]);
          this.journalForm.reset();
        },
        error: (err: any) => console.error('Failed to save journal entry', err)
      });
    }
  }
}
