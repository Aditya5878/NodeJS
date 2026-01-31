class Project {
    name : string;
    budget : number 

    // constructor
    constructor (name : string , budget : number){
        this.name = name;
        this.budget = budget;
    }

    // a method 
    printBudget(){
        console.log(`${this.name} has budget ${this.budget}`)
    }
}


// create an instance / object of project call 

const coolProject = new Project('CoolProject', 10000);

coolProject.printBudget();
