import { Component, OnInit, Input } from '@angular/core';
import { ICurrentMonth } from './../../models/current-month';

@Component({
  selector: 'overview',
  templateUrl: 'overview.html'
})
export class OverviewComponent implements OnInit {
  @Input()
  monthData: ICurrentMonth;

  tenancyArrearsAmt: string;
  constructor() {}

  ngOnInit() {
    this.tenancyArrearsAmt = this.formatToCurrency(this.monthData.TDTenancyArrearsAmount);
  }

  formatToCurrency(arrearsAmount: any): string {
    const formatter = new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    });

    return formatter.format(arrearsAmount);
  }
}
