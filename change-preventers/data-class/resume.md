# Data Class

A Data Class is a type of class that primarily serves as a "dumb data holder". It typically consists only of fields and their corresponding getter and setter methods, without incorporating any significant behavior or business logic. In software development, particularly within object-oriented paradigms, the presence of a Data Class is often considered a "bad smell" in the code, signaling potential design issues. This concept contrasts with Value Objects, which are meant to be conceptually whole, interchangeable, and ideally immutable, offering design freedoms for simplification and optimization.

## Why it's a Problem? 

- **Misplaced Behavior and Lack of Encapsulation**: A primary issue is that behavior and logic that logically belong with the data are instead implemented in other classes, which then manipulate the Data Class in excessive detail. This often leads to the "Feature Envy" code smell, where a function in one module spends more time communicating with data in another module than within its own.
- **Reduced Modifiability and Maintainability**: When behavior related to a Data Class is scattered across the codebase, any changes to the data structure or the rules governing it require modifications in multiple places. This increases the effort and risk of introducing bugs during maintenance.
- **Confusion and Potential for Bugs**: Treating objects merely as "containers for data" can lead to domain logic being embedded in queries or client, making the underlying model less clear and relevant. Mutable data, often found in Data Classes, can cause unexpected consequences and hard-to-spot bugs if changes are made without other parts of the system being aware.
- **Duplication and Data Clumps**: Data Classes with many fields can lead to duplicated code, especially if subsets of data and methods frequently appear together. Groups of data items that consistently travel together as parameter across many functions (data clumps) are strong indicator that they should form their own cohesive object with integrated behavior.
- **Loss of Data Integrity**: Directly accessing and manipulating data class fields through database queries can bypass and obscure domain rules adn encapsulation, leading to inconsistencies and a loss of the model's integrity.

## Refactoring Technique

### Encapsulated Field

```typescript
// Before: A class with public fields that can be freely modified.
class Customer {
  public firstName: string;
  public lastName: string;
  public email: string;
  public age: number;
  public phoneNumber: string;
  public creditStore: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    phoneNumber: string,
    creditScore: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.age = age;
    this.phoneNumber = phoneNumber;
    this.creditScore = creditScore;
  }

  customer = new Customer(
    "John",
    "Doe",
    "john.doe@email.com",
    30,
    "555-1234",
    750
  );

  // Direct modification can lead to invalid state.
  customer.age = -5;
  customer.email = "invalid-email";
  customer.firstName = "";
}
```

**Code Issue**:
The `Customer` class exposes all its fields as `public`, allowing any part of the system to modify them directly. This leads to a lack of data integrity, as invalid values (like a negative `age` or an improperly formatted `email`) can be set without validation. The logic for handling customer data is scattered, making the class a "dumb data holder."

```typescript
// After: Fields are encapsulated, and modifications are controlled through setters.
class RefactoredCustomer {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _age: number;
  private _phoneNumber: string;
  private _creditScore: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    phoneNumber: string,
    creditScore: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.age = age;
    this.phoneNumber = phoneNumber;
    this.creditScore = creditScore;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    if (value.trim() === "") {
      throw new Error("First name cannot be empty");
    }
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    if (value.trim() === "") {
      throw new Error("Last name cannot be empty");
    }
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Invalid email format");
    }
    this._email = value.toLowerCase();
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    // Add phone number validation if needed
    this._phoneNumber = value;
  }

  get creditScore(): number {
    return this._creditScore;
  }

  set creditScore(value: number) {
    if (value < 0) {
      throw new Error("Credit score cannot be negative");
    }
    this._creditScore = value;
  }
}
```

**Benefits**:

- **Improved Data Integrity**: By encapsulating fields and using setters with validation logic, the class protects its internal state from invalid data.
- **Centralized Logic**: Behavior related to customer data (like validation) is now part of the `RefactoredCustomer` class itself, improving cohesion.
- **Enhanced Maintainability**: If validation rules change, they only need to be updated in one place—the setter methods.
- **Clearer API**: The public interface of the class (getters and setters) clearly defines how other parts of the system can interact with it, hiding implementation details.

_For detailed code examples, see the files in this folder._

## When Not to Refactor

While generally seen as a "code smell" warranting refactoring, there are specific situations where refactoring a Data Class might not be necessary or even advisable:

- **As an Immutable Result Record or Intermediate Data Structure**: A significant exception is when a Data Class is used as an immutable "result record" or an intermediate data structure, particularly after applying a "Split Phase" refactoring. In such cases, the fields within the data class are not intended to be changed after creation, and thus do not require encapsulation for modification. This aligns with the benefits of immutable **Value Objects**, which are safer to use, easier to test, and whose operations (excluding initializers) are inherently side-effect-free functions.
- **When Code is Not Being Modified**: If a Data Class is part of a messy section of code that does not require modification, there may be no immediate benefit to refactoring it. Refactoring primarily provides value when the code needs to be understood or changed.
- **When Rewriting is More Efficient**: In some scenarios, the complexity of refactoring an existing Data Class might outweigh the benefits, making it more practical to rewrite the relevant code entirely. This decision relies heavily on good judgment and experience.
- **For Purely Technical Performance Tuning (with Immutability)**: When a Value Object is explicitly designed as immutable, developers gain the flexibility to make purely technical decisions regarding performance optimization (such as copying or sharing instances) without concerns about altering the application's meaningful behavior, as the application does not depend on specific instances of these objects.
