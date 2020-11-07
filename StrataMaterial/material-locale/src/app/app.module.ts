import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  // providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
