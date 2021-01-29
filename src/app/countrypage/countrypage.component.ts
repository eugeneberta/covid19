import { Component, OnInit } from '@angular/core';
import { New } from '../new.model';
import { Covid19Service } from '../covid19.service';
import { Summary } from '../summary';
import { Country } from '../country';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { AngularFirestore} from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-country',
  templateUrl: './countrypage.component.html',
  styleUrls: ['./countrypage.component.css']
})
export class CountrypageComponent implements OnInit {
    
  public countryName : string = "";
  public country: Country = new Country("", 0,0,0,0,0,0,null!);

  // For the summary chart :
  summary: Summary = new Summary();

  // For the Pie Chart :
  public pieChartLabels: Label[] = ['Active Cases', 'Dead Cases', 'Recovered Cases'];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartData: ChartDataSets[] | undefined;
  public pieChartOptions: ChartOptions = {
      responsive: true,
  }

  // For the Bar Chart :
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'D MMM',
            },
          },
        }
      ]
    }
  }

  // For the line Chart :
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: ChartDataSets[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'D MMM',
            },
          },
        }
      ]
    }
  };

  // For the news display
  news!: New[];
  

  constructor(public covid19Service: Covid19Service,
    private router: Router,
    private firestore : AngularFirestore,
    private http: HttpClient) {}

  async ngOnInit(): Promise<void> {

    // Initializing country name :
    this.countryName = this.getCountryName();
    this.country.countryName = this.getCountryName();

    
    ///////////// IMPLEMENTING CHALLENGE 1 /////////////

    // We fetch data from our database :
    const doc = await this.firestore.collection("countries").doc(this.country.countryName).get().toPromise();
    
    // If there is no data for this corresponding country :
    if (!(doc.exists)){

      // We get the data of the country the usual way :
      this.covid19Service.getSummary().subscribe((data)=>{
        let country_data = this.getCountryData(data.Countries, this.country.countryName)
  
          this.country.newCases = country_data.NewConfirmed;
          this.country.totalCases = country_data.TotalConfirmed;
          this.country.newDeaths = country_data.NewDeaths;
          this.country.totalDeaths = country_data.TotalDeaths;
          this.country.newRecovered = country_data.NewRecovered;
          this.country.totalRecovered = country_data.TotalRecovered;
          this.country.lastUpdated = new Date();
        });
        
        await this.sleep(1000); // Sadly, the API is sometimes very slow so we wait for the results.

        // Then, we update the country data in firestore
        this.firestore.collection("countries").doc(this.country.countryName).set({
          countryName: this.country.countryName,
          totalCases: this.country.totalCases,
          newCases: this.country.newCases,
          totalDeaths: this.country.totalDeaths,
          newDeaths: this.country.newDeaths,
          totalRecovered: this.country.totalRecovered,
          newRecovered: this.country.newRecovered,
          lastUpdated: this.country.lastUpdated
        },{ merge: true});
    }

    // If the file is already in our database :
    else {

      var updated:boolean;

      const country = doc.data() as Country;

      const current = Math.round((new Date()).getTime()/1000);
      var last_update = country.lastUpdated as any;
      var last_update = last_update["seconds"];
      var diff = current-last_update;
      updated = (diff <= 24*3600);

      if (!updated) {
               
        // If it is not up to date, we fetch API Data the usual way :  
        this.covid19Service.getSummary().subscribe((data) => {
          let country_data = this.getCountryData(data.Countries, this.country.countryName);
          this.country.newCases = country_data.NewConfirmed;
          this.country.totalCases = country_data.TotalConfirmed;
          this.country.newDeaths = country_data.NewDeaths;
          this.country.totalDeaths = country_data.TotalDeaths;
          this.country.newRecovered = country_data.NewRecovered;
          this.country.totalRecovered = country_data.TotalRecovered;
          this.country.lastUpdated = new Date();
        });

        await this.sleep(1000);

        //And then, we update the country data in firestore
        this.firestore.collection("countries").doc(this.country.countryName).set({
          countryName: this.country.countryName,
          totalCases: this.country.totalCases,
          newCases: this.country.newCases,
          totalDeaths: this.country.totalDeaths,
          newDeaths: this.country.newDeaths,
          totalRecovered: this.country.totalRecovered,
          newRecovered: this.country.newRecovered
        },{ merge: true});
      }
  
      else {
        // If it is up to date we just have to collect data from firestore
        this.country.countryName = country.countryName;
        this.country.newCases = country.newCases;
        this.country.totalCases = country.totalCases;
        this.country.newDeaths = country.newDeaths;
        this.country.totalDeaths = country.totalDeaths;
        this.country.newRecovered = country.newRecovered;
        this.country.totalRecovered = country.totalRecovered;
        this.country.lastUpdated = country.lastUpdated;
      }
    }

    // Finally we initialize the Summary :
    this.summary.newCases = this.country.newCases;
    this.summary.totalCases = this.country.totalCases;
    this.summary.newDeaths = this.country.newDeaths;
    this.summary.totalDeaths = this.country.totalDeaths;
    this.summary.newRecovered = this.country.newRecovered;
    this.summary.totalRecovered = this.country.totalRecovered;
    this.summary.activeCases = (this.country.totalCases - this.country.totalRecovered - this.country.totalDeaths).toLocaleString();
    this.summary.recoveryRate = Math.round((this.country.totalRecovered / this.country.totalCases)*10000)/100; // We use maths to display in % in the html
    this.summary.mortalityRate = Math.round((this.country.totalDeaths / this.country.totalCases)*10000)/100; // Same here


    // Initializing Pie Chart config :
    let pieChartColors: string[] = ["#f0cf65" ,"#d7816a", "#93b5c6"];

    this.covid19Service.getSummary().subscribe((data)=>{
      let country_data = this.getCountryData(data.Countries, this.countryName);

      let cases : number = country_data.TotalConfirmed as number;
      let deaths: number = country_data.TotalDeaths as number;
      let recovered : number = country_data.TotalRecovered as number;
      let all_data: number[] = [cases, deaths, recovered];

      this.pieChartData = [{data: all_data, backgroundColor: pieChartColors}];
    });
    
    // Initializing Bar Chart config :
    this.covid19Service.dayoneCountry(this.countryName).subscribe((data)=>{
      let deaths : number[] = [];
      let cases : number[] = [];
      let recovered : number[] = [];
      let N : number = data.length;

      for (let i = 1; i<8; i++){
        let date_split = (data[N-i].Date).split("T");
        let date = date_split[0];
        this.barChartLabels.unshift(date); 

        deaths.unshift(data[N-i].Deaths - data[N-i-1].Deaths);
        cases.unshift(data[N-i].Confirmed - data[N-i-1].Confirmed);
        recovered.unshift(data[N-i].Recovered - data[N-i-1].Recovered);
      }

      this.barChartData = [
        {data: deaths, label: 'Daily Deaths', backgroundColor: "#d7816a"},
        {data: cases, label: 'Daily New Cases', backgroundColor: "#f0cf65"},
        {data: recovered, label: 'Daily Recovered', backgroundColor: "#93b5c6"}
      ];
    });
    
    // Initializing Line Chart :
    this.covid19Service.dayoneCountry(this.countryName).subscribe((data)=>{
      let deaths : number[] = [];
      let cases : number[] = [];
      let recovered : number[] = [];

      for (let i = 0; i < data.length; i+=4){
        // Collecting all the dates
        let date_split = (data[i].Date).split("T");
        let date = date_split[0];
        this.lineChartLabels.push(date);

        deaths.push(data[i].Deaths);
        cases.push(data[i].Confirmed);
        recovered.push(data[i].Recovered);
      }

      this.lineChartData = [
        {data: deaths, label: 'Daily Deaths', backgroundColor: "#d7816a"},
        {data: cases, label: 'Daily New Cases', backgroundColor: "#f0cf65"},
        {data: recovered, label: 'Daily Recovered', backgroundColor: "#93b5c6"}
      ];
    });

    // Initializing news :
    this.covid19Service.getNews().subscribe((news)=>{
      let country_news = []
      for(let i=0; i<news.length; i++){
        var new_i = news[i] as New;
        if(new_i.country == this.countryName){
          country_news.push(new_i);
        }
      }
      this.news = country_news;
    });
  };

  public getCountryName(){
    let url = this.router.url;
    url = decodeURI(url);
    return url.split("/")[2];
  }

  public getCountryData(jsonObject : any, name : string){
    return jsonObject.find((element: { Country: string; }) => element.Country === name);
  }

  public sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}