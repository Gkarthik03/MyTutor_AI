import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  template: ''
})
export class WorkspaceComponent {
  constructor(router: Router) {
    router.navigateByUrl('/');
  }
}
