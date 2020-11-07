import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from './../../app/data.service';
import { ProvincialDamLevel } from './../../app/data.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  seriesDate;
  constructor(public navCtrl: NavController, private dataService: DataService) {}

  ngOnInit() {
    const obs$ = this.dataService.getDamLevels();
    obs$.subscribe((pdl: ProvincialDamLevel[]) => {
      this.seriesDate = pdl;
    });
  }
}
