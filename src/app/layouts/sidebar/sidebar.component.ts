import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService } from '../../services/admin.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatSlideToggleModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private adminService = inject(AdminService);
  screenWidth = signal<number>(window.innerWidth);
  isSidebarClosed = signal<boolean>(this.screenWidth() <= 768);
  userManuallyClosedSidebar = false;

  onResize = () => {
    const newWidth = window.innerWidth;
    this.screenWidth.set(newWidth);

    if (this.userManuallyClosedSidebar) return;

    this.isSidebarClosed.set(newWidth <= 768);
  };

  toggleSidebar() {
    this.isSidebarClosed.update((prev) => !prev);
    this.userManuallyClosedSidebar = this.isSidebarClosed();
  }

  logout() {
    this.adminService.logout();
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }
}
