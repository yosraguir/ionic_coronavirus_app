import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  countries: any;
  data: any;
  constructor(private appService: AppService,
    public loadingController: LoadingController) { }

  ionViewDidEnter() {
    this.getData();
  }

  search() {
    const searchbar = document.querySelector('ion-searchbar');
    const items = Array.from(document.querySelector('ion-list').children);

    searchbar.addEventListener('ionInput', handleInput);

    function handleInput(event) {
      const query = event.target.value.toLowerCase();
      requestAnimationFrame(() => {
        items.forEach((item) => {
          const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
          shouldShow ? item.removeAttribute('hidden') : item.setAttribute('hidden', 'hidden');
        });
      });
    }
  }

  async getData() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 10000
    });
    await loading.present();
    this.appService.getData().subscribe(res => {
      this.data = res;
      this.countries = this.data['Countries'];
      this.countries.sort((a, b) => (a.TotalConfirmed < b.TotalConfirmed) ? 1 : -1);//to get a avant b in order 
      loading.dismiss();
      setTimeout(() => {
        this.search();
      }, 200);
    }, (error) => {
      loading.dismiss();
    });
  }

}