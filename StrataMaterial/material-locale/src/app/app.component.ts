import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'material-locale';
  dateTime = new Date();
  wolves = 0;
  helloMsg = 'hello world';
}
