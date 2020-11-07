import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bar-chart-component',
  templateUrl: 'bar-chart-component.component.html'
})
export class BarChartComponentComponent implements OnInit {
  @Input()
  data;

  @Input()
  labels;

  @Output()
  chartClicked = new EventEmitter();

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: { beginAtZero: true },
          scaleLabel: { labelString: 'Dam level (%)' }
        }
      ]
    }
  };

  constructor() {}

  ngOnInit() {}
}
