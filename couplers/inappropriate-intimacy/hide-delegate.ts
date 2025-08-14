// The Problem
// The client gets object B from a field or method of object А. Then the client calls a method of object B.

class Department {
  private manager: string;

  constructor(manager: string) {
    this.manager = manager;
  }

  getManager(): string {
    return this.manager;
  }

  setManager(manager: string): void {
    this.manager = manager;
  }
}

class Employee {
  private name: string;
  private department: Department;

  constructor(name: string, department: Department) {
    this.name = name;
    this.department = department;
  }

  getName(): string {
    return this.name;
  }

  getDepartment(): Department {
    return this.department;
  }
}

// Usage showing the problem - Client knows about and depends on Department class
const department = new Department("Alice Smith");
const employee = new Employee("John Doe", department);

// INAPPROPRIATE INTIMACY: Client directly accesses department through employee
console.log("Problem - Client knows about Department:");
console.log(`Employee: ${employee.getName()}`);
console.log(`Manager: ${employee.getDepartment().getManager()}`); // Client talks to Department directly

// When department manager changes
employee.getDepartment().setManager("Bob Johnson");
console.log(`New Manager: ${employee.getDepartment().getManager()}`);

// The Solution
// Create a new method in class A that delegates the call to object B. Now the client doesn't know about, or depend on, class B.

class DepartmentRefactored {
  private manager: string;

  constructor(manager: string) {
    this.manager = manager;
  }

  getManager(): string {
    return this.manager;
  }

  setManager(manager: string): void {
    this.manager = manager;
  }
}

class EmployeeRefactored {
  private name: string;
  private department: DepartmentRefactored;

  constructor(name: string, department: DepartmentRefactored) {
    this.name = name;
    this.department = department;
  }

  getName(): string {
    return this.name;
  }

  // HIDE DELEGATE: Create delegation methods instead of exposing department
  getManager(): string {
    return this.department.getManager();
  }

  setManager(manager: string): void {
    this.department.setManager(manager);
  }

  // Keep the department getter private or remove it entirely
  // getDepartment(): DepartmentRefactored {
  //   return this.department;
  // }
}

// Usage after refactoring - Client no longer needs to know about Department
const departmentRefactored = new DepartmentRefactored("Alice Smith");
const employeeRefactored = new EmployeeRefactored("John Doe", departmentRefactored);

console.log("\nAfter Hide Delegate refactoring:");
console.log(`Employee: ${employeeRefactored.getName()}`);
console.log(`Manager: ${employeeRefactored.getManager()}`); // Client only talks to Employee

// When department manager changes
employeeRefactored.setManager("Bob Johnson");
console.log(`New Manager: ${employeeRefactored.getManager()}`);

// Benefits:
// 1. Client code is simpler and cleaner
// 2. Client doesn't depend on Department class structure
// 3. Changes to Department class don't affect client code
// 4. Employee class controls access to Department functionality
// 5. Better encapsulation and reduced coupling