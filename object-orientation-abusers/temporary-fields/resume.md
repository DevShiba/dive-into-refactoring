# Temporary Field

The Temporary Field is identified as a code smell in software development, categorized under **Object-Orientation Abusers**. This smell occurs when a class contains a field that is set and used only under certain specific circumstances. This field is sometimes referred to as a "poor orphan variable".

## Why it's a Problem

The use of Temporary Fields complicates design and maintenance because it violates fundamental expectations about object behavior.

- **Misleading Design**: Developers expect an object to utilize all of its fields consistently throughout its lifecycle. When a field is only set in a specific contexts, it makes the code difficult to understand.

- **Confusion and Cognitive Load**: Trying to figure out why a field is present when it appears unused can be frustrating for a reader. This adds unnecessary complexity and obscurity to the system.

- **Indication of Low Cohesion**: This smell often indicates that the class is taking on multiple, loosely related responsibilities, a characteristic that can lead to chaos and increase complexity in a large classes.

## Refactoring Techniques

### Extract Class

```typescript
class Order {
  private items: OrderItem[] = [];
  private customerType: string = "";

  private discountPercentage: number = 0;
  private minimumAmount: number = 0;
  private volumeThreshold: number = 0;
  private isEligibleForDiscount: boolean = false;

  constructor(customerType: string) {
    this.customerType = customerType;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  calculateTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.getPrice(), 0);

    this.setupDiscountParameters();
    this.checkDiscountEligibility(subtotal);

    let total = subtotal;
    if (this.isEligibleForDiscount) {
      total = subtotal * (1 - this.discountPercentage / 100);
    }

    this.clearTemporaryFields();

    return total;
  }

  private setupDiscountParameters(): void {
    switch (this.customerType) {
      case "PREMIUM":
        this.discountPercentage = 10;
        this.minimumAmount = 200;
        this.volumeThreshold = 3;
        break;
      case "REGULAR":
        this.discountPercentage = 5;
        this.minimumAmount = 300;
        this.volumeThreshold = 10;
        break;
      default:
        this.discountPercentage = 0;
        this.minimumAmount = 0;
        this.volumeThreshold = 0;
    }
  }

  private checkDiscountEligibility(subtotal: number): void {
    this.isEligibleForDiscount =
      subtotal >= this.minimumAmount &&
      this.items.length >= this.volumeThreshold;
  }

  private clearTemporaryFields(): void {
    this.discountPercentage = 0;
    this.minimumAmount = 0;
    this.volumeThreshold = 0;
    this.isEligibleForDiscount = false;
  }
}

class OrderItem {
  constructor(private name: string, private price: number) {}

  getPrice(): number {
    return this.price;
  }

  getName(): string {
    return this.name;
  }
}
```

```typescript
class DiscountCalculator {
  private discountPercentage: number = 0;
  private minimumAmount: number = 0;
  private volumeThreshold: number = 0;

  constructor(customerType: string) {
    this.setupDiscountParameters(customerType);
  }

  calculateDiscount(subtotal: number, itemCount: number): number {
    if (this.isEligibleForDiscount(subtotal, itemCount)) {
      return subtotal * (this.discountPercentage / 100);
    }
    return 0;
  }

  private setupDiscountParameters(customerType: string): void {
    switch (customerType) {
      case "PREMIUM":
        this.discountPercentage = 10;
        this.minimumAmount = 200;
        this.volumeThreshold = 3;
        break;
      case "REGULAR":
        this.discountPercentage = 5;
        this.minimumAmount = 300;
        this.volumeThreshold = 10;
        break;
      default:
        this.discountPercentage = 0;
        this.minimumAmount = 0;
        this.volumeThreshold = 0;
    }
  }

  private isEligibleForDiscount(subtotal: number, itemCount: number): boolean {
    return subtotal >= this.minimumAmount && itemCount >= this.volumeThreshold;
  }
}

class Order {
  private items: OrderItem[] = [];
  private customerType: string = "";

  constructor(customerType: string) {
    this.customerType = customerType;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  calculateTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.getPrice(), 0);

    const discountCalculator = new DiscountCalculator(this.customerType);
    const discount = discountCalculator.calculateDiscount(
      subtotal,
      this.items.length
    );

    return subtotal - discount;
  }
}
```

### Introduce Null Object

```typescript
interface Plan {
  getName(): string;
  getPrice(): number;
  getFeatures(): string[];
}

interface Custumer {
  getName(): string;
  getEmail(): string;
  getPlan(): Plan;
  isNull(): boolean;
}

class BillingPlan implements Plan {
  constructor(
    private name: string,
    private price: number;
    private features: string[]
  ){}

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

    if(this.customer == null){
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
```

```typescript
interface Plan {
  getName(): string;
  getPrice(): number;
  getFeatures(): string[];
}

interface Custumer {
  getName(): string;
  getEmail(): string;
  getPlan(): Plan;
  isNull(): boolean;
}

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
}
```

## When Not to Refactor

While the presence of Temporary Field signals potential to trouble that can be solved by refactoring, there are general contexts in which addressing it immediately may be avoided:

- **Code Stability**: If the section of code containing the Temporary Field is a mess but does not needed to be modified, there is no immediate benefit in refactoring it. Refactoring provides value when the code needs to be understood or changed.

- **Efficiency Trade-off**: If it is determined that the time and effort required to refactor the complex code surrounding the Temporary Field would be greater than rewriting it, rewriting may be chosen instead. This choice requires experienced judgment.

- **Performance Tuning**: Though generally addressed through other refactorings, if a performance issue is significant, optimizing the code might temporarily take precedence over cleaning the design, although tuning the performance of a well-factored codebase is generally easier.
