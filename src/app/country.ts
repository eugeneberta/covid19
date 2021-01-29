export class Country {
    countryName: string;
    newCases: number;
    totalCases: number;
    newDeaths: number;
    totalDeaths: number;
    newRecovered: number;
    totalRecovered: number;
    lastUpdated!: Date;

    constructor(countryName: string,newCases: number, totalCases: number, 
        newDeaths: number, totalDeaths: number, newRecovered: number, 
        totalRecovered: number, lastUpdated: Date)
        {
            this.countryName = countryName;
            this.newCases = newCases;
            this.totalCases = totalCases;
            this.newDeaths = newDeaths;
            this.totalDeaths = totalDeaths;
            this.newRecovered = newRecovered;
            this.totalRecovered = totalRecovered;
            this.lastUpdated = lastUpdated;
    }
}