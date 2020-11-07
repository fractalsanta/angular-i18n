import { AppComponent } from './my-app.component';
import { HomePage } from './../pages/home/home';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from './data.service';
import { ProvincialDamLevel } from './data.model';
import { BarChartComponentComponent } from './bar-chart-component/bar-chart-component.component';
import { MapComponentComponent } from './map-component/map-component.component';
import { SummaryComponentComponent } from './summary-component/summary-component.component';
import { TableComponentComponent } from './table-component/table-component.component';

@Component({
  templateUrl: './app.component.html'
})
export class MyApp {
  rootPage: any = HomePage;
  title = 'analytics-poc';
  seriesDate;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private dataService: DataService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    const obs$ = this.dataService.getDamLevels();
    obs$.subscribe((pdl: ProvincialDamLevel[]) => {
      this.seriesDate = pdl;
    });
  }
}
