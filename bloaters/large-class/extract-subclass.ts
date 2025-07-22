// The Problem
// When a class has features that are used only in some instances, you can extract those features into a subclass.

class Employee {
  name: string = "";
  salary: number = 0;
  department: string = "";
  
  // Manager-specific fields
  teamSize: number = 0;
  budgetLimit: number = 0;
  
  // Developer-specific fields
  programmingLanguages: string[] = [];
  yearsOfExperience: number = 0;

  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  getAnnualSalary(): number {
    return this.salary * 12;
  }

  // Manager-specific methods
  getTeamSize(): number {
    return this.teamSize;
  }

  setBudgetLimit(limit: number): void {
    this.budgetLimit = limit;
  }

  // Developer-specific methods
  addProgrammingLanguage(language: string): void {
    this.programmingLanguages.push(language);
  }

  getExperienceLevel(): string {
    if (this.yearsOfExperience < 2) return "Junior";
    if (this.yearsOfExperience < 5) return "Mid-level";
    return "Senior";
  }
}

// The Solution
// Extract subclasses for specific employee types, moving relevant fields and methods to appropriate subclasses.

class RefactoredEmployee {
  name: string = "";
  salary: number = 0;
  department: string = "";

  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  getAnnualSalary(): number {
    return this.salary * 12;
  }
}

class Manager extends RefactoredEmployee {
  teamSize: number = 0;
  budgetLimit: number = 0;

  constructor(name: string, salary: number, department: string, teamSize: number) {
    super(name, salary, department);
    this.teamSize = teamSize;
  }

  getTeamSize(): number {
    return this.teamSize;
  }

  setBudgetLimit(limit: number): void {
    this.budgetLimit = limit;
  }

  getManagementBonus(): number {
    return this.salary * 0.2 * (this.teamSize / 10);
  }
}

class Developer extends RefactoredEmployee {
  programmingLanguages: string[] = [];
  yearsOfExperience: number = 0;

  constructor(name: string, salary: number, department: string, yearsOfExperience: number) {
    super(name, salary, department);
    this.yearsOfExperience = yearsOfExperience;
  }

  addProgrammingLanguage(language: string): void {
    this.programmingLanguages.push(language);
  }

  getExperienceLevel(): string {
    if (this.yearsOfExperience < 2) return "Junior";
    if (this.yearsOfExperience < 5) return "Mid-level";
    return "Senior";
  }

  getSkillBonus(): number {
    return this.programmingLanguages.length * 1000;
  }
}

// Usage example
const manager = new Manager("Alice Johnson", 8000, "Engineering", 8);
manager.setBudgetLimit(50000);
console.log(`${manager.name} manages ${manager.getTeamSize()} people`);
console.log(`Management bonus: $${manager.getManagementBonus()}`);

const developer = new Developer("Bob Smith", 6000, "Engineering", 3);
developer.addProgrammingLanguage("TypeScript");
developer.addProgrammingLanguage("Python");
console.log(`${developer.name} is a ${developer.getExperienceLevel()} developer`);
console.log(`Skill bonus: $${developer.getSkillBonus()}`);

// Benefits of the Refactoring
// 1. Improved readability: Each class now has a clear purpose and responsibility.