import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="page-head">
      <div><div class="eyebrow">TRAINER KNOWLEDGE</div><h1>Topics & learning library</h1><p class="muted">Explore the QEA areas supported by the knowledge repository.</p></div>
    </div>
    <div class="library-banner card">
      <div class="banner-icon">▦</div>
      <div><strong>Trainer repository = source of truth</strong><p>Responses are grounded in the repository before the AI layer restructures them for your requested intent.</p></div>
    </div>
    <div class="topic-grid">
      <article class="topic-card card" *ngFor="let topic of topics">
        <div class="topic-icon">{{ topic.icon }}</div>
        <div><span class="topic-tag">{{ topic.category }}</span><h2>{{ topic.name }}</h2><p>{{ topic.description }}</p></div>
        <div class="topic-bottom"><span>{{ topic.examples }} learning areas</span></div>
      </article>
    </div>
  `
})
export class TopicsComponent {
  topics = [
    { icon: '⌁', category: 'Automation', name: 'Selenium', description: 'Web automation concepts, waits, locators, Page Object Model and practical Java examples.', examples: 8 },
    { icon: '◈', category: 'Automation', name: 'Playwright', description: 'Modern browser automation, selectors, assertions, fixtures and end-to-end testing.', examples: 7 },
    { icon: '⇄', category: 'API Testing', name: 'API Testing', description: 'HTTP fundamentals, REST APIs, request/response validation and automation concepts.', examples: 9 },
    { icon: '☕', category: 'Development', name: 'Java', description: 'Core Java concepts required for automation and software development.', examples: 12 },
    { icon: '◇', category: 'Backend', name: 'Spring Boot', description: 'Spring fundamentals, dependency injection, REST services and backend testing.', examples: 8 },
    { icon: '▤', category: 'Frontend', name: 'Angular', description: 'Components, services, routing, forms and frontend testing concepts.', examples: 7 },
    { icon: '▥', category: 'Database', name: 'SQL', description: 'Queries, joins, aggregation and database validation for QA workflows.', examples: 10 },
    { icon: '✓', category: 'Methodology', name: 'Agile & Testing', description: 'Agile practices, test strategy, test cases, defects and quality engineering.', examples: 9 }
  ];
}
