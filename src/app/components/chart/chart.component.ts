import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.dibujarGrafico();
  }
  dibujarGrafico(): void {
    const canvas = document.getElementById('grafico-lineal') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [{
        label: 'Datos',
        data: [1, 2, 3, 4, 5],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    const options = {};
    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  }




}
