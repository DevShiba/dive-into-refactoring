// The Problem
// Divergent Change: When adding a new product type, you have to change many unrelated methods.
// Multiple classes have common functionality causing changes to ripple across many places.

// === BEFORE: Divergent Change - Adding new product types requires changing many methods ===

class PhysicalProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public weight: number,
    public dimensions: { length: number; width: number; height: number }
  ) {}

  // Common product operations - duplicated across product types
  calculateTax(): number {
    return this.price * 0.1; // 10% tax
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  getDisplayInfo(): string {
    return `${this.name} - $${this.price}`;
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  // Physical product specific
  calculateShippingCost(): number {
    const volumeWeight = (this.dimensions.length * this.dimensions.width * this.dimensions.height) / 5000;
    return Math.max(this.weight, volumeWeight) * 2.5;
  }

  canShipTo(country: string): boolean {
    const restrictedCountries = ['Country1', 'Country2'];
    return !restrictedCountries.includes(country);
  }
}

class DigitalProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public fileSize: number,
    public downloadFormat: string
  ) {}

  // Common product operations - DUPLICATED
  calculateTax(): number {
    return this.price * 0.1; // 10% tax
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  getDisplayInfo(): string {
    return `${this.name} - $${this.price}`;
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  // Digital product specific
  generateDownloadLink(): string {
    return `https://downloads.example.com/${this.id}.${this.downloadFormat}`;
  }

  getFileInfo(): string {
    return `${this.fileSize}MB ${this.downloadFormat.toUpperCase()} file`;
  }
}

class SubscriptionProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public billingCycle: 'monthly' | 'yearly',
    public features: string[]
  ) {}

  // Common product operations - DUPLICATED
  calculateTax(): number {
    return this.price * 0.1; // 10% tax
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  getDisplayInfo(): string {
    return `${this.name} - $${this.price}`;
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  // Subscription product specific
  getNextBillingDate(): Date {
    const now = new Date();
    if (this.billingCycle === 'monthly') {
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  }

  listFeatures(): string {
    return this.features.join(', ');
  }
}

// The Solution
// Extract common functionality into a superclass to eliminate divergent change.

// === AFTER: Extract Superclass - Common functionality centralized ===

abstract class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number
  ) {}

  // Common product operations - centralized in superclass
  calculateTax(): number {
    return this.price * 0.1; // 10% tax
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  getDisplayInfo(): string {
    return `${this.name} - $${this.price} (${this.getProductType()})`;
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  // Common business logic
  calculateFinalPrice(discountPercentage: number = 0): number {
    const discountedPrice = this.applyDiscount(discountPercentage);
    return discountedPrice + this.calculateTax();
  }

  // Template method - subclasses define their type
  abstract getProductType(): string;

  // Template method - subclasses can override
  getDescription(): string {
    return `${this.getProductType()}: ${this.name}`;
  }
}

class ImprovedPhysicalProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public weight: number,
    public dimensions: { length: number; width: number; height: number }
  ) {
    super(id, name, price);
  }

  getProductType(): string {
    return "Physical Product";
  }

  calculateShippingCost(): number {
    const volumeWeight = (this.dimensions.length * this.dimensions.width * this.dimensions.height) / 5000;
    return Math.max(this.weight, volumeWeight) * 2.5;
  }

  canShipTo(country: string): boolean {
    const restrictedCountries = ['Country1', 'Country2'];
    return !restrictedCountries.includes(country);
  }

  getDescription(): string {
    return `${super.getDescription()} - Weight: ${this.weight}kg`;
  }
}

class ImprovedDigitalProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public fileSize: number,
    public downloadFormat: string
  ) {
    super(id, name, price);
  }

  getProductType(): string {
    return "Digital Product";
  }

  generateDownloadLink(): string {
    return `https://downloads.example.com/${this.id}.${this.downloadFormat}`;
  }

  getFileInfo(): string {
    return `${this.fileSize}MB ${this.downloadFormat.toUpperCase()} file`;
  }

  getDescription(): string {
    return `${super.getDescription()} - ${this.getFileInfo()}`;
  }
}

class ImprovedSubscriptionProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public billingCycle: 'monthly' | 'yearly',
    public features: string[]
  ) {
    super(id, name, price);
  }

  getProductType(): string {
    return "Subscription Product";
  }

  getNextBillingDate(): Date {
    const now = new Date();
    if (this.billingCycle === 'monthly') {
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  }

  listFeatures(): string {
    return this.features.join(', ');
  }

  getDescription(): string {
    return `${super.getDescription()} - ${this.billingCycle} billing`;
  }
}

// === USAGE EXAMPLE ===

console.log("=== Before Extract Superclass ===");
console.log("Problem: Adding new product types requires changing many methods");

const physicalProduct = new PhysicalProduct("P001", "Laptop", 999.99, 2.5, { length: 30, width: 20, height: 3 });
const digitalProduct = new DigitalProduct("D001", "E-book", 19.99, 15, "pdf");
const subscriptionProduct = new SubscriptionProduct("S001", "Premium Plan", 29.99, "monthly", ["Feature A", "Feature B"]);

console.log("Physical Product Tax:", physicalProduct.calculateTax());
console.log("Digital Product Tax:", digitalProduct.calculateTax());
console.log("Subscription Product Tax:", subscriptionProduct.calculateTax());

console.log("\n=== After Extract Superclass ===");
console.log("Solution: Common functionality centralized, easy to extend");

const improvedPhysical = new ImprovedPhysicalProduct("P001", "Laptop", 999.99, 2.5, { length: 30, width: 20, height: 3 });
const improvedDigital = new ImprovedDigitalProduct("D001", "E-book", 19.99, 15, "pdf");
const improvedSubscription = new ImprovedSubscriptionProduct("S001", "Premium Plan", 29.99, "monthly", ["Feature A", "Feature B"]);

// Now we can treat all products polymorphically
const products: Product[] = [improvedPhysical, improvedDigital, improvedSubscription];

console.log("=== Polymorphic Operations ===");
products.forEach(product => {
  console.log(product.getDisplayInfo());
  console.log(`Tax: $${product.calculateTax().toFixed(2)}`);
  console.log(`Final Price (10% discount): $${product.calculateFinalPrice(10).toFixed(2)}`);
  console.log(`Description: ${product.getDescription()}`);
  console.log("---");
});

// Adding a new product type is now easier - only need to extend Product
class ServiceProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public duration: number,
    public serviceType: string
  ) {
    super(id, name, price);
  }

  getProductType(): string {
    return "Service Product";
  }

  getServiceDuration(): string {
    return `${this.duration} hours of ${this.serviceType}`;
  }

  getDescription(): string {
    return `${super.getDescription()} - ${this.getServiceDuration()}`;
  }
}

console.log("=== New Product Type Added ===");
const serviceProduct = new ServiceProduct("SV001", "Consultation", 150, 2, "business consulting");
console.log(serviceProduct.getDisplayInfo());
console.log(`Tax: $${serviceProduct.calculateTax().toFixed(2)}`);
console.log(`Description: ${serviceProduct.getDescription()}`);