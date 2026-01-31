"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Project {
    // constructor
    constructor(name, budget) {
        this.name = name;
        this.budget = budget;
    }
    // a method 
    printBudget() {
        console.log(`${this.name} has budget ${this.budget}`);
    }
}
// create an instance / object of project call 
const coolProject = new Project('CoolProject', 10000);
coolProject.printBudget();
//# sourceMappingURL=2.Project.js.map