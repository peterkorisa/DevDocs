import { Component, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { Main } from './main/main';


@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, HttpClientModule, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DevDocs');
}
