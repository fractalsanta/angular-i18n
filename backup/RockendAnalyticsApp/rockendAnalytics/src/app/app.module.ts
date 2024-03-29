import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ComponentsModule } from '../components/components.module';
import { FilterPopOverModule } from '../pages/filter-pop-over/filter-pop-over.module';

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [BrowserModule, ComponentsModule, IonicModule.forRoot(MyApp), IonicModule, FilterPopOverModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
