import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';
import { Auth } from './core';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <ng-container *ngIf="!isLogin; else loginPage">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">M</div>
          <div>
            <strong>MyTutor AI</strong>
            <span>QEA Knowledge Assistant</span>
          </div>
        </div>
        <div class="top-actions">
          <span class="user-name">{{ auth.user?.name || auth.user?.userId || 'Learner' }}</span>
          <button class="logout-btn" type="button" (click)="logout()">Sign out</button>
        </div>
      </header>

      <div class="app-layout">
        <aside class="sidebar">
          <div class="side-label">WORKSPACE</div>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
            <span>⌂</span> New Prompt
          </a>
          <a routerLink="/history" routerLinkActive="active"><span>◷</span> History</a>
          <a routerLink="/saved" routerLinkActive="active"><span>☆</span> Saved Content</a>
          <div class="side-label library-label">LEARNING</div>
          <a routerLink="/topics" routerLinkActive="active"><span>▦</span> Topics & Library</a>
          <div class="side-note">
            <strong>Trainer knowledge is the source of truth.</strong>
            <p>MyTutor retrieves relevant QEA material first, then AI refines it for your request.</p>
          </div>
        </aside>
        <main class="main-content"><router-outlet></router-outlet></main>
      </div>
    </ng-container>

    <ng-template #loginPage><router-outlet></router-outlet></ng-template>
  `
})
export class AppComponent implements OnInit {
  isLogin = false;

  constructor(public auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.updateLoginState();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.updateLoginState());
  }

  private updateLoginState(): void {
    this.isLogin = this.router.url === '/login' || this.router.url === '/register';
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => {
        this.auth.clear();
        this.router.navigateByUrl('/login');
      }
    });
  }
}
