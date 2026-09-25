import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Trip {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/trips';

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTripById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addExpense(tripId: number, expense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${tripId}/expenses`, expense);
  }
}
