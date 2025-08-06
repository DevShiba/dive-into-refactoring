// The Problem
// A method is used more in another class than in its own class.
// This method accesses the data of another object more than its own data.

class Customer {
  private name: string;
  private address: string;
  private phone: string;

  constructor(name: string, address: string, phone: string) {
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  getName(): string {
    return this.name;
  }

  getAddress(): string {
    return this.address;
  }

  getPhone(): string {
    return this.phone;
  }
}

class Order {
  private customer: Customer;
  private items: string[];
  private totalAmount: number;

  constructor(customer: Customer, items: string[], totalAmount: number) {
    this.customer = customer;
    this.items = items;
    this.totalAmount = totalAmount;
  }

  // FEATURE ENVY: This method is more interested in Customer data than Order data
  generateInvoice(): string {
    let invoice = "INVOICE\n";
    invoice += "========\n";
    invoice += `Customer: ${this.customer.getName()}\n`;
    invoice += `Address: ${this.customer.getAddress()}\n`;
    invoice += `Phone: ${this.customer.getPhone()}\n`;
    invoice += "--------\n";
    invoice += `Items: ${this.items.join(", ")}\n`;
    invoice += `Total: $${this.totalAmount}\n`;
    return invoice;
  }

  getItems(): string[] {
    return this.items;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getCustomer(): Customer {
    return this.customer;
  }
}

// Usage showing the problem
const customer = new Customer("John Doe", "123 Main St", "555-0123");
const order = new Order(customer, ["Laptop", "Mouse"], 1299.99);

console.log("Problem - Feature Envy:");
console.log(order.generateInvoice());

// The Solution
// Create a new method in the class that uses the method the most, then move code from the old method to there. 
// Turn the code of the original method into a reference to the new method in the other class or else remove it entirely.

class RefactoredCustomer {
  private name: string;
  private address: string;
  private phone: string;

  constructor(name: string, address: string, phone: string) {
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  getName(): string {
    return this.name;
  }

  getAddress(): string {
    return this.address;
  }

  getPhone(): string {
    return this.phone;
  }

  // MOVED: This method now belongs to Customer since it's mainly about customer info
  generateCustomerSection(): string {
    let section = "INVOICE\n";
    section += "========\n";
    section += `Customer: ${this.name}\n`;
    section += `Address: ${this.address}\n`;
    section += `Phone: ${this.phone}\n`;
    section += "--------\n";
    return section;
  }
}

class RefactoredOrder {
  private customer: RefactoredCustomer;
  private items: string[];
  private totalAmount: number;

  constructor(customer: RefactoredCustomer, items: string[], totalAmount: number) {
    this.customer = customer;
    this.items = items;
    this.totalAmount = totalAmount;
  }

  // FIXED: Now this method focuses on order-specific data and delegates customer info
  generateInvoice(): string {
    let invoice = this.customer.generateCustomerSection();
    invoice += `Items: ${this.items.join(", ")}\n`;
    invoice += `Total: $${this.totalAmount}\n`;
    return invoice;
  }

  getItems(): string[] {
    return this.items;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getCustomer(): RefactoredCustomer {
    return this.customer;
  }
}

// Usage after refactoring
const refactoredCustomer = new RefactoredCustomer("John Doe", "123 Main St", "555-0123");
const refactoredOrder = new RefactoredOrder(refactoredCustomer, ["Laptop", "Mouse"], 1299.99);

console.log("\nAfter Move Method refactoring:");
console.log(refactoredOrder.generateInvoice());

// Benefits:
// 1. Customer class now owns customer-related formatting logic
// 2. Order class focuses on order-specific concerns
// 3. Better separation of responsibilities
// 4. Customer formatting can be reused by other classes
