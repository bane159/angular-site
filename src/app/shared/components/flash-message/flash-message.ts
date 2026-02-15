import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlashMessageService, FlashMessage } from '../../services/flash-message.service';

@Component({
  selector: 'app-flash-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flash-message.html',
  styleUrls: ['./flash-message.scss']
})
export class FlashMessageComponent implements OnInit, OnDestroy {
  currentMessage: FlashMessage | null = null;
  visible = false;
  private subscription!: Subscription;
  private hideTimeout: any;

  constructor(private flashMessageService: FlashMessageService) {}

  ngOnInit(): void {
    this.subscription = this.flashMessageService.message$.subscribe(message => {
      this.showMessage(message);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  private showMessage(message: FlashMessage): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.currentMessage = message;
    this.visible = true;

    this.hideTimeout = setTimeout(() => {
      this.dismiss();
    }, message.duration || 3000);
  }

  dismiss(): void {
    this.visible = false;
    setTimeout(() => {
      this.currentMessage = null;
    }, 300);
  }
}
