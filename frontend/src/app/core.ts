import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';

export interface GenerateRequest {
  prompt: string;
  outputIntent: string;
  learningLevel: string;
  technology: string;
  framework: string;
  audience: string;
  depth: string;
}

export interface GenerateResponse {
  topic?: string;
  response?: string;
  source?: string;
  aiUsed?: boolean;
  provider?: string;
  intent?: string;
  knowledgeId?: number;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class Api {
  readonly base = 'https://brilliant-balance-production.up.railway.app/';
  constructor(public http: HttpClient) {}
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly storageKey = 'mytutor_user';
  user: any = this.readUser();

  constructor(private api: Api) {}

  login(userId: string, password: string) {
    return this.api.http
      .post<any>(`${this.api.base}/auth/login`, { userId, password }, { withCredentials: true })
      .pipe(tap(user => {
        this.user = user;
        sessionStorage.setItem(this.storageKey, JSON.stringify(user));
      }));
  }

  checkSession() {
    return this.api.http
      .get<any>(`${this.api.base}/auth/me`, { withCredentials: true })
      .pipe(
        tap(user => {
          this.user = user;
          sessionStorage.setItem(this.storageKey, JSON.stringify(user));
        }),
        map(() => true),
        catchError(() => {
          this.clear();
          return of(false);
        })
      );
  }

  register(data: { userId: string; employeeId: string; name: string; email: string; password: string }) {
    return this.api.http.post<any>(`${this.api.base}/auth/register`, data);
  }

  logout() {
    return this.api.http.post(`${this.api.base}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.clear()));
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  clear(): void {
    this.user = null;
    sessionStorage.removeItem(this.storageKey);
  }

  private readUser(): any {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class Chat {
  constructor(private api: Api) {}

  generate(request: GenerateRequest) {
    return this.api.http.post<GenerateResponse>(
      `${this.api.base}/chat/generate`,
      request,
      { withCredentials: true }
    );
  }
}

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  topic: string;
  source: string;
  aiUsed: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class LocalStore {
  private readonly historyKey = 'mytutor_history';
  private readonly savedKey = 'mytutor_saved';

  getHistory(): HistoryItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.historyKey) || '[]');
    } catch {
      return [];
    }
  }

  addHistory(item: HistoryItem): void {
    const items = [item, ...this.getHistory()].slice(0, 100);
    localStorage.setItem(this.historyKey, JSON.stringify(items));
  }

  clearHistory(): void {
    localStorage.removeItem(this.historyKey);
  }

  getSaved(): HistoryItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.savedKey) || '[]');
    } catch {
      return [];
    }
  }

  toggleSaved(item: HistoryItem): boolean {
    const items = this.getSaved();
    const index = items.findIndex(x => x.id === item.id);
    if (index >= 0) {
      items.splice(index, 1);
      localStorage.setItem(this.savedKey, JSON.stringify(items));
      return false;
    }
    localStorage.setItem(this.savedKey, JSON.stringify([item, ...items]));
    return true;
  }

  isSaved(id: string): boolean {
    return this.getSaved().some(x => x.id === id);
  }
}
