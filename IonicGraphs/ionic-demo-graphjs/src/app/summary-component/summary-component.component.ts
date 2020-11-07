import { Component, OnInit, Input } from '@angular/core';
import { ProvincialDamLevel } from '../data.model';

@Component({
  selector: 'app-summary-component',
  templateUrl: 'summary-component.component.html'
})
export class SummaryComponentComponent implements OnInit {
  @Input()
  province: ProvincialDamLevel;

  constructor() {}

  ngOnInit() {}

  toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + ' \u00B0 ' + minutes + ' \u00B0 ' + seconds;
  }

  get latitude() {
    const lat = this.province.capital.latitude;
    var latitude = this.toDegreesMinutesAndSeconds(lat);
    var latitudeCardinal = Math.sign(lat) >= 0 ? 'N' : 'S';
    return latitude + ' ' + latitudeCardinal;
  }

  get longitude() {
    const long = this.province.capital.longitude;
    var longitude = this.toDegreesMinutesAndSeconds(long);
    var longitudeCardinal = Math.sign(long) >= 0 ? 'E' : 'W';
    return longitude + ' ' + longitudeCardinal;
  }
}
