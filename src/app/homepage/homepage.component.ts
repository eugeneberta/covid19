import { NONE_TYPE, SummaryResolver } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Covid19Service } from '../covid19.service';
import { New } from '../new.model';
import { Summary } from '../summary';
import { User } from '../user.model';
import {Chart, ChartDataSets, ChartOptions, ChartType} from 'chart.js'
import { Color, Label } from 'ng2-charts';
import { Country } from '../country';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

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

  // For the table :
  public tableData: Country[] = [];

  // For the news display
  news!: New[];
  

  constructor(public covid19Service: Covid19Service) {}

  ngOnInit(): void {
    // Initializing Summary Data :
    this.covid19Service.getSummary().subscribe((summary)=>{
      this.summary.newCases = summary.Global.NewConfirmed.toLocaleString();
      this.summary.totalCases = summary.Global.TotalConfirmed.toLocaleString();
      this.summary.newDeaths = summary.Global.NewDeaths.toLocaleString();
      this.summary.totalDeaths = summary.Global.TotalDeaths.toLocaleString();
      this.summary.newRecovered = summary.Global.NewRecovered.toLocaleString();
      this.summary.totalRecovered = summary.Global.TotalRecovered.toLocaleString();
      this.summary.activeCases = (summary.Global.TotalConfirmed - summary.Global.TotalRecovered - summary.Global.TotalDeaths).toLocaleString();
      this.summary.recoveryRate = Math.round((summary.Global.TotalRecovered / summary.Global.TotalConfirmed)*10000)/100; // We use maths to display in % in the html
      this.summary.mortalityRate = Math.round((summary.Global.TotalDeaths/summary.Global.TotalConfirmed)*10000)/100; // Same here
    });

    // Initializing Pie Chart config :
    let pieChartColors: string[] = ["#f0cf65" ,"#d7816a", "#93b5c6"];
    this.covid19Service.getPieChartData().subscribe((data)=>{
      let cases : number = Object.values(data.cases)[0] as number;
      let deaths: number = Object.values(data.deaths)[0] as number;
      let recovered : number = Object.values(data.recovered)[0] as number;
      let all_data: number[] = [cases, deaths, recovered];

      this.pieChartData = [{data: all_data, backgroundColor: pieChartColors}];
      console.log(this.pieChartData);
    });
    
    // Initializing Bar Chart config :
    this.covid19Service.getBarChartData().subscribe((data)=>{
    
      let days = Object.keys(data["cases"] as Date[])

      let tot_deaths : number[] = Object.values(data.deaths);
      let tot_cases : number[] = Object.values(data.cases);
      let tot_recovered : number[] = Object.values(data.recovered);

      let day_deaths : number[] = [];
      let day_cases : number[] = [];
      let day_recovered : number[] = [];

      for (var i = 1; i < days.length; i++){
        this.barChartLabels.push(days[i]);
        day_deaths.push(tot_deaths[i]-tot_deaths[i-1]);
        day_cases.push(tot_cases[i]-tot_cases[i-1]);
        day_recovered.push(tot_recovered[i]-tot_recovered[i-1]);
      }

      this.barChartData = [
        {data: day_deaths, label: 'Daily Deaths', backgroundColor: "#d7816a"},
        {data: day_cases, label: 'Daily New Cases', backgroundColor: "#f0cf65"},
        {data: day_recovered, label: 'Daily Recovered', backgroundColor: "#93b5c6"}
      ];
    });

    
    // Initializing Line Chart :
    this.covid19Service.getLineChartData().subscribe((data)=>{
      this.lineChartLabels = Object.keys(data["cases"])
      let deaths : number[] = Object.values(data.deaths)
      let cases : number[] = Object.values(data.cases)
      let recovered : number[] = Object.values(data.recovered)

      this.lineChartData = [
        {data: deaths, label: 'Daily Deaths', borderColor: "#d7816a",pointBackgroundColor: "#d7816a"},
        {data: recovered, label: 'Daily Recovered', borderColor: "#93b5c6", pointBackgroundColor: "#93b5c6"},
        {data: cases, label: 'Daily New Cases', borderColor: "#f0cf65", pointBackgroundColor: "#f0cf65"}
      ];
    });
    
    
    // Initializing table :
    this.covid19Service.getSummary().subscribe((data)=>{
      var countries = data.Countries;
      var tableData : Country[] = [];
      for (var i = 0; i < countries.length; i++){
        var country = new Country(
          countries[i].Country,
          countries[i].NewConfirmed.toLocaleString(),
          countries[i].TotalConfirmed.toLocaleString(),
          countries[i].NewDeaths.toLocaleString(),
          countries[i].TotalDeaths.toLocaleString(),
          countries[i].NewRecovered.toLocaleString(),
          countries[i].TotalRecovered.toLocaleString(),
          countries[i].lastUpdated
        );
        tableData.push(country);
      }
      this.tableData = tableData;
    });

    // Initializing news :
    this.covid19Service.getNews().subscribe((news)=>{
      let country_news = []
      for(let i=0; i<news.length; i++){
        var new_i = news[i] as New;
        if(new_i.country == "Worldwide"){
          country_news.push(new_i);
        }
      }
      this.news = country_news;
    });
  }
}