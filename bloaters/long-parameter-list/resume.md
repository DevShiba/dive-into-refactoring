# Long Parameter List

A Long Parameter List is considered a "bad smell" in code because it often indicates that a function or method is trying to do too much, or that the design of the data being passed around is not optimal.

## Why it's a Problem

- **Lack of Clarity and Enforced Protocol**: Long parameter lists are inherently confusing. When primitive types, such as strings, are used as parameters for domain-specific concepts, it becomes unclear which argument represents what, for example in `AddUserToGroup(string, string)` where the distinction between user and group name is ambiguous.

- **Confusion and Readability**: The sheer number of parameters can overwhelm a developer, making the function call difficult to understand. When reviewing such code, a developer might struggle to recall the exact order or meaning of each parameter. This complexity is exacerbated by flag arguments, which force developers to decipher the meaning of literal values passed into a function, hindering readability.

- **Hindrance to Extraction**: Functions with many parameters and temporary variables can significantly impede refactoring efforts, particularly when trying to use Extract Function. The process often results in the extracted method requiring so many parameters that it offers little improvement in readability over the original long function.

- **Unnecessary Duplication and Complexity**: When multiple functions require parts of a larger data structure, extracting and passing individual values can lead to duplicated logic across these functions for manipulating those parts. Furthermore, a function with multiple flag arguments can indicate that the function is attempting to do too much, leading to increased complexity as it tries to accommodate various combinations of behaviors. Such complexity also arises when a system attempts to be overly flexible, offering numerous options that add to the design's intricate nature.

## Refactoring Techniques

### Introduce Parameter Object

Replaces a group of parameters that frequently appear together with a single object, reducing method signature complexity and improving readability.

```typescript
class PaymentProcessor {
    processPayment(
    amount: number,
    currency: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string,
    billingStreet: string,
    billingCity: string,
    billingState: string,
    billingZip: string,
    billingCountry: string,
    ): string {
      ...
    }

    refundPayment(
    amount: number,
    currency: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string,
    billingStreet: string,
    billingCity: string,
    billingState: string,
    billingZip: string,
    billingCountry: string,
    ): string {
  // Other related functionalities here...
    }
}

class OrderService {
  createOrder(
        customerId: string,
    amount: number,
    currency: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string,
    billingStreet: string,
    billingCity: string,
        email: string,
    phone: string,
  ): void {
  // Other related functionalities here...
  }
}
```

**Code Issue**: Methods require passing the same group of payment-related parameters repeatedly, creating long parameter lists and increasing the chance of parameter order mistakes.

```typescript
  class PaymentAmount {
    amount: number;
    currency: string;

    constructor(amount: number, currency: string){
      this.amount = amount;
      this.currency = currency;
    }

  // Other related functionalities here...
  }

  class CreditCard {
      cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardHolderName: string;

  constructor(
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string
  ) {
        this.cardNumber = cardNumber;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
    this.cvv = cvv;
    this.cardHolderName = cardHolderName;
  }

  // Other related functionalities here...
  }

  class BillingAddress {
      street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  }

  constructor(street: string, city: string, state: string, zip: string, country: string){
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
  }

  // Other related functionalities here...
  }
```

_For detailed code examples, see the files in this folder._

**Benefits**: Reduces parameter count significantly, makes method signatures self-documenting, and enables type safety to prevent parameter order errors.

**Trade-off Consideration**: May introduce additional object creation overhead, though this is usually negligible for most applications.

Replaces a set of derived values passed into a function with the entire source object from which those values were derived, reducing coupling and improving maintainability.

```typescript
class UserRegistrationService {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    dateOfBirth: Date,
    gender: string,
    occupation: string,
    company: string
  ): void {
    // Other related functionalities here...
  }

  updateUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    dateOfBirth: Date,
    gender: string,
    occupation: string,
    company: string
  ): void {
    // Other related functionalities here...
  }
}

class EmailService {
  sendWelcomeEmail(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    company: string,
    newsletter: boolean
  ): void {
    // Other related functionalities here...
  }
}
```

```typescript
class PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: Date,
    gender: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
  }

  // Other related functionalities here...
}

class Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  constructor(
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ) {
    this.streetAddress = streetAddress;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.country = country;
  }

  // Other related functionalities here...
}
```

_For detailed code examples, see the files in this folder._

**Benefits**: Methods become more resilient to changes in data structure, and new properties can be accessed without modifying method signatures.

**Trade-off Consideration**: Increases coupling between classes as methods now depend on the entire object rather than specific values.

### Replace With Method Call

Replaces a parameter passed to a method with a direct call to the method that provides that parameter, simplifying method signatures.

```typescript
class Order {
  private quantity: number = 10;
  private itemPrice: number = 50.0;
  private season: string = "winter";
  private customerType: string = "premium";

  getSeasonalDiscount(): number {
    switch (this.reason) {
      case "winter":
        return 0.1;
      case "summer":
        return 0.05;
      default:
        return 0;
    }
  }

  getFees(): number {
    return this.customerType === "premium" ? 5.0 : 10.0;
  }

  private discountedPrice(
    basePrice: number,
    seasonDiscount: number,
    fees: number
  ): number {
    const discountAmount = basePrice * seasonDiscount;
    return basePrice - discountAmount + fees;
  }
}
```

**Code Issue**: The `discountedPrice` method receives parameters that are already available through other methods, creating unnecessary parameter passing.

```typescript
class RefactoredOrder {
  private quantity: number = 10;
  private itemPrice: number = 50.0;
  private season: string = "winter";
  private customerType: string = "premium";

  getSeasonalDiscount(): number {
    switch (this.season) {
      case "winter":
        return 0.1;
      case "summer":
        return 0.05;
      default:
        return 0;
    }
  }

  getFees(): number {
    return this.customerType === "premium" ? 5.0 : 10.0;
  }

  private discountedPrice(basePrice: number): number {
    const seasonDiscount = this.getSeasonalDiscount();
    const fees = this.getFees();

    const discountAmount = basePrice * seasonDiscount;
    return basePrice - discountAmount + fees;
  }

  // Other related functionalities here...
}
```

_For detailed code examples, see the files in this folder._

**Benefits**: Simplifies method signatures by eliminating redundant parameters and makes the code more maintainable.

**Trade-off Consideration**: May introduce slight performance overhead from additional method calls, though this is typically minimal.

## When Not to Refactor

- **No Modifications Planned**: If the code functions correctly and there are no anticipated changes or new features that would benefit from a more sophisticated design, it is generally acceptable to leave it as is. Refactoring incurs costs in developer time and the potential for introducing bugs, so the benefits should justify the effort.

- **Rewriting is Easier**: While not explicitly stated for parameter lists, the general principle applies that if the refactoring effort is disproportionately high for a smell impact, or if the current code is rarely touched, it might be more practical to rewrite if necessary rather than incrementally refactor.

- **Minimal Impact on Rarely Touched Code**: If a section of code with a long parameter list is rarely modified or accessed, the "cost of the inconvenience" of its current design may not be felt often enough to warrant the refactoring effort.

- **Unwanted Dependencies**: Refactoring a long parameter list, such as by using Preserve Whole Object or Replace Query with Parameter, might introduce an unwanted dependency into the function body or shift responsibility for resolving a value to the caller, thereby complicating the caller's life. This tension between reducing parameter lists and managing dependencies requires careful consideration, as sometimes the existing structure, though seemingly cumbersome, maintains a preferable dependency relationship between modules.
