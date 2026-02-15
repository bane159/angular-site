import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../interfaces/tag';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  public getAllTags(): Observable<Tag[]> {
    // Convert the string array to Tag objects
    return this.http.get<string[]>(`${this.apiUrl}/tags`)
      .pipe(
        map(tags => tags.map(tag => ({ name: tag })))
      );
  }
}
