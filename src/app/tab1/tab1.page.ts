import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AppService } from '../app.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('barChart', null) barChart: any;
  @ViewChild('horizontalBar', null) horizontalBarChart: any;
  @ViewChild('line2', null) line2Chart: any;

  bars: any;
  horizontalBar: any;
  line2: any;
  colorArray: any;
  data: any;
  isSaving = false;
  global: any;

  constructor(private appService: AppService,
    public loadingController: LoadingController) { }

  ionViewDidEnter() {
    this.getData();
  }

  async getData() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 10000
    });
    await loading.present();
    this.appService.getData().subscribe(res => {
      this.data = res;
      this.global = this.data['Global'];
      this.createBarChart();
      this.createHorizontalBarChart();
      loading.dismiss();
    }, (error) => {
      loading.dismiss();
    });
  }

  createBarChart() {
    //const newPerc = Math.floor((this.global.NewConfirmed / this.global.TotalConfirmed) * 100);
    const recoverdPerc = Math.floor((this.global.TotalRecovered / this.global.TotalConfirmed) * 100);
    const deathPerc = Math.floor((this.global.TotalDeaths / this.global.TotalConfirmed) * 100);
    const activePerc = 100 - (recoverdPerc + deathPerc);
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      height:400,
      data: {
        labels: ['Active (' + activePerc + '%)', 'Recoverd (' + recoverdPerc + '%)', 'Deaths (' + deathPerc + '%)'],
        datasets: [{
          label: 'Total Percentage value',
          data: [activePerc, recoverdPerc, deathPerc],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  createHorizontalBarChart() {
    this.horizontalBar = new Chart(this.horizontalBarChart.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ['Cases', 'Recovered', 'Deaths'],
        datasets: [{
          label: 'Total',
          data: [this.global.TotalConfirmed, this.global.TotalRecovered, this.global.TotalDeaths],
          backgroundColor: '#fca330', // array should have same number of elements as number of dataset
          borderColor: '#fca330',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'New',
          data: [this.global.NewConfirmed, this.global.NewRecovered, this.global.NewDeaths],
          backgroundColor: '#fc2205', // array should have same number of elements as number of dataset
          borderColor: '#fc2205',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
    });
  }

}