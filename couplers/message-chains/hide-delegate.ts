// The Problem
// The client gets object B from a field or method of object А. Then the client calls a method of object B.

class Department {
  private manager: string;
  private chargeCode: string;

  constructor(manager: string, chargeCode: string) {
    this.manager = manager;
    this.chargeCode = chargeCode;
  }

  getManager(): string {
    return this.manager;
  }

  getChargeCode(): string {
    return this.chargeCode;
  }
}

class Person {
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

// Message Chain Problem - Client has to navigate through multiple objects
class Client {
  displayPersonInfo(person: Person): void {
    // Message chain: person.getDepartment().getManager()
    const manager = person.getDepartment().getManager();
    const chargeCode = person.getDepartment().getChargeCode();
    
    console.log(`Person: ${person.getName()}`);
    console.log(`Manager: ${manager}`);
    console.log(`Charge Code: ${chargeCode}`);
  }
}

// The Solution
// Create a new method in class A that delegates the call to object B. Now the client doesn't know about, or depend on, class B.

class PersonRefactored {
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

  // Hide Delegate - Create delegate methods to hide the department dependency
  getManager(): string {
    return this.department.getManager();
  }

  getChargeCode(): string {
    return this.department.getChargeCode();
  }
}

// Refactored Client - No longer needs to know about Department
class ClientRefactored {
  displayPersonInfo(person: PersonRefactored): void {
    // No message chains - direct calls to person
    const manager = person.getManager();
    const chargeCode = person.getChargeCode();
    
    console.log(`Person: ${person.getName()}`);
    console.log(`Manager: ${manager}`);
    console.log(`Charge Code: ${chargeCode}`);
  }
}

// Example usage
const department = new Department("John Smith", "DEV-001");
const person = new Person("Alice Johnson", department);
const personRefactored = new PersonRefactored("Alice Johnson", department);

const client = new Client();
const clientRefactored = new ClientRefactored();

console.log("=== Before Refactoring (Message Chains) ===");
client.displayPersonInfo(person);

console.log("\n=== After Refactoring (Hide Delegate) ===");
clientRefactored.displayPersonInfo(personRefactored);