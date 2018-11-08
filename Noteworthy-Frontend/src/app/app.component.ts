import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  template: `

    <div class="header">
      <img class="header" src="assets/images/Noteworthy_Logo.png" alt="picture">
    </div>

    <div class="card form">
      <div class="card-content">
      <div class="input-field">
        <input id="username" type="text" class="validate">
        <label for="username">Email</label>
      </div>
      <div class="input-field">
        <input id="password" type="password" class="validate">
        <label for="password">Password</label>
      </div>
      </div>
    </div>

    `
})
export class AppComponent {
  title = 'Noteworthy-Frontend';
}
