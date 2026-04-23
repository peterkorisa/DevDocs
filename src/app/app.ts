import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { TOC } from './toc/toc';
import { ThemeService } from './services/theme.service';


@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, HttpClientModule, TOC, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'DevDocs';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service initializes automatically
  }
}
