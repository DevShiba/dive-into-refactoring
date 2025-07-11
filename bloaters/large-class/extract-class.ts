// The Problem
// When one class does the work of two, awkwardness results.

class Person {
  name: string = "";
  officeAreaCode: string = "";
  officeNumber: string = "";

  getTelephoneNumber(): string {
    return `${this.officeAreaCode} ${this.officeNumber}`;
  }
}

// The Solution
// Instead, create a new class and place the fields and methods responsible for the relevant functionality in it.
class TelephoneNumber {
  officeAreaCode: string = "";
  officeNumber: string = "";

  constructor(areaCode?: string, number?: string) {
    if (areaCode) this.officeAreaCode = areaCode;
    if (number) this.officeNumber = number;
  }

  getTelephoneNumber(): string {
    return `${this.officeAreaCode} ${this.officeNumber}`;
  }

  setAreaCode(areaCode: string): void {
    this.officeAreaCode = areaCode;
  }

  setNumber(number: string): void {
    this.officeNumber = number;
  }
}

class RefactoredPerson {
  name: string = "";
  private telephoneNumber: TelephoneNumber = new TelephoneNumber();

  constructor(name?: string, areaCode?: string, number?: string) {
    if (name) this.name = name;
    if (areaCode || number) {
      this.telephoneNumber = new TelephoneNumber(areaCode, number);
    }
  }

  getTelephoneNumber(): string {
    return this.telephoneNumber.getTelephoneNumber();
  }

  setTelephoneNumber(areaCode: string, number: string): void {
    this.telephoneNumber.setAreaCode(areaCode);
    this.telephoneNumber.setNumber(number);
  }
}

// Usage example
const person = new RefactoredPerson("John Doe", "555", "123-4567");
console.log(`${person.name}: ${person.getTelephoneNumber()}`);
