import { Component } from '@angular/core';

import { SharedModule } from '../../shared/shared-module';
import { AuthService } from '../../users/services/auth';

@Component({
  selector: 'app-footer',
  imports: [SharedModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  constructor(private authService: AuthService) {}




  logout(): void {
    this.authService.logout();
  }

  
}
