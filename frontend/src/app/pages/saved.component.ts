import { Component } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HistoryItem, LocalStore } from '../core';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  template: `
    <div class="page-head">
      <div><div class="eyebrow">YOUR NOTES</div><h1>Saved content</h1><p class="muted">Keep useful generated answers for quick revision.</p></div>
    </div>

    <div class="empty card" *ngIf="!items.length">
      <div class="empty-icon">☆</div><h2>No saved content</h2>
      <p class="muted">Use Save on any generated answer to keep it here.</p>
      <button class="primary" (click)="router.navigateByUrl('/')">Start learning</button>
    </div>

    <div class="saved-list" *ngIf="items.length">
      <article class="saved-card card" *ngFor="let item of items">
        <div class="history-meta"><span>{{ item.topic }}</span><small>{{ item.createdAt | date:'mediumDate' }}</small></div>
        <h3>{{ item.prompt }}</h3>
        <div class="answer saved-answer">{{ item.response }}</div>
        <div class="history-actions"><span class="source-mini">Source: {{ item.source }}</span><button class="secondary" (click)="remove(item)">Remove</button></div>
      </article>
    </div>
  `
})
export class SavedComponent {
  items: HistoryItem[] = [];
  constructor(public router: Router, private store: LocalStore) {
    this.items = this.store.getSaved();
  }
  remove(item: HistoryItem): void {
    this.store.toggleSaved(item);
    this.items = this.store.getSaved();
  }
}
