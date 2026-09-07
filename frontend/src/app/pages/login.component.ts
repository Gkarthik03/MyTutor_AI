import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Auth } from '../core';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-panel">
        <div class="login-brand">
          <div class="brand-mark large">M</div>
          <div><strong>MyTutor AI</strong><span>QEA Knowledge Assistant</span></div>
        </div>

        <div class="login-copy">
          <div class="eyebrow">QUALITY ENGINEERING & ASSURANCE</div>
          <h1>Learn from your<br><span>trainer's knowledge.</span></h1>
          <p>Ask questions in natural language and turn the approved QEA repository into explanations, examples and interview-ready material.</p>
        </div>

        <div class="login-card">
          <h2>Welcome back</h2>
          <p class="muted">Sign in to continue to your learning workspace.</p>

          <label>User ID</label>
          <input [(ngModel)]="id" autocomplete="username" placeholder="Enter your user ID" (keyup.enter)="login()">

          <label>Password</label>
          <input type="password" [(ngModel)]="password" autocomplete="current-password" placeholder="Enter your password" (keyup.enter)="login()">

          <div class="error" *ngIf="error">{{ error }}</div>
          <button class="primary wide" (click)="login()" [disabled]="loading">
            {{ loading ? 'Signing in…' : 'Sign in to MyTutor' }}
          </button>

          <p class="auth-switch">
            New to MyTutor?
            <a routerLink="/register">Create an account</a>
          </p>
        </div>

        <small class="login-footer">Internal QEA learning workspace</small>
      </div>
      <div class="login-visual">
        <div class="visual-grid"></div>
        <div class="visual-card">
          <span class="visual-icon">✦</span>
          <strong>Knowledge → Intent → Answer</strong>
          <p>Relevant trainer material is retrieved before the response is generated.</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  id = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  login(): void {
    this.error = '';
    if (!this.id.trim() || !this.password) {
      this.error = 'Please enter both User ID and password.';
      return;
    }
    this.loading = true;
    this.auth.login(this.id.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Invalid user ID or password.';
      }
    });
  }
}
