import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
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
  agents: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.agents = new Array();
  }
  ngOnInit() {
    this.agents = new Array<string>();
  }
  setItems() {
    this.agents = this.navParams.data.agents;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPopOverPage');
  }
  filterItems(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value != '') {
      this.setItems();
      let val = ev.target.value;

      if (val && val.trim() !== '') {
        this.agents = this.agents.filter(function(item) {
          return item.name.toLowerCase().includes(val.toLowerCase());
        });
      }
    } else {
      this.agents = new Array();
    }
  }

  selectAgent(ev: any, index) {
    this.agents[index].selected = !this.agents[index].selected;
    console.log(this.agents);
  }
}
