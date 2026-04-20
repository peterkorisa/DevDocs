import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery: string = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Search for:', this.searchQuery);
      // Add search functionality here
    }
  }
}
