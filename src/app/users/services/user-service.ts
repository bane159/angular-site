import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TopUser } from '../interface/top-user';
import { User } from '../interface/user';
import { environment } from '../../../environments/environment';

interface UserUpdateResponse {
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  public getTopUsers(): Observable<TopUser[]> {
    return this.http.get<TopUser[]>(`${this.apiUrl}/users/top`);
  }

  public getReputation(userId: string): Observable<{ reputation: string }> {
    const path = `${this.apiUrl}/users/${userId}/reputation`;
    return this.http.get<{ reputation: string }>(path);
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const path = `${this.apiUrl}/user/change-password`;
    return this.http.put(path, {
      old_password: oldPassword,
      new_password: newPassword
    });
  }

  public updatePersonalInfo(firstName: string, lastName: string): Observable<UserUpdateResponse> {
    const path = `${this.apiUrl}/user/personal-info`;
    return this.http.put<UserUpdateResponse>(path, {
      name: firstName,
      lastname: lastName
    });
  }

  public updateAccountInfo(username: string, email: string): Observable<UserUpdateResponse> {
    const path = `${this.apiUrl}/user/account-info`;
    return this.http.put<UserUpdateResponse>(path, {
      username: username,
      email: email
    });
  }
}
