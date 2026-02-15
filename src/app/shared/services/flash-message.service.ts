import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface FlashMessage {
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {
  private messageSubject = new Subject<FlashMessage>();
  message$ = this.messageSubject.asObservable();

  show(message: string, type: FlashMessage['type'] = 'warning', duration = 3000): void {
    this.messageSubject.next({ message, type, duration });
  }

  showLoginRequired(action: string = 'perform this action'): void {
    this.show(`You need to be logged in to ${action}.`, 'warning');
  }
}
