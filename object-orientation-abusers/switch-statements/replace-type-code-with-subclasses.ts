// The Problem
// Switch Statement with Type Code: You have a class with type codes and switch statements based on those codes

enum EmployeeType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACTOR = "CONTRACTOR",
  INTERN = "INTERN",
}

class Employee {
  private name: string;
  private type: EmployeeType;
  private baseSalary: number;
  private hoursWorked: number;

  constructor(
    name: string,
    type: EmployeeType,
    baseSalary: number,
    hoursWorked: number = 40
  ) {
    this.name = name;
    this.type = type;
    this.baseSalary = baseSalary;
    this.hoursWorked = hoursWorked;
  }

  // Switch statement smell: Different behavior based on type code
  calculateMonthlySalary(): number {
    switch (this.type) {
      case EmployeeType.FULL_TIME:
        return this.baseSalary + this.calculateFullTimeBonus();
      case EmployeeType.PART_TIME:
        return (this.baseSalary / 40) * this.hoursWorked;
      case EmployeeType.CONTRACTOR:
        return this.baseSalary * this.hoursWorked;
      case EmployeeType.INTERN:
        return this.baseSalary * 0.5; // 50% of base rate
      default:
        throw new Error("Unknown employee type");
    }
  }

  // More switch statements - code duplication
  getBenefits(): string[] {
    switch (this.type) {
      case EmployeeType.FULL_TIME:
        return ["Health Insurance", "401k", "Paid Vacation", "Dental"];
      case EmployeeType.PART_TIME:
        return ["Health Insurance", "Paid Vacation"];
      case EmployeeType.CONTRACTOR:
        return [];
      case EmployeeType.INTERN:
        return ["Learning Stipend"];
      default:
        throw new Error("Unknown employee type");
    }
  }

  getVacationDays(): number {
    switch (this.type) {
      case EmployeeType.FULL_TIME:
        return 25;
      case EmployeeType.PART_TIME:
        return Math.floor((this.hoursWorked / 40) * 25);
      case EmployeeType.CONTRACTOR:
        return 0;
      case EmployeeType.INTERN:
        return 10;
      default:
        throw new Error("Unknown employee type");
    }
  }

  getEmploymentStatus(): string {
    switch (this.type) {
      case EmployeeType.FULL_TIME:
        return "Permanent Full-time Employee";
      case EmployeeType.PART_TIME:
        return "Permanent Part-time Employee";
      case EmployeeType.CONTRACTOR:
        return "Independent Contractor";
      case EmployeeType.INTERN:
        return "Temporary Intern";
      default:
        throw new Error("Unknown employee type");
    }
  }

  private calculateFullTimeBonus(): number {
    return this.baseSalary * 0.1; // 10% bonus for full-time
  }

  // Getters
  getName(): string {
    return this.name;
  }
  getType(): EmployeeType {
    return this.type;
  }
  getBaseSalary(): number {
    return this.baseSalary;
  }
  getHoursWorked(): number {
    return this.hoursWorked;
  }
}

// Usage - Client code needs to know about employee types
const fullTimeEmployee = new Employee(
  "Alice Johnson",
  EmployeeType.FULL_TIME,
  5000,
  40
);
const partTimeEmployee = new Employee(
  "Bob Smith",
  EmployeeType.PART_TIME,
  3000,
  20
);
const contractor = new Employee(
  "Carol Wilson",
  EmployeeType.CONTRACTOR,
  80,
  35
);
const intern = new Employee("David Brown", EmployeeType.INTERN, 2000, 40);

console.log("=== Original Implementation ===");
console.log(
  `${fullTimeEmployee.getName()}: $${fullTimeEmployee.calculateMonthlySalary()}`
);
console.log(`Benefits: ${fullTimeEmployee.getBenefits().join(", ")}`);
console.log(`Vacation Days: ${fullTimeEmployee.getVacationDays()}`);
console.log(`Status: ${fullTimeEmployee.getEmploymentStatus()}`);

console.log(
  `${partTimeEmployee.getName()}: $${partTimeEmployee.calculateMonthlySalary()}`
);
console.log(`Benefits: ${partTimeEmployee.getBenefits().join(", ")}`);
console.log(`Vacation Days: ${partTimeEmployee.getVacationDays()}`);

console.log(`${contractor.getName()}: $${contractor.calculateMonthlySalary()}`);
console.log(`Benefits: ${contractor.getBenefits().join(", ") || "None"}`);
console.log(`Vacation Days: ${contractor.getVacationDays()}`);

console.log(`${intern.getName()}: $${intern.calculateMonthlySalary()}`);
console.log(`Benefits: ${intern.getBenefits().join(", ")}`);
console.log(`Vacation Days: ${intern.getVacationDays()}`);

// The Solution
// Replace Type Code with Subclasses - Create separate subclasses for each employee type
abstract class RefactoredEmployee {
  protected name: string;
  protected baseSalary: number;
  protected hoursWorked: number;

  constructor(name: string, baseSalary: number, hoursWorked: number = 40) {
    this.name = name;
    this.baseSalary = baseSalary;
    this.hoursWorked = hoursWorked;
  }

  // Abstract methods that subclasses must implement
  abstract calculateMonthlySalary(): number;
  abstract getBenefits(): string[];
  abstract getVacationDays(): number;
  abstract getEmploymentStatus(): string;

  // Common getters
  getName(): string {
    return this.name;
  }

  getBaseSalary(): number {
    return this.baseSalary;
  }

  getHoursWorked(): number {
    return this.hoursWorked;
  }
}

class FullTimeEmployee extends RefactoredEmployee {
  calculateMonthlySalary(): number {
    return this.baseSalary + this.calculateFullTimeBonus();
  }

  getBenefits(): string[] {
    return ["Health Insurance", "401k", "Paid Vacation", "Dental"];
  }

  getVacationDays(): number {
    return 25;
  }

  getEmploymentStatus(): string {
    return "Permanent Full-time Employee";
  }

  private calculateFullTimeBonus(): number {
    return this.baseSalary * 0.1; // 10% bonus for full-time
  }
}

class PartTimeEmployee extends RefactoredEmployee {
  calculateMonthlySalary(): number {
    return (this.baseSalary / 40) * this.hoursWorked;
  }

  getBenefits(): string[] {
    return ["Health Insurance", "Paid Vacation"];
  }

  getVacationDays(): number {
    return Math.floor((this.hoursWorked / 40) * 25);
  }

  getEmploymentStatus(): string {
    return "Permanent Part-time Employee";
  }
}

class ContractorEmployee extends RefactoredEmployee {
  calculateMonthlySalary(): number {
    return this.baseSalary * this.hoursWorked;
  }

  getBenefits(): string[] {
    return [];
  }

  getVacationDays(): number {
    return 0;
  }

  getEmploymentStatus(): string {
    return "Independent Contractor";
  }
}

class InternEmployee extends RefactoredEmployee {
  calculateMonthlySalary(): number {
    return this.baseSalary * 0.5; // 50% of base rate
  }

  getBenefits(): string[] {
    return ["Learning Stipend"];
  }

  getVacationDays(): number {
    return 10;
  }

  getEmploymentStatus(): string {
    return "Temporary Intern";
  }
}

// Usage after refactoring
console.log("\n=== After Refactoring ===");

const refactoredFullTime = new FullTimeEmployee("Alice Johnson", 5000, 40);
const refactoredPartTime = new PartTimeEmployee("Bob Smith", 3000, 20);
const refactoredContractor = new ContractorEmployee("Carol Wilson", 80, 35);
const refactoredIntern = new InternEmployee("David Brown", 2000, 40);

console.log(`${refactoredFullTime.getName()}: $${refactoredFullTime.calculateMonthlySalary()}`);
console.log(`Benefits: ${refactoredFullTime.getBenefits().join(", ")}`);
console.log(`Vacation Days: ${refactoredFullTime.getVacationDays()}`);
console.log(`Status: ${refactoredFullTime.getEmploymentStatus()}`);

console.log(`${refactoredPartTime.getName()}: $${refactoredPartTime.calculateMonthlySalary()}`);
console.log(`Benefits: ${refactoredPartTime.getBenefits().join(", ")}`);
console.log(`Vacation Days: ${refactoredPartTime.getVacationDays()}`);

console.log(`${refactoredContractor.getName()}: $${refactoredContractor.calculateMonthlySalary()}`);
console.log(`Benefits: ${refactoredContractor.getBenefits().join(", ") || "None"}`);
console.log(`Vacation Days: ${refactoredContractor.getVacationDays()}`);

console.log(`${refactoredIntern.getName()}: $${refactoredIntern.calculateMonthlySalary()}`);
console.log(`Benefits: ${refactoredIntern.getBenefits().join(", ")}`);
console.log(`Vacation Days: ${refactoredIntern.getVacationDays()}`);

// Benefits:
// 1. Eliminated all switch statements and type codes
// 2. Each subclass encapsulates its own behavior
// 3. Type-safe - impossible to create invalid employee types
// 4. Open/Closed Principle - easy to add new employee types without modifying existing code
// 5. Single Responsibility - each class has one reason to change
// 6. Polymorphism replaces conditional logic
// 7. Better maintainability - changes to one employee type don't affect others


