# Lazy Class

A Lazy Class (also referred to as a Lazy Element) is a program element, such as a class or function, that provides insufficient justification for its existence or specialized structure. This often occurs when the element was expected to grow and become popular later but never did, or when it used to pull its weight but has since been downsized by refactoring, leaving little functionality behind. A Lazy Class might manifest as a function whose body is as clear as its name, or a class that essentially consists of just one simple function.

## Why it's a Problem?

- **Obscures Design**: Unused code elements, even a few lines are significant burden when trying to understand how the software works, as a programmers must spend time analyzing what the element does and why changing it appears to have no effect.

- **Need for Structure is Missing**: A key purpose of short functions is to improve clarity. However, if the body of a function is a clear as its name, the resulting indirection becomes needless and irritating.

- **Needless Indirection**: Developers typically use program elements like classes and functions to add valuable structure, such as enabling reuse, variation, or providing intention-revealing names. When this structure is not needed, the element becomes a Lazy Class.

- **Increased Maintenance Burden (Speculative Generality)**: Lazy Classes often stem from over-engineering, the practice of adding functionality "just in case" it might be needed in the future (the YAGNI principle violation). This is related to the code smell **Speculative Generality**. Such unused or unnecessary machinery adds unnecessary complexity because it needs to be documented, tested, and maintained, even though it provides no required functionality.

## Refactoring Technique

### Inline Class

```typescript
// Before: A class that is not doing enough to be worth its own existence.
class OrderInfo {
  private orderId: string;

  constructor(orderId: string) {
    this.orderId = orderId;
  }

  getOrderId(): string {
    return this.orderId;
  }
}

class Order {
  private orderInfo: OrderInfo;
  private items: string[];
  private totalAmount: number;

  constructor(orderId: string, items: string[], totalAmount: number) {
    this.orderInfo = new OrderInfo(orderId);
    this.items = items;
    this.totalAmount = totalAmount;
  }

  getOrderId(): string {
    return this.orderInfo.getOrderId();
  }

  getItems(): string[] {
    return this.items;
  }

  displayOrderSummary(): string {
    return `Order ${this.getOrderId()}: ${this.items.length} items, Total: $${
      this.totalAmount
    }`;
n  }
}
```

**Code Issue**:
The `OrderInfo` class is a **Lazy Class**. It provides very little functionality on its own, only holding the `orderId` and providing a getter. This adds unnecessary complexity and indirection, as the `Order` class has to go through `OrderInfo` just to access the ID.

```typescript
// After: The functionality of the lazy class is moved into the primary class.
class Order {
  private orderId: string;
  private items: string[];
  private totalAmount: number;

  constructor(orderId: string, items: string[], totalAmount: number) {
    this.orderId = orderId;
    this.items = items;
    this.totalAmount = totalAmount;
  }

  getOrderId(): string {
    return this.orderId;
  }

  getItems(): string[] {
    return this.items;
  }

  displayOrderSummary(): string {
    return `Order ${this.orderId}: ${this.items.length} items, Total: $${this.totalAmount}`;
  }
}
```

**Benefits**:

- **Simplicity and Reduced Complexity**: By inlining the `OrderInfo` class, the design is simplified. There is one less class to understand and maintain.
- **Removes Needless Indirection**: The `Order` class can now access the `orderId` directly, making the code more straightforward and easier to read.
- **Improved Cohesion**: The `orderId`, which is an essential part of an `Order`, is now directly within the `Order` class, improving its cohesion.

_For detailed code examples, see the files in this folder._

## When Not to Refactor

- **In cases of Inheritance**: For unnecessary inheritance structures, the refactoring **Collapse Hierarchy** can be used to merge th subclass into the superclass.

- **When Rewriting is More Efficient**: If the code is already a mess, the complexity of refactoring it might outweigh the benefits. In such cases, rewriting the relevant code entirely may e more practical.

- **When the Element Adds Conceptual Clarity (Explanation)**: Although a function may be simple, if it serves to explain the intention of a block of code, it may be beneficial to keep it. For instance, a heuristic suggests writing a function instead of commenting something, naming the function after the code's intention, even if the method call is longer than the code it replaces.

- **When Structure is Maintained for Polymorphism or Future Variation**: If the element (like an abstract superclass) is integral to a hierarchy that supports substitution, or if its existence is required for anticipated variation, reuse, or helpful naming structure, consolidation should be approached cautiously.
