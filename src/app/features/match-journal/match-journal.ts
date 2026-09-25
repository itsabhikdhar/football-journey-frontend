import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Trip } from '../../core/services/trip';

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

  tripId = signal<number | null>(null);
  entries = signal<any[]>([]);

  journalForm = this.fb.group({
    title: ['', Validators.required],
    matchDate: ['', Validators.required],
    stadium: ['', Validators.required],
    notes: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tripId.set(+id);
      this.loadJournalEntries(+id);
    }
  }

  loadJournalEntries(tripId: number) {
    this.tripService.getTripById(tripId).subscribe({
      next: (data) => this.entries.set(data.journalEntries || []),
      error: (err) => console.error('Failed to load journal entries', err)
    });
  }
  
  onSubmit() {
    if (this.journalForm.valid && this.tripId()) {
      const newEntry = { ...this.journalForm.value, id: Date.now() }; // Simple ID generation for demonstration
      this.entries.update(curr => [newEntry, ...curr]);
      this.journalForm.reset();
      // Here you would typically call a service to save the new entry to the backend
    }
  }
}
