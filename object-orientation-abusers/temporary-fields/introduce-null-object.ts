// The Problem
// Since some methods return null instead of real objects, you have many checks for null in your code.

interface Plan {
  getName(): string;
  getPrice(): number;
  getFeatures(): string[];
}

class BillingPlan implements Plan {
  constructor(
    private name: string,
    private price: number,
    private features: string[]
  ) {}

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getFeatures(): string[] {
    return this.features;
  }

  static Basic(): Plan {
    return new BillingPlan("Basic", 10, ["Feature A", "Feature B"]);
  }
}

interface Customer {
  getName(): string;
  getEmail(): string;
  getPlan(): Plan;
  isNull(): boolean;
}

class RegularCustomer implements Customer {
  constructor(
    private name: string,
    private email: string,
    private plan: Plan
  ) {}

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPlan(): Plan {
    return this.plan;
  }

  isNull(): boolean {
    return false;
  }
}

class Order {
  constructor(public customer: Customer | null = null) {}

  calculateTotal(): number {
    let plan: Plan;

    if (this.customer == null) {
      plan = BillingPlan.Basic();
    }

    plan = this.customer.getPlan();

    return plan.getPrice();
  }

  getCustomerInfo(): string {
    if (this.customer == null || this.customer.isNull()) {
      return "No customer information available.";
    }

    return `${this.customer.getName()} (${this.customer.getEmail()})`;
  }

  getFeatures(): string[] {
    if (this.customer == null) {
      return BillingPlan.Basic().getFeatures();
    }

    return this.customer.getPlan().getFeatures();
  }
}

// The Solution
// Instead of null, return a null object that exhibits the default behavior.

class NullPlan implements Plan {
  getName(): string {
    return "No Plan";
  }

  getPrice(): number {
    return 0;
  }

  getFeatures(): string[] {
    return ["No features available"];
  }
}

class NullCustomer implements Customer {
  getName(): string {
    return "Guest";
  }

  getEmail(): string {
    return "guest@example.com";
  }

  getPlan(): Plan {
    return new NullPlan();
  }

  isNull(): boolean {
    return true;
  }
}

class RefactoredOrder {
  private customer: Customer;

  constructor(customer: Customer | null = null) {
    this.customer = customer ?? new NullCustomer();
  }

  calculateTotal(): number {
    const plan = this.customer.getPlan();
    return plan.getPrice();
  }

  getCustomerInfo(): string {
    return `${this.customer.getName()} (${this.customer.getEmail()})`;
  }

  getFeatures(): string[] {
    return this.customer.getPlan().getFeatures();
  }

  sendNotification(): void {
    if (this.customer.isNull()) {
      console.log("Skipping notification for guest customer");
    }

    console.log(`Sending notification to ${this.customer.getEmail()}`);
  }
}

// Usage example
console.log("=== Before Refactoring (with null checks) ===");

const orderWithCustomer = new Order(
  new RegularCustomer(
    "John Doe",
    "john@example.com",
    new BillingPlan("Premium", 29.99, ["Priority support", "Advanced features"])
  )
);

const orderWithoutCustomer = new Order(null);

console.log("Order with customer:");
console.log("- Total:", orderWithCustomer.calculateTotal());
console.log("- Info:", orderWithCustomer.getCustomerInfo());
console.log("- Features:", orderWithCustomer.getFeatures());

console.log("\nOrder without customer:");
console.log("- Total:", orderWithoutCustomer.calculateTotal());
console.log("- Info:", orderWithoutCustomer.getCustomerInfo());
console.log("- Features:", orderWithoutCustomer.getFeatures());

console.log("\n=== After Refactoring (with Null Object) ===");

const refactoredOrderWithCustomer = new RefactoredOrder(
  new RegularCustomer(
    "Jane Smith",
    "jane@example.com",
    new BillingPlan("Premium", 29.99, ["Priority support", "Advanced features"])
  )
);

const refactoredOrderWithoutCustomer = new RefactoredOrder(null);

console.log("Refactored order with customer:");
console.log("- Total:", refactoredOrderWithCustomer.calculateTotal());
console.log("- Info:", refactoredOrderWithCustomer.getCustomerInfo());
console.log("- Features:", refactoredOrderWithCustomer.getFeatures());
refactoredOrderWithCustomer.sendNotification();

console.log("\nRefactored order without customer:");
console.log("- Total:", refactoredOrderWithoutCustomer.calculateTotal());
console.log("- Info:", refactoredOrderWithoutCustomer.getCustomerInfo());
console.log("- Features:", refactoredOrderWithoutCustomer.getFeatures());
refactoredOrderWithoutCustomer.sendNotification();
