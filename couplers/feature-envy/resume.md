# Feature Envy

Feature Envy is recognized as a "code smell" in software, often categorized under "Couplers". A classic instance of Feature Envy occurs when a function in one module dedicates more time communicating with functions or data inside another module than it does within its own module.
This frequently manifests when a function calculates a value by invoking many getter methods—perhaps "half-a-dozen"—on a separate object to retrieve the necessary data.

## Refactoring Technique

### Move Method

```typescript
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
  private costumer: Costumer;
  private items: string[];
  private totalAmount: number;

  constructor(costumer: Costumer, items: string[], totalAmount: number) {
    this.costumer = costumer;
    this.items = items;
    this.totalAmount = totalAmount;
  }

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
```

Create a new method in the class that uses the method the most, then move code from the old method to there.

```typescript
class Costumer {
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

class Order {
  private costumer: Costumer;
  private items: string[];
  private totalAmount: number;

  constructor(
    customer: RefactoredCustomer,
    items: string[],
    totalAmount: number
  ) {
    this.customer = customer;
    this.items = items;
    this.totalAmount = totalAmount;
  }

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
}
```

## Why it's Problem?

Feature Envy presents problems because it indicates misplaced behavior and results in unwanted coupling:

- **Violation of Modularity and Encapsulation**: The goal o modularizing a program is to maximize internal interaction while minimizing interaction between different modules. Feature Envy violates this by showing that the logic naturally belongs with the data it is accessing so heavily.

- **Tight Coupling**: The existence of Feature Envy implies tight coupling between the modules involved. If a module frequently queries another object for data, the client module highly dependent on the structure and details of the data provider.

- **Symptom of Data Classes**: Feature Envy of arises as a consequence of the **Data Class** code smell. When a class acts a "dumb data holder" without containing significant behavior, the logic that should inherently belong to that data is instead scattered across other classes that excessively manipulate the Data Class in detail.

## When Not to Refactor

Refactoring Feature Envy is generally advisable to improve modularity and reduce coupling. However, there are scenarios where ignoring the smell or using alternative patterns is preferred.

- **Ambiguity of Ownership**: Not all instances of Feature Envy are "cut-and-dried". If a function utilizes features from several modules, determining where it should reside is challenging. The guiding heuristic here is to place the function with the module that possesses most of the data it requires.

- **Tradeoff against Divergent Change**: Sophisticated patterns, such as Strategy or Visitor (often used to combat Divergent Change), deliberately break the conventional rule against Feature Envy. These patterns isolate small amounts of varying behavior to make changes easier, trading the issue of Feature Envy for a benefit in maintainability, albeit at the cost of further indirection.
