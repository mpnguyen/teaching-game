import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>
            <div id="snackbar-success" class="isa_success">Success!</div>
            <div id="snackbar-error" class="isa_error">Error!</div>
            <div id="snackbar-info" class="isa_info">Info!</div>`
})
export class AppComponent {}
