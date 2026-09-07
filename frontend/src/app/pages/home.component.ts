import {ChangeDetectorRef,Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Chat, GenerateRequest, GenerateResponse, LocalStore, HistoryItem } from '../core';

@Component({
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <div class="page-head">
      <div>
        <div class="eyebrow">LEARNING WORKSPACE</div>
        <h1>What do you want to learn?</h1>
        <p class="muted">Ask naturally. MyTutor finds relevant trainer knowledge and adapts it to your intent.</p>
      </div>
    </div>

    <section class="hero-prompt card">
      <textarea
        [(ngModel)]="prompt"
        rows="5"
        placeholder="Example: Explain explicit wait in Selenium in simple terms with an example."
        (keydown.control.enter)="generate()"></textarea>

      <div class="prompt-footer">
        <div class="prompt-hint">Ctrl + Enter to generate</div>
        <button class="primary generate-btn" (click)="generate()" [disabled]="loading || !prompt.trim()">
          {{ loading ? 'Generating…' : 'Generate answer  →' }}
        </button>
      </div>
    </section>

    <div class="section-row">
      <div>
        <h2>Try a prompt</h2>
        <p class="muted small">Start with one of these common QEA learning requests.</p>
      </div>
    </div>

    <div class="suggestions">
      <button *ngFor="let suggestion of suggestions" class="suggestion" (click)="useSuggestion(suggestion)">
        <span>{{ suggestion.icon }}</span>
        <div><strong>{{ suggestion.title }}</strong><small>{{ suggestion.text }}</small></div>
      </button>
    </div>

    <section class="response-card card" *ngIf="result || loading">
      <div class="response-top">
        <div>
          <div class="eyebrow">GENERATED LEARNING CONTENT</div>
          <h2>{{ result?.topic || 'Preparing your answer…' }}</h2>
        </div>
        <span class="status-pill" *ngIf="result">{{ result.aiUsed ? 'AI refined' : 'Rule-based fallback' }}</span>
      </div>

      <div class="loading-box" *ngIf="loading">
        <span class="spinner"></span>
        <div><strong>Working on your request</strong><p>Retrieving trainer knowledge and preparing the response…</p></div>
      </div>

      <ng-container *ngIf="result && !loading">
        <div class="intent-row">
          <span *ngIf="result.intent">Intent: {{ result.intent }}</span>
          <span *ngIf="result.provider">Provider: {{ result.provider }}</span>
        </div>
        <div class="answer">{{ result.response }}</div>

        <div class="source-box">
          <div><strong>Knowledge source</strong><span>{{ result.source || 'Trainer QEA repository' }}</span></div>
          <button class="secondary" (click)="copyAnswer()">Copy answer</button>
          <button class="secondary" (click)="saveAnswer()">{{ saved ? 'Saved ✓' : 'Save' }}</button>
        </div>
      </ng-container>

      <div class="error" *ngIf="error">{{ error }}</div>
    </section>
  `
})
export class HomeComponent {
  prompt = sessionStorage.getItem('prompt') || '';
  loading = false;
  error = '';
  result: GenerateResponse | null = null;
  saved = false;

  suggestions = [
    { icon: '◈', title: 'Explain a concept', text: 'Simple definition + example', prompt: 'Explain explicit wait in Selenium in simple terms with an example.' },
    { icon: '▤', title: 'Prepare for interview', text: 'Questions + concise answers', prompt: 'Give me important Selenium interview questions with answers.' },
    { icon: '⌁', title: 'Understand a use case', text: 'When and why to use it', prompt: 'Explain a practical use case of API testing in a real project.' },
    { icon: '{}', title: 'Learn through code', text: 'Concept + starter example', prompt: 'Explain Page Object Model in Selenium with a Java example.' }
  ];

  constructor(private chat: Chat,
              private store: LocalStore,
              private  cdr:ChangeDetectorRef) {}

  useSuggestion(item: any): void {
    this.prompt = item.prompt;
    this.generate();
  }

  generate(): void {
    this.error = '';
    this.result = null;
    this.saved = false;
    if (!this.prompt.trim()) return;

    this.loading = true;
    sessionStorage.removeItem('prompt');
    const request: GenerateRequest = {
      prompt: this.prompt.trim(),
      outputIntent: this.inferIntent(this.prompt),
      learningLevel: 'Intermediate',
      technology: this.inferTechnology(this.prompt),
      framework: this.inferFramework(this.prompt),
      audience: 'Automation Engineers',
      depth: 'Detailed'
    };

    this.chat.generate(request).subscribe({
      next: response => {
        console.log('MYTUTOR RESPONSE RECIEVE:',response);
        this.result = response;
        this.loading = false;
        const item: HistoryItem = {
          id: crypto.randomUUID(),
          prompt: this.prompt.trim(),
          response: response.response || '',
          topic: response.topic || 'Learning response',
          source: response.source || 'Trainer QEA repository',
          aiUsed: !!response.aiUsed,
          createdAt: new Date().toISOString()
        };
        this.store.addHistory(item);
        this.saved = this.store.isSaved(item.id);

        this.cdr.detectChanges();
      },
      error: e => {
        this.loading = false;
        this.error = e?.error?.message || 'Unable to generate content. Check that the backend is running and your session is valid.';
      }
    });
  }

  copyAnswer(): void {
    if (this.result?.response) {
      navigator.clipboard.writeText(this.result.response);
    }
  }

  saveAnswer(): void {
    if (!this.result?.response) return;
    const history = this.store.getHistory().find(x => x.prompt === this.prompt.trim());
    if (history) this.saved = this.store.toggleSaved(history);
  }

  private inferIntent(prompt: string): string {
    const p = prompt.toLowerCase();
    if (/(interview|questions|q&a|question)/.test(p)) return 'Interview Preparation';
    if (/(summary|summarize|short|brief|one line)/.test(p)) return 'Summary';
    if (/(use case|when to use|real project|practical)/.test(p)) return 'Use Case';
    return 'Explanation';
  }

  private inferTechnology(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes('selenium')) return 'Selenium';
    if (p.includes('playwright')) return 'Playwright';
    if (p.includes('spring')) return 'Spring Boot';
    if (p.includes('angular')) return 'Angular';
    if (p.includes('api')) return 'API Testing';
    return 'QEA';
  }

  private inferFramework(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes('playwright')) return 'Playwright';
    if (p.includes('selenium')) return 'Selenium';
    if (p.includes('spring')) return 'Spring';
    return 'General';
  }
}
