// The Problem
// You have a data class with public fields that can be directly accessed and modified.
// This leads to lack of validation, no encapsulation, and potential data corruption.

class Customer {
  public firstName: string;
  public lastName: string;
  public email: string;
  public age: number;
  public phoneNumber: string;
  public creditScore: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    phoneNumber: string,
    creditScore: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.age = age;
    this.phoneNumber = phoneNumber;
    this.creditScore = creditScore;
  }
}

// Usage example showing the problems
const customer = new Customer(
  "John",
  "Doe",
  "john.doe@email.com",
  30,
  "555-1234",
  750
);

// Problems with direct field access:
customer.age = -5; // Invalid age - no validation
customer.email = "invalid-email"; // Invalid email format - no validation
customer.creditScore = 1000; // Invalid credit score (should be 300-850) - no validation
customer.firstName = ""; // Empty name - no validation

console.log("Problems with data class:");
console.log(`Customer: ${customer.firstName} ${customer.lastName}`);
console.log(`Email: ${customer.email}, Age: ${customer.age}`);
console.log(`Credit Score: ${customer.creditScore}`);

// The Solution
// Use Encapsulate Field to hide direct access and add validation through getters and setters.

class RefactoredCustomer {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _age: number;
  private _phoneNumber: string;
  private _creditScore: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    phoneNumber: string,
    creditScore: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.age = age;
    this.phoneNumber = phoneNumber;
    this.creditScore = creditScore;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("First name cannot be empty");
    }
    if (value.length > 50) {
      throw new Error("First name cannot exceed 50 characters");
    }
    this._firstName = value.trim();
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Last name cannot be empty");
    }
    if (value.length > 50) {
      throw new Error("Last name cannot exceed 50 characters");
    }
    this._lastName = value.trim();
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Invalid email format");
    }
    this._email = value.toLowerCase();
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0 || value > 150) {
      throw new Error("Age must be between 0 and 150");
    }
    this._age = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    const phoneRegex = /^\d{3}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      throw new Error("Phone number must be in format XXX-XXXX");
    }
    this._phoneNumber = value;
  }

  get creditScore(): number {
    return this._creditScore;
  }

  set creditScore(value: number) {
    if (value < 300 || value > 850) {
      throw new Error("Credit score must be between 300 and 850");
    }
    this._creditScore = value;
  }

  // Additional methods that can operate on the encapsulated data
  getFullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  getCreditRating(): string {
    if (this._creditScore >= 750) return "Excellent";
    if (this._creditScore >= 700) return "Good";
    if (this._creditScore >= 650) return "Fair";
    return "Poor";
  }

  isEligibleForLoan(): boolean {
    return this._creditScore >= 650 && this._age >= 18;
  }

  updateContactInfo(email: string, phoneNumber: string): void {
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
}

// Usage example 
const validCustomer = new RefactoredCustomer(
  "Jane",
  "Smith",
  "jane.smith@email.com",
  25,
  "555-9876",
  780
);

console.log("\nBenefits of encapsulated fields:");
console.log(`Customer: ${validCustomer.getFullName()}`);
console.log(`Email: ${validCustomer.email}, Age: ${validCustomer.age}`);
console.log(`Credit Rating: ${validCustomer.getCreditRating()}`);
console.log(`Eligible for loan: ${validCustomer.isEligibleForLoan()}`);

// Validation now prevents invalid data
try {
  validCustomer.age = -5;
} catch (error) {
  console.log(`Validation prevented invalid age: ${error.message}`);
}

try {
  validCustomer.email = "invalid-email";
} catch (error) {
  console.log(`Validation prevented invalid email: ${error.message}`);
}

try {
  validCustomer.creditScore = 1000;
} catch (error) {
  console.log(`Validation prevented invalid credit score: ${error.message}`);
}