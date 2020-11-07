import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { FilterPopOverPage } from '../../pages/filter-pop-over/filter-pop-over';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  charts: any[] = [
    { title: 'Top 5 Suburbs', view: 'Month', img: 'Top5.PNG' },
    { title: 'Rent Amount Collected', view: 'Month', img: 'RentAmountCollected.PNG' },
    { title: 'Management Fee', view: 'Month', img: 'ManagementFee.PNG' },
    { title: 'Other Agency Fee', view: 'Month', img: 'OtherAgencyFees.PNG' },
    { title: 'Gain/Lost', view: 'Month', img: 'Gained.PNG' }
  ];
  agents: any[] = [
    { id: 1, name: 'Caitlin Parry', selected: false },
    { id: 2, name: 'Hayden Barlow', selected: false },
    { id: 3, name: 'Merle Zimmerman', selected: false },
    { id: 4, name: 'Ning Coles', selected: false },
    { id: 5, name: 'Peter Burke', selected: false }
  ];
  selectedItem: any;
  isMobile: boolean;

  @ViewChild(Slides)
  slides: Slides;

  @ViewChild('popoverContent', { read: ElementRef })
  content: ElementRef;

  loadedTabs: number[] = [0];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController
  ) {
    this.selectedItem = navParams.get('chart');
    if (platform.is('mobile')) {
      this.isMobile = true;
    }
  }
  ngOnInit() {
    this.setItems();
  }

  slideChanged(slide) {
    if (this.loadedTabs.indexOf(slide.getActiveIndex()) < 0) {
      const loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loader.present();

      setTimeout(() => {
        let currentIndex = this.slides.getActiveIndex();
        this.loadedTabs.push(currentIndex);
        loader.dismiss();
      }, 500);
    }
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(FilterPopOverPage, {
      contentEle: this.content.nativeElement,
      agents: this.agents
    });

    popover.present({
      ev: ev
    });
  }

  filterChart(item) {
    this.selectedItem = item;
  }
  setItems() {
    this.agents = [
      { name: 'Caitlin Parry', selected: false },
      { name: 'Hayden Barlow', selected: false },
      { name: 'Merle Zimmerman', selected: false },
      { name: 'Ning Coles', selected: false },
      { name: 'Peter Burke', selected: false }
    ];
  }

  clearFilter() {
    this.selectedItem = null;
  }
}
