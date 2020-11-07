import { TabExampleComponent } from './shared/components/tab-example/tab-example.component';
import { MatTabsModule, MatTabLink } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';

import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { KendoChatComponent } from './shared/components/kendo-chat/kendo-chat.component';
// import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { KendoDatepickerComponent } from './shared/components/kendo-datepicker/kendo-datepicker.component';
import { KendoDialogComponent } from './shared/components/kendo-dialog/kendo-dialog.component';

import { AccordionModule } from 'ngx-bootstrap';
import { BsAccordionComponent } from './shared/components/bs-accordion/bs-accordion.component';

@NgModule({
  declarations: [AppComponent, TabExampleComponent, KendoDatepickerComponent, KendoDialogComponent, BsAccordionComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatButtonModule, MatTabsModule, AccordionModule.forRoot()],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
