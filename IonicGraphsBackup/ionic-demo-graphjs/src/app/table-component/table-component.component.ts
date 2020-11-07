import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFlatProvinces } from '../my-app.component';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html'
})
export class TableComponentComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      perPage: 50
    },
    columns: {
      province: {
        title: 'Province',
        width: '50%',
        editable: false,
        addable: false
      },
      capital: {
        title: 'Capital',
        editable: false,
        addable: false
      },
      fsc: {
        title: 'FSC',
        editable: false,
        addable: false
      },
      waterInStorage: {
        title: 'Water in storage',
        editable: false,
        addable: false
      },
      full: {
        title: '% Full',
        editable: false,
        addable: false
      }
    }
  };

  @Input()
  flatProvinces: IFlatProvinces[];

  @Output()
  userRowSelect = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
