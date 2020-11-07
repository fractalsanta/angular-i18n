import { Component } from '@angular/core';
/**
 * Generated class for the ManagementTypeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'management-type',
  templateUrl: 'management-type.html'
})
export class ManagementTypeComponent {
  text: string;
  managementType: string;

  constructor() {
    console.log('Hello ManagementTypeComponent Component');
    this.text = 'Hello World';
  }
}
