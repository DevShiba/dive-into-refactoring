# Data Clumps

Data clumps refer to groups of data items that frequently appear together in various parts of the codebase. This can be observed when the same three or four data items are used as fields in multiple classes or as parameters in many method signatures. The core idea is that such "bunches of data that hang around together really ought to find a home together" in a single, cohesive unit.

A good test for identifying a data clump is to consider if deleting one of the data values would make the others meaningless. If so, it's a strong indication that these values belong together in a object.

## Why it's a Problem

- **Increased Duplication**: The repeated appearance of the same group of data items inherently creates duplication across the codebase. When you need to change the duplicated data (e.g., add a new field to the "clump"), you must find and update each instance, increasing the risk of errors and making modifications harder.

- **Reduced Cohesion and Clarity**: When data items that logically belong together are scattered, it obscures their relationship and makes the code harder to understand. The program's design becomes less clear, as the underlying "data structures are the key to understanding what's going on".

- **Long Parameter Lists**: Data clumps frequently manifest as "long parameter lists" in method signatures, which are "often confusing in their own right". Such long lists make function calls harder to understand and maintain.

- **Impeded Refactoring**: Without a clear, encapsulated structure for related data, it becomes more difficult to perform other refactorings or to introduce new behavior that operates on this data.

## Refactoring Techniques

### Extract Class

Creates a new class to encapsulate related data that frequently appears together, promoting better organization and reducing parameter lists.

```typescript
// Before: Data clump scattered across methods
class DatabaseService {
  connectToUserDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    // implementation
  }

  connectToProductDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    // implementation
  }
}

class ReportGenerator {
  generateUserReport(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    // implementation
  }
}
```

```typescript
// After: Extracted DatabaseConnection class
class DatabaseConnection {
  private host: string;
  private port: number;
  private username: string;
  private password: string;

  constructor(host: string, port: number, username: string, password: string) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
  }

  private createConnectionString(): string {
    return `postgres://${this.username}:${this.password}@${this.host}:${this.port}`;
  }

  connect(databaseName: string): void {
    console.log(
      `Connecting to ${databaseName} database at ${this.createConnectionString()}`
    );
  }
}

class DatabaseService {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  private connectToDatabase(databaseName: string): void {
    this.connection.connect(databaseName);
  }
}
```

**Benefits**: Encapsulation allows for validation logic, derived properties, and behavior to be co-located with the data. Changes to connection logic only require updates in one place.

### Introduce Parameter Object

Replaces a group of data items that regularly travel together across multiple functions with a single, new data structure or object.

```typescript
// Before: Repeated parameter groups
class UserService {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): void {
    console.log(`Creating user: ${firstName} ${lastName}`);
  }

  updateUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): void {
    console.log(`Updating user ${userId}`);
  }
}
```

```typescript
// After: Structured parameter objects
interface PersonalInfo {
  firstName: string;
  lastName: string;
}

interface ContactInfo {
  email: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserData {
  personal: PersonalInfo;
  contact: ContactInfo;
  address: Address;
}

class UserService {
  createUser(userData: UserData): void {
    console.log(
      `Creating user: ${userData.personal.firstName} ${userData.personal.lastName}`
    );
  }

  updateUser(userId: string, userData: UserData): void {
    console.log(`Updating user ${userId}`);
  }
}
```

_For detailed code examples, see the files in this folder._

**Benefits**: Parameter objects enable type safety at compile time, making it impossible to pass arguments in the wrong order. The structured approach also makes it easier to add validation logic and default values at the object level rather than scattered across multiple method calls.

**Key Insight**: This refactoring often reveals opportunities for further improvements like validation methods, computed properties, or business logic that naturally belongs with the data.

### Preserve Whole Object

Replaces a set of derived values passed into a function with the entire source object from which those values were derived. This technique reduces coupling and makes the code more flexible to future changes.

```typescript
// Before: Individual customer properties passed separately
interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
}

class OrderProcessor {
  processOrder(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    customerAddress: string
  ): void {
    console.log(`Processing order for ${customerName}`);
    // Implementation details...
  }

  checkCreditLimit(
    customerName: string,
    customerEmail: string,
    creditLimit: number,
    orderAmount: number
  ): boolean {
    console.log(
      `Checking credit for ${customerName}: ${creditLimit} vs ${orderAmount}`
    );
    return creditLimit >= orderAmount;
  }

  sendConfirmation(
    customerName: string,
    customerEmail: string,
    orderDetails: string
  ): void {
    console.log(`Sending email to ${customerEmail} for ${customerName}`);
  }
}
```

_For detailed code examples, see the files in this folder._

**Code Issues**: Methods require extracting multiple properties from the same Customer object, creating repetitive parameter patterns. Adding new customer-related functionality requires updating multiple method signatures.

```typescript
// After: Passing the complete Customer object
class OrderProcessor {
  processOrder(customer: Customer): void {
    this.validateCustomerInfo(customer);
    this.sendConfirmationEmail(customer);
    this.scheduleDelivery(customer);
  }

  private validateCustomerInfo(customer: Customer): void {
    console.log(`Validating info for ${customer.name}`);
  }

  checkCreditLimit(customer: Customer, orderAmount: number): boolean {
    console.log(
      `Checking credit for ${customer.name}: ${customer.creditLimit} vs ${orderAmount}`
    );
    return customer.creditLimit >= orderAmount;
  }

  private sendConfirmationEmail(customer: Customer): void {
    console.log(
      `Sending confirmation to ${customer.email} for ${customer.name}`
    );
  }

  private scheduleDelivery(customer: Customer): void {
    console.log(
      `Scheduling delivery to ${customer.address} for ${customer.name}`
    );
  }
}
```

**Benefits**: Methods become more resilient to changes in the Customer interface. New customer properties can be accessed without modifying method signatures.

**Trade-off Consideration**: While this reduces parameter lists, it can increase coupling between classes. The receiving method now depends on the entire object rather than just the specific values it needs.

## When Not to Refactor

- **Stable, Unmodified Code**: If the code works and isn't being changed, the cost of refactoring may outweigh the benefits.

- **Rewrite vs. Refactor**: Sometimes starting fresh is more efficient than gradually improving deeply problematic code.

- **Avoid Over-Engineering**: Don't create "supple designs" that are "just demonstrations of technical virtuosity but fail to cut to the core of the domain".

- **Release Timing**: Avoid major refactoring immediately before critical releases.

- **Performance-Critical Sections**: In performance-sensitive code, the abstraction overhead might be unacceptable. Measure first, optimize second.

- **Cross-Team Dependencies**: If the data clump spans multiple team boundaries, coordinate the refactoring effort to avoid breaking changes.

- **Legacy System Integration**: In systems with extensive external dependencies, the coupling might be intentional to match external APIs or database schemas.
