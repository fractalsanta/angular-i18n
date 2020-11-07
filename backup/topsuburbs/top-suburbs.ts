import { IChartData } from './../../models/chart-data';
import * as _ from 'lodash';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../../store';
import * as models from './../../models';
import { ICustomChartData, IMultiChartDictionary } from './../../models/chart-data';
@Component({
  selector: 'top-suburbs',
  templateUrl: 'top-suburbs.html'
})
export class TopSuburbsComponent implements OnChanges {
  @Input()
  chartData: IMultiChartDictionary;
  @Input()
  title: string;

  @Output()
  monthSelectedEvent: EventEmitter<number> = new EventEmitter();

  chartDataKeys: string[];
  labels: (string | undefined)[];
  public barColors = ['#34B4A7', '#466873', '#fa7f7f'];

  constructor(private store: Store<fromStore.IAppState>) {}

  ngOnChanges(changes: SimpleChanges) {
    this.chartDataKeys = Object.keys(this.chartData);

    if (changes.chartData.currentValue && this.chartData[this.chartDataKeys[0]].data && this.chartDataKeys.length > 0) {
      this.labels = this.chartData[this.chartDataKeys[0]].data.map(d => d.label);
    }
  }

  public onSeriesClick(e: any): void {
    this.store.dispatch(new fromStore.SetFilter({ suburb: e.category }));
  }
}
