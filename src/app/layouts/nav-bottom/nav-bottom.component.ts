import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bottom',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './nav-bottom.component.html',
  styleUrl: './nav-bottom.component.scss',
})
export class NavBottomComponent {}
