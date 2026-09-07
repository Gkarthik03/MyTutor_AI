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
          <h1>Create your<br><span>learning account.</span></h1>
          <p>Register once to access the MyTutor QEA knowledge workspace and learn from your trainer-approved repository.</p>
        </div>

        <div class="login-card register-card">
          <h2>Create account</h2>
          <p class="muted">Enter your details to get started.</p>

          <div class="register-grid">
            <div>
              <label>User ID</label>
              <input [(ngModel)]="form.userId" autocomplete="username" placeholder="Enter user ID">
            </div>
            <div>
              <label>Employee ID</label>
              <input [(ngModel)]="form.employeeId" placeholder="Enter employee ID">
            </div>
          </div>

          <label>Full Name</label>
          <input [(ngModel)]="form.name" autocomplete="name" placeholder="Enter your name">

          <label>Email</label>
          <input type="email" [(ngModel)]="form.email" autocomplete="email" placeholder="Enter your email">

          <div class="register-grid">
            <div>
              <label>Password</label>
              <input type="password" [(ngModel)]="form.password" autocomplete="new-password" placeholder="Minimum 6 characters">
            </div>
            <div>
              <label>Confirm Password</label>
              <input type="password" [(ngModel)]="confirmPassword" autocomplete="new-password" placeholder="Re-enter password">
            </div>
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>
          <div class="success" *ngIf="success">{{ success }}</div>

          <button class="primary wide" (click)="register()" [disabled]="loading">
            {{ loading ? 'Creating account…' : 'Create MyTutor account' }}
          </button>

          <p class="auth-switch">
            Already have an account?
            <a routerLink="/login">Sign in</a>
          </p>
        </div>

        <small class="login-footer">Internal QEA learning workspace</small>
      </div>

      <div class="login-visual">
        <div class="visual-grid"></div>
        <div class="visual-card">
          <span class="visual-icon">✦</span>
          <strong>Knowledge → Intent → Answer</strong>
          <p>Your account gives you access to the QEA learning workspace and its approved knowledge flow.</p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = {
    userId: '',
    employeeId: '',
    name: '',
    email: '',
    password: ''
  };
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  register(): void {
    this.error = '';
    this.success = '';

    if (!this.form.userId.trim() || !this.form.employeeId.trim() || !this.form.name.trim() ||
        !this.form.email.trim() || !this.form.password || !this.confirmPassword) {
      this.error = 'Please complete all fields.';
      return;
    }

    if (!this.form.email.includes('@')) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    if (this.form.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    if (this.form.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.auth.register({
      userId: this.form.userId.trim(),
      employeeId: this.form.employeeId.trim(),
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      password: this.form.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = response?.message || 'Account created successfully.';
        setTimeout(() => this.router.navigateByUrl('/login'), 700);
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Unable to create account. Please try again.';
      }
    });
  }
}
