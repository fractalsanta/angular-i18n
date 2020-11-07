import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FilterPopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter-pop-over',
  templateUrl: 'filter-pop-over.html'
})
export class FilterPopOverPage {
  agents: Array<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    console.log(this.navParams.data.agents);
    this.agents = this.navParams.data.agents;
  }
  setItems() {
    this.agents = [
      'Caitlin Parry',
      'Hayden Barlow',
      'Merle Zimmerman',
      'Ning Coles',
      'Peter Burke',
      'Caitlin Parry',
      'Hayden Barlow',
      'Merle Zimmerman',
      'Ning Coles',
      'Peter Burke',
      'Caitlin Parry',
      'Hayden Barlow',
      'Merle Zimmerman',
      'Ning Coles',
      'Peter Burke'
    ];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPopOverPage');
  }
  filterItems(ev: any) {
    this.setItems();
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.agents = this.agents.filter(function(item) {
        return item.toLowerCase().includes(val.toLowerCase());
      });
    }
  }
}
