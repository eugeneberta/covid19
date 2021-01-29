export class Summary {

    totalCases: number;    
    newCases: number;
    activeCases: number | string;

    totalRecovered: number;
    newRecovered: number;
    recoveryRate: number;

    totalDeaths: number;
    newDeaths: number;
    mortalityRate: number;

    constructor(){
        this.newCases = null!;
        this.totalCases = null!;
        this.newDeaths = null!;
        this.totalDeaths = null!;
        this.newRecovered = null!;
        this.totalRecovered = null!;
        this.activeCases = null!;
        this.recoveryRate = null!;
        this.mortalityRate = null!;
    }
}