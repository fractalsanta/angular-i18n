import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from './../../../store/index';
import { ICurrentMonth } from './../../models/current-month';
@Component({
  selector: 'gauges',
  templateUrl: 'gauges.html'
})
export class GaugesComponent implements OnInit {
  @Input()
  monthData: ICurrentMonth;

  constructor(private store: Store<fromStore.IAppState>) {}

  ngOnInit() {}
}
