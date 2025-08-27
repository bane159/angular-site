import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TopUser } from '../interface/top-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';
  
  constructor(private http: HttpClient) { }

  public getTopUsers(): Observable<TopUser[]> {
    return this.http.get<TopUser[]>(`${this.apiUrl}/users/top`);
  }

  public getReputation(userId: string): Observable<{ reputation: string }> {
    const path = `${this.apiUrl}/users/${userId}/reputation`;
    return this.http.get<{ reputation: string }>(path);
  }
}
