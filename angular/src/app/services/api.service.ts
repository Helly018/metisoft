import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface RecordItem {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://jsonplaceholder.typicode.com/users';

  getRecords(): Observable<RecordItem[]> {
    return this.http.get<RecordItem[]>(this.baseUrl);
  }

  addRecord(record: Omit<RecordItem, 'id'>): Observable<RecordItem> {
    return this.http.post<RecordItem>(this.baseUrl, record);
  }

  updateRecord(id: number, record: Partial<RecordItem>): Observable<RecordItem> {
    if (id > 10) {
      return of({ id, ...record } as RecordItem);
    }
    return this.http.put<RecordItem>(`${this.baseUrl}/${id}`, record);
  }

  deleteRecord(id: number): Observable<void> {
    if (id > 10) {
      return of(undefined);
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
