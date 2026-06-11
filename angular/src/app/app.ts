import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar';
import { HeaderComponent } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, SidebarComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  protected readonly showLayout = signal(false);
  protected readonly activeTab = signal<'overview' | 'users'>('overview');
  protected readonly headerTitle = signal('Dashboard Overview');

  ngOnInit() {
    this.updateLayoutState(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateLayoutState(event.urlAfterRedirects || event.url);
    });
  }

  private updateLayoutState(url: string) {
    if (url.includes('/login')) {
      this.showLayout.set(false);
    } else {
      this.showLayout.set(this.authService.isAuthenticated());
      if (url.includes('/users')) {
        this.activeTab.set('users');
        this.headerTitle.set('User Management');
      } else {
        this.activeTab.set('overview');
        this.headerTitle.set('Dashboard Overview');
      }
    }
  }

  protected logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
