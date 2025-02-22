import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private adminService: AdminService) {}

  logout() {
    this.adminService.logout();
  }
}
