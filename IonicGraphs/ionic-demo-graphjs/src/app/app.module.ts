import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AppComponent } from './my-app.component';
import { HeaderComponent } from './header/header.component';
import { DataService } from './data.service';
import { ChartsModule } from 'ng2-charts';
import { SummaryComponentComponent } from './summary-component/summary-component.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from 'ng2-completer';
import { BarChartComponentComponent } from './bar-chart-component/bar-chart-component.component';
import { TableComponentComponent } from './table-component/table-component.component';
import { MapComponentComponent } from './map-component/map-component.component';
import { HomePage } from './../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AppComponent,
    HeaderComponent,
    SummaryComponentComponent,
    BarChartComponentComponent,
    TableComponentComponent,
    MapComponentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    FormsModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, AppComponent],
  providers: [StatusBar, SplashScreen, DataService, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
