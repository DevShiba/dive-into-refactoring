// The Problem
// A class (or group of classes) contains a data field. The field has its own behavior and associated data.
class SomeOrder {
  customerName: string = "";
  customerEmail: string = "";
  customerPhone: string = "";
  itemPrice: number = 0.0;

  constructor(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    itemPrice: number
  ) {
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.customerPhone = customerPhone;
    this.itemPrice = itemPrice;
  }

  getCustomerInfo(): string {
    return `${this.customerName} (${this.customerEmail}, ${this.customerPhone})`;
  }

  getDetails(): string {
    return `Customer: ${this.getCustomerInfo()}, Item Price: ${this.itemPrice}`;
  }

  isVipCustomer(): boolean {
    // Simple VIP logic based on email domain
    return this.customerEmail.endsWith("@vip.com");
  }
}

// The Solution
// Create a new class, place the old field and its behavior in the class, and store the object of the class in the original class.
class RefactoredSomeOrder {
  customer: Customer;
  itemPrice: number = 0.0;

  constructor(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    itemPrice: number
  ) {
    this.customer = new Customer(customerName, customerEmail, customerPhone);
    this.itemPrice = itemPrice;
  }

  getDetails(): string {
    return `Customer: ${this.customer.getInfo()}, Item Price: ${
      this.itemPrice
    }`;
  }

  isVipOrder(): boolean {
    return this.customer.isVip();
  }
}

class Customer {
  name: string = "";
  email: string = "";
  phone: string = "";

  constructor(name: string, email: string, phone: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  getInfo(): string {
    return `${this.name} (${this.email}, ${this.phone})`;
  }

  isVip(): boolean {
    return this.email.endsWith("@vip.com");
  }

  getFormattedPhone(): string {
    // Add phone formatting behavior
    return this.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
}

// Usage example
const order1 = new SomeOrder("John Doe", "john@vip.com", "1234567890", 150.0);
console.log("Original:", order1.getDetails());
console.log("Is VIP:", order1.isVipCustomer());

const order2 = new RefactoredSomeOrder(
  "John Doe",
  "john@vip.com",
  "1234567890",
  150.0
);
console.log("Refactored:", order2.getDetails());
console.log("Is VIP Order:", order2.isVipOrder());
console.log("Formatted Phone:", order2.customer.getFormattedPhone());
