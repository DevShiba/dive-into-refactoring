# Dead Code

Dead Code is listed as one of the code smells categorized as dispensables too. This smell refers to code that is no longer used and does not contribute to the system's execution. Although a few unused lines of code typically do not slow down systems or take up significant memory, especially since compilers often instinctively remove them, the presence of dead code still imposes a significant burden on a human understanding.

## Why it's a Problem?

- **Significant Burden to Understanding**: Dead code constitutes a significant burden when developers try to understand how the software works. Because the code carries no warning signs indicating that it is never called anymore, programmers must spend time analyzing what the code is doing and why changing it does not seem to affect the system's output.

- **Source of Speculative Generality**: Dead code is often a residue of **Speculative Generality**, which occurs when developers add unnecessary hooks and special cases to handle future, unrequired variations. If this machinery is not used, it just gets in the way and makes the system harder to understand and maintain.

- **Wasted Maintenance Effort**: If code is found where its only users are test cases, it indicates speculative generality, and that code should be removed using **Remove Dead Code** technique.

## Refactoring Technique

### Collapse Hierarchy

```typescript
// Before: A subclass that adds no new functionality.
abstract class Vehicle {
  protected brand: string;
  protected model: string;
  protected year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo(): string {
    return `${this.year} ${this.brand} ${this.model}`;
  }

  abstract getType(): string;
}

class Car extends Vehicle {
  constructor(brand: string, model: string, year: number) {
    super(brand, model, year);
  }

  getType(): string {
    return "Car";
  }
}

class Sedan extends Car {
  constructor(brand: string, model: string, year: number) {
    super(brand, model, year);
  }

  // This subclass adds no meaningful functionality
}
```

**Code Issue**:
The `Sedan` class is an example of dead code because it extends `Car` but adds no new fields, methods, or logic. It's an empty subclass that complicates the hierarchy without providing any value, making the system harder to understand and maintain.

```typescript
// After: The unnecessary subclass is removed.
abstract class Vehicle {
  protected brand: string;
  protected model: string;
  protected year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo(): string {
    return `${this.year} ${this.brand} ${this.model}`;
  }

  abstract getType(): string;
}

class Car extends Vehicle {
  private maxSpeed?: number;

  constructor(brand: string, model: string, year: number, maxSpeed?: number) {
    super(brand, model, year);
    this.maxSpeed = maxSpeed;
  }

  getType(): string {
    return "Car";
  }

  getMaxSpeed(): number | undefined {
    return this.maxSpeed;
  }
}

class Truck extends Vehicle {
  private payloadCapacity: number;

  constructor(
    brand: string,
    model: string,
    year: number,
    payloadCapacity: number
  ) {
    super(brand, model, year);
    this.payloadCapacity = payloadCapacity;
  }

  getType(): string {
    return "Truck";
  }

  getPayloadCapacity(): number {
    return this.payloadCapacity;
  }
}
```

**Benefits**:

- **Simplified Design**: Removing the redundant `Sedan` class simplifies the class hierarchy, making the overall design cleaner and easier to grasp.
- **Reduced Complexity**: Fewer classes mean less code to maintain and understand, which reduces cognitive load on developers.
- **Improved Maintainability**: With a flatter hierarchy, changes are more straightforward to implement, and there's less risk of introducing bugs.

_For detailed code examples, see the files in this folder._

## When Not to Refactor

- **Immediate Deletion is Preferred:**: Once code is not used anymore, it should be deleted. Developers do not need to worry about requiring the code in future because it always be dug out again from the version control system.

- **Complexity Outweighs Benefit**: The decision to refactor or delete often requires good judgment and experience. If the complexity of removing a section of dead code (perhaps due to unexpected dependencies in a deeply tangled legacy system) outweighs the benefit of its removal, sometimes developers might choose to delay action. In some scenarios, the complexity of refactoring/deleting might even lead to the conclusion that it is more practical to rewrite the relevant code entirely at a later date.