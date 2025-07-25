// The Problem: Shotgun Surgery with Move Field
// Customer address information is scattered across multiple classes,
// making any address-related change require modifications in many places.

interface CustomerData {
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

// Problem: Address fields are scattered across different classes
class Customer {
  private name: string;
  private street: string; // This should be in Address class

  constructor(data: CustomerData) {
    this.name = data.name;
    this.street = data.street;
  }

  getName(): string {
    return this.name;
  }

  getStreet(): string {
    return this.street;
  }

  setStreet(street: string): void {
    this.street = street;
  }

  // Problem: Address logic scattered here
  getShortAddress(): string {
    return this.street;
  }
}

class Shipping {
  private city: string; // This should be in Address class
  private zipCode: string; // This should be in Address class

  constructor(data: CustomerData) {
    this.city = data.city;
    this.zipCode = data.zipCode;
  }

  getCity(): string {
    return this.city;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  setCity(city: string): void {
    this.city = city;
  }

  setZipCode(zipCode: string): void {
    this.zipCode = zipCode;
  }

  // Problem: Address logic scattered here too
  getShippingCode(): string {
    return `${this.city}-${this.zipCode}`;
  }
}

class Billing {
  private country: string; // This should be in Address class

  constructor(data: CustomerData) {
    this.country = data.country;
  }

  getCountry(): string {
    return this.country;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  // Problem: Address logic scattered here as well
  isTaxFree(): boolean {
    return this.country === "Tax Haven";
  }
}

// Usage example showing the problem
class OrderService {
  private customer: Customer;
  private shipping: Shipping;
  private billing: Billing;

  constructor(data: CustomerData) {
    this.customer = new Customer(data);
    this.shipping = new Shipping(data);
    this.billing = new Billing(data);
  }

  // Problem: To get full address, we need to access multiple objects
  getFullAddress(): string {
    return `${this.customer.getStreet()}, ${this.shipping.getCity()}, ${this.shipping.getZipCode()}, ${this.billing.getCountry()}`;
  }

  // Problem: To update address, we need to modify multiple objects
  updateAddress(street: string, city: string, zipCode: string, country: string): void {
    this.customer.setStreet(street);
    this.shipping.setCity(city);
    this.shipping.setZipCode(zipCode);
    this.billing.setCountry(country);
  }
}

// TODO: Your task is to refactor this code using Move Field technique
// 1. Create an Address class
// 2. Move all address-related fields (street, city, zipCode, country) to the Address class
// 3. Move all address-related methods to the Address class
// 4. Update the other classes to use the Address class instead of individual fields
// 5. Show how this eliminates shotgun surgery by centralizing address logic

// Example usage of the problematic code:
const customerData: CustomerData = {
  name: "John Doe",
  street: "123 Main St",
  city: "Springfield",
  zipCode: "12345",
  country: "USA",
};

const orderService = new OrderService(customerData);
console.log("Current address:", orderService.getFullAddress());

// This requires changes in multiple places - that's shotgun surgery!
orderService.updateAddress("456 Oak Ave", "Portland", "97201", "USA");
console.log("Updated address:", orderService.getFullAddress());

// The Solution
// Move all address-related fields to a single Address class using Move Field refactoring.

class Address {
  private street: string;
  private city: string;
  private zipCode: string;
  private country: string;

  constructor(street: string, city: string, zipCode: string, country: string) {
    this.street = street;
    this.city = city;
    this.zipCode = zipCode;
    this.country = country;
  }

  getStreet(): string {
    return this.street;
  }

  setStreet(street: string): void {
    this.street = street;
  }

  getCity(): string {
    return this.city;
  }

  setCity(city: string): void {
    this.city = city;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  setZipCode(zipCode: string): void {
    this.zipCode = zipCode;
  }

  getCountry(): string {
    return this.country;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.zipCode}, ${this.country}`;
  }

  getShortAddress(): string {
    return this.street;
  }

  getShippingCode(): string {
    return `${this.city}-${this.zipCode}`;
  }

  isTaxFree(): boolean {
    return this.country === "Tax Haven";
  }

  updateAddress(street: string, city: string, zipCode: string, country: string): void {
    this.street = street;
    this.city = city;
    this.zipCode = zipCode;
    this.country = country;
  }
}

class RefactoredCustomer {
  private name: string;
  private address: Address;

  constructor(data: CustomerData) {
    this.name = data.name;
    this.address = new Address(data.street, data.city, data.zipCode, data.country);
  }

  getName(): string {
    return this.name;
  }

  getAddress(): Address {
    return this.address;
  }

  getShortAddress(): string {
    return this.address.getShortAddress();
  }
}

class RefactoredShipping {
  private address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  getShippingCode(): string {
    return this.address.getShippingCode();
  }
}

class RefactoredBilling {
  private address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  isTaxFree(): boolean {
    return this.address.isTaxFree();
  }
}

class RefactoredOrderService {
  private customer: RefactoredCustomer;
  private shipping: RefactoredShipping;
  private billing: RefactoredBilling;

  constructor(data: CustomerData) {
    this.customer = new RefactoredCustomer(data);
    this.shipping = new RefactoredShipping(this.customer.getAddress());
    this.billing = new RefactoredBilling(this.customer.getAddress());
  }

  getFullAddress(): string {
    return this.customer.getAddress().getFullAddress();
  }

  updateAddress(street: string, city: string, zipCode: string, country: string): void {
    this.customer.getAddress().updateAddress(street, city, zipCode, country);
  }
}

// Example
const refactoredOrderService = new RefactoredOrderService(customerData);
console.log("Refactored address:", refactoredOrderService.getFullAddress());

refactoredOrderService.updateAddress("456 Oak Ave", "Portland", "97201", "USA");
console.log("Refactored updated:", refactoredOrderService.getFullAddress());



