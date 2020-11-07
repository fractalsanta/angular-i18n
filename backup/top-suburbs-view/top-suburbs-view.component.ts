import { ICustomChartData, IMultiChartDictionary } from './../../models/chart-data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../store';
import { Subscription } from 'rxjs/Subscription';
import { IFilter, ISuburb } from '../../models';
import * as _ from 'lodash';
import * as models from '../../models';
import { Observable } from 'rxjs/Observable';
import { Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'top-suburbs-view',
  template: '<top-suburbs *ngIf="chartData" [chartData]="chartData" [title]="title"></top-suburbs>'
})
export class TopSuburbsViewComponent implements OnInit, OnDestroy {
  chartData: IMultiChartDictionary;

  public title = 'Top 5 Suburbs';
  public topSuburbs: models.ISuburb[] | null;
  public suburbSub$: Observable<models.ISuburb[] | null>;

  private filterSub: Subscription;
  private topSuburbsSub: Subscription;
  private filter: IFilter;
  private loaderSub: Subscription;
  private loader: Loading;
  private topSuburbsData: models.ISuburb[] | null;

  suburbs: any;

  ngOnInit() {
    this.filterSub = this.store.select(fromStore.getFilterData).subscribe((filterState: IFilter) => {
      this.filter = filterState;
      this.chartData = this.mapChartData(this.filterSuburbsData(this.filter, this.topSuburbsData));
    });

    this.topSuburbsSub = this.store.select(fromStore.getTopSuburbs).subscribe((topSuburbsData: ISuburb[] | null) => {
      this.topSuburbsData = topSuburbsData;
      this.chartData = this.mapChartData(this.filterSuburbsData(this.filter, this.topSuburbsData));
    });

    this.loaderSub = this.store.select(fromStore.getTopSuburbsFetching).subscribe((fetching: boolean) => {
      if (fetching) {
        if (!this.loader || !this.loader.instance) {
          this.loader = this.loadingCtrl.create({
            content: 'Please wait...'
          });
        }
        this.loader.present();
      } else {
        if (this.loader) {
          this.loader.dismiss();
        }
      }
    });
  }

  ngOnDestroy() {
    this.loaderSub.unsubscribe();
    this.topSuburbsSub.unsubscribe();
    this.filterSub.unsubscribe();
  }

  filterSuburbsData(filterState: IFilter | null, topSuburbsData: ISuburb[] | null): ISuburb[] {
    if (topSuburbsData === null) {
      return [];
    }

    return _.chain(topSuburbsData)
      .filter((suburb: ISuburb) => {
        if (!filterState || !filterState.agents || !filterState.agents.length) {
          return true;
        }

        return _.includes(_.map(filterState.agents, 'Name'), suburb.AgentFullName || '');
      })
      .groupBy('Name')
      .map((objs, key) => ({
        Name: key,
        ManagementType: objs[0].ManagementType,
        AgentFullName: objs[0].AgentFullName,
        TDActiveProp: _.sumBy(objs, 'TDActiveProp'),
        TDActiveLeases: _.sumBy(objs, 'TDActiveLeases'),
        TDVacantProp: _.sumBy(objs, 'TDVacantProp')
      }))
      .orderBy(['TDActiveProp', 'TDActiveLeases', 'TDVacantProp'], 'desc')
      .value();
  }

  mapChartData(topSuburbsData: ISuburb[]): IMultiChartDictionary {
    if (topSuburbsData === null) {
      return {};
    }

    let chartSeries: IMultiChartDictionary = {};

    chartSeries['TDActiveProp'] = { name: 'Active Properties', type: 'column', axis: 'axis1', data: [] };
    chartSeries['TDActiveLeases'] = { name: 'Active Leases', type: 'column', axis: 'axis1', data: [] };
    chartSeries['TDVacantProp'] = { name: 'Vacant Properties', type: 'column', axis: 'axis1', data: [] };

    _.forEach(topSuburbsData, (chartDataItem: any) => {
      _.forEach(Object.keys(chartSeries), propertyName => {
        chartSeries[propertyName].data.push({
          value: chartDataItem[propertyName],
          label: chartDataItem.Name,
          labelId: undefined
        });
      });
    });

    return chartSeries;
  }

  constructor(private store: Store<fromStore.IAppState>, private loadingCtrl: LoadingController) {}
}
