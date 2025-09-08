# Primitive Obsession

Occurs when programmers rely excessively on primitive data types (like integers, floating-point numbers, and strings) to represent domain-specific concepts that would be better served by their own dedicated types or objects

## Why it's a Problem

- **Lack of Domain Clarity**: Simple primitive items may not be sufficient as development progresses, as they often require special behavior (e.g., specific formatting for a telephone number). Without dedicated types, the code does not explicitly communicate the meaning or context of the data. For instance, AddUserToGroup(string, string) is unclear about which string represents the group name and which the user name. Using strong types, like Add(User("alice"), Group("root-users")), makes the code more self-documenting and less prone to errors.

- **"Stringly Typed" Variables**: Strings are particularly common for this issue, where concepts like a telephone number are represented as mere collections of characters rather than as a type that encapsulates display logic, area code extraction, or validation. This widespread practice is often referred to as using "stringly typed" variables.

- **Duplication of Logic**: When primitive types are used for domain concepts, logic specific to that concept (e.g., formatting a telephone number, calculating interest, or validating a range) often gets duplicated across the codebase. This creates extra effort when changes are required, as all instances of duplicated logic must be located and updated consistently.

- **Increased Complexity and Reduced Readability**: The absence of dedicated types forces complex logic into conditional statements or spreads it across various functions, making the code harder to read and understand. This can lead to a difficult-to-understand type hierarchy and unnecessarily convoluted logic.

- **Rigidity to Change**: Relying on primitives where rich objects are needed results in rigid software that is difficult to change. If the behavior or representation of a concept needs to evolve, extensive modifications are required across all places where the primitive is used, often leading to a problem known as "shotgun surgery".

## Refactoring Techniques

### Introduce Parameter Object

Replaces a group of parameters that frequently appear together with a single object, reducing method signature complexity and improving readability.

```typescript
class OrderService {
  calculateShippingCost(
    weight: number,
    length: number,
    width: number,
    height: number,
    zipCode: string,
    country: string,
    isExpress: boolean
  ): number {
    const volume = length * width * height;
    const baseRate = this.getBaseRate(country, zipCode);
    const weightMultiplier = weight * 0.5;
    const volumeMultiplier = volume * 0.001;
    const expressMultiplier = isExpress ? 2 : 1;

    return (baseRate + weightMultiplier + volumeMultiplier) * expressMultiplier;
  }

  validatePackage(
    weight: number,
    length: number,
    width: number,
    height: number,
    zipCode: string,
    country: string,
    isExpress: boolean
  ): boolean {
    if (weight > 50) return false;
    if (length > 100 || width > 100 || height > 100) return false;
    if (!this.isValidAddress(country, zipCode)) return false;
    if (isExpress && weight > 25) return false;
    return true;
  }

  private getBaseRate(country: string, zipCode: string): number {
    return country === "US" ? 5.99 : 12.99;
  }

  private isValidAddress(country: string, zipCode: string): boolean {
    return zipCode.length >= 5 && country.length === 2;
  }
}
```

**Code Issue**: Methods contain a repeating group of parameters related to package dimensions, shipping address, and options, creating long parameter lists and increasing the risk of parameter order mistakes.

```typescript
class OrderService {
  calculateShippingCost(
    dimensions: PackageDimensions,
    address: ShippingAddress,
    options: ShippingOptions
  ): number {
    const baseRate = this.getBaseRate(address);
    const weightMultiplier = dimensions.weight * 0.5;
    const volumeMultiplier = dimensions.volume * 0.001;
    const expressMultiplier = options.getMultiplier();

    return (baseRate + weightMultiplier + volumeMultiplier) * expressMultiplier;
  }

  validatePackage(
    dimensions: PackageDimensions,
    address: ShippingAddress,
    options: ShippingOptions
  ): boolean {
    if (dimensions.isOverweight()) return false;
    if (dimensions.isOversized()) return false;
    if (!address.isValid()) return false;
    if (options.isExpress && dimensions.weight > 25) return false;
    return true;
  }

  createShippingLabel(
    dimensions: PackageDimensions,
    address: ShippingAddress,
    options: ShippingOptions
  ): string {
    return `${options.serviceType} - ${dimensions.weight}kg - ${dimensions.dimensionsString} - ${address.zipCode}, ${address.country}`;
  }

  private getBaseRate(address: ShippingAddress): number {
    return address.isDomestic() ? 5.99 : 12.99;
  }
}

class PackageDimensions {
  constructor(
    public readonly length: number,
    public readonly width: number,
    public readonly height: number,
    public readonly weight: number
  ) {}

  get volume(): number {
    return this.length * this.width * this.height;
  }

  get dimensionsString(): string {
    return `${this.length}x${this.width}x${this.height}`;
  }

  isOversized(): boolean {
    return this.length > 100 || this.width > 100 || this.height > 100;
  }

  isOverweight(): boolean {
    return this.weight > 50;
  }
}

class ShippingAddress {
  constructor(
    public readonly zipCode: string,
    public readonly country: string
  ) {}

  isValid(): boolean {
    return this.zipCode.length >= 5 && this.country.length === 2;
  }

  isDomestic(): boolean {
    return this.country === "US";
  }
}

class ShippingOptions {
  constructor(public readonly isExpress: boolean = false) {}

  get serviceType(): string {
    return this.isExpress ? "EXPRESS" : "STANDARD";
  }

  getMultiplier(): number {
    return this.isExpress ? 2 : 1;
  }
}
```

**Benefits**: Reduces parameter count significantly, makes method signatures self-documenting, enables type safety to prevent parameter order errors, and allows adding behavior to parameter objects.

**Trade-off Consideration**: May introduce additional object creation overhead, though this is usually negligible for most applications.

### Preserve Whole Object

Replaces a set of derived values passed into a function with the entire source object from which those values were derived, reducing coupling and improving maintainability.

```typescript
class Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(width: number, height: number, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  getWidth(): number {
    return this.width;
  }
  getHeight(): number {
    return this.height;
  }
  getX(): number {
    return this.x;
  }
  getY(): number {
    return this.y;
  }
}

class CollisionDetector {
  checkCollision(
    width1: number,
    height1: number,
    x1: number,
    y1: number,
    width2: number,
    height2: number,
    x2: number,
    y2: number
  ): boolean {
    return (
      x1 < x2 + width2 &&
      x1 + width1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    );
  }
}

class Game {
  private detector = new CollisionDetector();

  checkRectangleCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    // Smell: Extracting individual values from objects
    const width1 = rect1.getWidth();
    const height1 = rect1.getHeight();
    const x1 = rect1.getX();
    const y1 = rect1.getY();

    const width2 = rect2.getWidth();
    const height2 = rect2.getHeight();
    const x2 = rect2.getX();
    const y2 = rect2.getY();

    // Passing primitive values instead of whole objects
    return this.detector.checkCollision(
      width1,
      height1,
      x1,
      y1,
      width2,
      height2,
      x2,
      y2
    );
  }
}
```

**Code Issue**: The Game class extracts individual primitive values from Rectangle objects and passes them as separate parameters, breaking encapsulation and creating tight coupling between classes.

```typescript
class RefactoredCollisionDetector {
  checkCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
      rect1.getX() < rect2.getX() + rect2.getWidth() &&
      rect1.getX() + rect1.getWidth() > rect2.getX() &&
      rect1.getY() < rect2.getY() + rect2.getHeight() &&
      rect1.getY() + rect1.getHeight() > rect2.getY()
    );
  }
}

class RefactoredGame {
  private detector = new RefactoredCollisionDetector();

  checkRectangleCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    // Passing whole objects instead of primitive values
    return this.detector.checkCollision(rect1, rect2);
  }
}
```

**Benefits**: Reduces parameter explosion from 8 to 2 parameters, eliminates risk of parameter order mistakes, improves maintainability when object properties change, and preserves object encapsulation.

**Trade-off Consideration**: Increases coupling between classes as methods now depend on the entire object rather than specific values.

### Replace With Object

Creates a new class to represent a data field that has its own behavior and associated data, replacing primitive fields with rich objects.

```typescript
class Order {
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
```

**Code Issue**: The Order class contains multiple primitive fields representing customer data, with customer-related logic scattered throughout the class, making it difficult to maintain and extend customer behavior.

```typescript
class RefactoredOrder {
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
```

**Benefits**: Consolidates customer-related data and behavior into a dedicated class, enables adding new customer-specific methods without modifying the Order class, and improves code organization and maintainability.

**Trade-off Consideration**: Introduces an additional class that may seem like over-engineering for simple data structures, potentially increasing the overall complexity of the codebase.

## When Not to Refactor

- **No Imminent Modifications**: If the code functions correctly and there are no anticipated changes or new features that would benefit from a more sophisticated design, it is perfectly acceptable to leave it as is. The principle is: "If the code works and doesn’t ever need to change, it’s perfectly fine to leave it alone".

- **Cost Outweighs Benefit**: The overhead associated with creating new classes, managing additional layers, or adopting complex design approaches might prolong simple tasks or be unmanageable if the team lacks the necessary skills and experience. Refactoring incurs costs in developer time and the potential for introducing bugs, , so a "genuine tradeoff" must be considered, and the benefits should justify the effort.

- **Infrequently Accessed Code**: If a section of code is rarely modified or accessed, the "cost of the inconvenience" of its current design may not be felt often enough to warrant the refactoring effort.

- **Disproportionate Effort for Small Impact**: If a refactoring would demand significant effort for only a minor improvement, or if its impact on the overall system is negligible, it might be more prudent to prioritize other changes. Additionally, "premature optmization is the root of all evil", suggesting that refactoring solely for performance without a proven bottleneck can be counterproductive.
