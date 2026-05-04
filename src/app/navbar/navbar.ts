import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme } from '../services/theme.service';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  @Input() currentTheme: Theme = 'light';
  @Output() searchChange = new EventEmitter<string>();
  @Output() themeToggle = new EventEmitter<void>();

  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      this.searchChange.emit(query);
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  toggleTheme(): void {
    this.themeToggle.emit();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
