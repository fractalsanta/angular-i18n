import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kendo-datepicker',
  templateUrl: './kendo-datepicker.component.html',
  styleUrls: ['./kendo-datepicker.component.scss']
})
export class KendoDatepickerComponent implements OnInit {
  public value: Date = new Date(2000, 2, 10);
  constructor() {}

  ngOnInit() {}
}
