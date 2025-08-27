import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [SharedModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      // Navigate to home page with search query as a query parameter
      this.router.navigate(['/'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }
}
