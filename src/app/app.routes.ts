import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { authRedirectGuard } from './guards/authRedirect.guard';
import { SubscribersComponent } from './pages/subscribers/subscribers.component';
import { CitiesComponent } from './pages/cities/cities.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CallsComponent } from './pages/calls/calls.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'subscribers', component: SubscribersComponent },
      { path: 'cities', component: CitiesComponent },
      { path: 'calls', component: CallsComponent },
      { path: '', redirectTo: 'subscribers', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authRedirectGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [authGuard],
  },
];
