import { Component, OnInit, Input } from '@angular/core';
import { ProvincialDamLevel } from '../data.model';

export interface ICoord {
  x: number;
  y: number;
  r: number;
}

@Component({
  selector: 'app-map-component',
  templateUrl: 'map-component.component.html'
})
export class MapComponentComponent implements OnInit {
  @Input()
  provinces;

  COLORS = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'];

  data = {};
  options = {
    aspectRatio: 1
  };

  constructor() {}

  ngOnInit() {
    const dataPoints: ICoord[] = this.provinces.map(province => {
      return {
        x: province.capital.longitude,
        y: province.capital.latitude,
        r: (province.waterInStorage * 100) / province.fsc / 3
      };
    });

    dataPoints.push({ x: 14, y: -38, r: 0.001 });
    this.data = [{ data: dataPoints }];
  }
}
