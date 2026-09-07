import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { HomeComponent } from './pages/home.component';
import { WorkspaceComponent } from './pages/workspace.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { HistoryComponent } from './pages/history.component';
import { TopicsComponent } from './pages/topics.component';
import { SavedComponent } from './pages/saved.component';
import { Auth } from './core';

const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.checkSession().pipe(
    map(ok => ok ? true : router.createUrlTree(['/login']))
  );
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'workspace', component: WorkspaceComponent, canActivate: [authGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: 'topics', component: TopicsComponent, canActivate: [authGuard] },
  { path: 'saved', component: SavedComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
