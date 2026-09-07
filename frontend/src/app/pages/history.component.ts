import { Component } from '@angular/core';
import { NgFor, NgIf, DatePipe, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HistoryItem, LocalStore } from '../core';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, SlicePipe],
  template: `
    <div class="page-head">
      <div><div class="eyebrow">YOUR ACTIVITY</div><h1>Conversation history</h1><p class="muted">Previously generated learning responses on this browser.</p></div>
      <button class="secondary" (click)="clear()" *ngIf="items.length">Clear history</button>
    </div>

    <div class="empty card" *ngIf="!items.length">
      <div class="empty-icon">◷</div>
      <h2>No conversations yet</h2>
      <p class="muted">Your generated answers will appear here after you use the learning workspace.</p>
      <button class="primary" (click)="router.navigateByUrl('/')">Create a prompt</button>
    </div>

    <div class="history-list" *ngIf="items.length">
      <article class="history-card card" *ngFor="let item of items">
        <div class="history-meta"><span>{{ item.topic }}</span><small>{{ item.createdAt | date:'medium' }}</small></div>
        <h3>{{ item.prompt }}</h3>
        <p>{{ item.response | slice:0:260 }}{{ item.response.length > 260 ? '…' : '' }}</p>
        <div class="history-actions"><span class="source-mini">Source: {{ item.source }}</span><button class="secondary" (click)="open(item)">Use again</button></div>
      </article>
    </div>
  `
})
export class HistoryComponent {
  items: HistoryItem[] = [];
  constructor(public router: Router, private store: LocalStore) {
    this.items = this.store.getHistory();
  }

  clear(): void {
    this.store.clearHistory();
    this.items = [];
  }

  open(item: HistoryItem): void {
    sessionStorage.setItem('prompt', item.prompt);
    this.router.navigateByUrl('/');
  }
}
