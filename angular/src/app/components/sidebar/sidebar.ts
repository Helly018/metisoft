import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  private router = inject(Router);

  @Input() activeTab: 'overview' | 'users' = 'overview';
  @Output() logout = new EventEmitter<void>();

  selectTab(tab: 'overview' | 'users'): void {
    if (tab === 'overview') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/users']);
    }
  }

  triggerLogout(): void {
    this.logout.emit();
  }
}
