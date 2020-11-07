import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NavRootPage } from './nav-root';

@NgModule({
  declarations: [
    NavRootPage,
  ],
  imports: [
    IonicPageModule.forChild(NavRootPage),
  ],
})
export class NavRootPageModule {}
