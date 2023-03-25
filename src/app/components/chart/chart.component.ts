import { Component, OnInit } from '@angular/core';
import {Chart, ChartConfiguration, ChartItem, registerables} from 'node_modules/chart.js'
const data = {
  labels: ['January','February','March','April','May'],
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [10, 5, 2, 20, 30, 45],
  }]
};
const options = {
  scales: {
    y: {
      beginAtZero: true,
      display: false
    }
  }
}

const config: ChartConfiguration = {
  type: 'line',
  data: data,
  options: options
}


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const chartItem: ChartItem = document.getElementById('my-chart') as ChartItem
    new Chart(chartItem, config)
    this.createChart()
  }
  createChart(): void {
    Chart.register(...registerables);
  }

}
