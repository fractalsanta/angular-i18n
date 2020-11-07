import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kendo-dialog',
  templateUrl: './kendo-dialog.component.html',
  styleUrls: ['./kendo-dialog.component.scss']
})
export class KendoDialogComponent {
  public dialogOpened = false;
  public windowOpened = false;

  public close(component) {
    this[component + 'Opened'] = false;
  }

  public open(component) {
    this[component + 'Opened'] = true;
  }

  public action(status) {
    console.log(`Dialog result: ${status}`);
    this.dialogOpened = false;
  }
}
