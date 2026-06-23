import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth';
import { NavbarComponent } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly publicPaths = new Set(['/', '/login', '/register']);
  private readonly currentPath = signal(this.router.url.split('?')[0]);

  protected readonly showNavbar = computed(() => {
    const path = this.currentPath();

    return this.authService.isLoggedIn() && !this.publicPaths.has(path);
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentPath.set(event.urlAfterRedirects.split('?')[0]));
  }
}
