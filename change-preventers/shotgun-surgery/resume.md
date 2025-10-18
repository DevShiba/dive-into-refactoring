# Shotgun Surgery

A Shotgun Surgery is a code smell that occurs when a single required modification necessitates many small edits spread across a large number of different classes or modules. It is categorized as a "Chang Preventer" code smell. This phenomenon indicates that related logic or responsibility is poorly localized within the codebase.

## Why it's a Problem?

Shotgun Surgery presents challenges primarily because it fundamentally hinders modifiability and increases the risk of introducing bugs:

- **Difficult in Tracking Changes**: When changes are scattered across the system, they are difficult to find, making it easy to overlook a necessary edit.

- **Widespread Impact**: Because a single concept requires modifications in numerous places, the system exhibits high coupling. High coupling means changing one part of the system requires changes in another, slowing down the addition of new features and raising the risk of errors.

- **Maintenance Overhead**: The necessity to edit many files for one logical change increases the effort required for maintenance and risks introducing bugs because the widespread edits are hard to manage and locate.

## Refactoring Techniques

### Inline Class

```typescript
interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

class UserId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}

class Username {
  private username: string;

  constructor(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }
}

class UserEmail {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  isValid(): boolean {
    return this.email.includes("@");
  }
}

class User {
  private userId: UserId;
  private username: Username;
  private userEmail: UserEmail;

  constructor(data: UserData) {
    this.userId = new UserId(data.id);
    this.username = new Username(data.username);
    this.userEmail = new UserEmail(data.email);
  }

  getUserInfo(): string {
    return `${this.userId.getId()}: ${this.username.getUsername()} (${this.userEmail.getEmail()})`;
  }

  updateUsername(username: string): void {
    this.username.setUsername(username);
  }

  updateEmail(email: string): void {
    this.userEmail.setEmail(email);
  }

  hasValidEmail(): boolean {
    return this.userEmail.isValid();
  }
}
```

```typescript
class RefactoredUser {
  private id: string;
  private username: string;
  private email: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
  }

  getUserInfo(): string {
    return `${this.id}: ${this.username} (${this.email})`;
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  hasValidEmail(): boolean {
    return this.email.includes("@");
  }
}
```

### Move Field

```typescript
interface CustomerData {
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

class Customer {
  private name: string;
  private street: string;

  constructor(data: CustomerData) {
    this.name = data.name;
    this.street = data.street;
  }

  getName(): string {
    return this.name;
  }

  getStreet(): string {
    return this.street;
  }

  setStreet(street: string): void {
    this.street = street;
  }
}

class Shipping {
  private city: string;
  private zipCode: string;

  constructor(data: CustomerData) {
    this.city = data.city;
    this.zipCode = data.zipCode;
  }

  getCity(): string {
    return this.city;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  setCity(city: string): void {
    this.city = city;
  }

  setZipCode(zipCode: string): void {
    this.zipCode = zipCode;
  }
}

class Billing {
  private country: string;

  constructor(data: CostumerData) {
    this.country = data.country;
  }

  getCountry(): string {
    return this.country;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  isTaxFree(): boolean {
    return this.country === "Tax Haven";
  }
}
```

```typescript
class Address {
  private street: string;
  private city: string;
  private zipCode: string;
  private country: string;

  constructor(street: string, city: string, zipCode: string, country: string) {
    this.street = street;
    this.city = city;
    this.zipCode = zipCode;
    this.country = country;
  }

  getStreet(): string {
    return this.street;
  }

  setStreet(street: string): void {
    this.street = street;
  }

  getCity(): string {
    return this.city;
  }

  setCity(city: string): void {
    this.city = city;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  setZipCode(zipCode: string): void {
    this.zipCode = zipCode;
  }

  getCountry(): string {
    return this.country;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  updateAddress(
    street: string,
    city: string,
    zipCode: string,
    country: string
  ): void {
    this.street = street;
    this.city = city;
    this.zipCode = zipCode;
    this.country = country;
  }
}

class Customer {
  private name: string;
  private address: Address;

  constructor(data: CustomerData) {
    this.name = data.name;
    this.address = new Address(
      data.street,
      data.city,
      data.zipCode,
      data.country
    );
  }

  getName(): string {
    return this.name;
  }

  getAddress(): Address {
    return this.address;
  }
}

class Shipping {
  private address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  getShippingCode(): string {
    return this.address.getShippingCode();
  }
}

class Billing {
  private address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  isTaxFree(): boolean {
    return this.address.isTaxFree();
  }
}

class OrderService{
  ...
}
```

### Move Method

```typescript
class UserRegistration {
  private users: Array<{ email: string; name: string }> = [];

  registerUser(name: string, email: string): boolean {
    if (!email.includes("@")) {
      return false;
    }

    if (email.split("@")[1]?.length < 3) {
      return false;
    }

    this.users.push({ email, name });

    return true;
  }

  updateUserEmail(oldEmail: string, newEmail: string): boolean {
    if (!newEmail.includes("@")) {
      return false;
    }

    if (newEmail.split("@")[1]?.length < 3) {
      return false;
    }

    const user = this.users.find((u) => u.email === oldEmail);

    if (user) {
      user.email = newEmail;
    }

    return false;
  }
}

class NewsletterSubscription {
  private subscribers: string[] = [];

  subscribe(email: string): boolean {
    if (!email.includes("@")) {
      return false;
    }

    if (email.split("@")[1]?.length < 3) {
      return false;
    }

    this.subscribers.push(email);
    return true;
  }
}

class ContactForm {
  submitContact(name: string, email: string, message: string): boolean {
    if (!email.includes("@")) {
      return false;
    }

    if (email.split("@")[1]?.length < 3) {
      return false;
    }

    return true;
  }
}
```

```typescript
class EmailValidator {
  static validate(email: string): { isValid: boolean; error?: string } {
    if (!email.includes("@")) {
      return { isValid: false, error: "Invalid email format" };
    }

    if (email.split("@")[1]?.length < 3) {
      return { isValid: false, error: "Invalid domain" };
    }

    return { isValid: true };
  }

  static isValid(email: string): boolean {
    return this.validate(email).isValid;
  }

  static getErrorMessage(email: string): string | null {
    const result = this.validate(email);
    return result.isValid ? null : result.error || "Invalid email";
  }
}

class UserRegistration {
  private users: Array<{ email: string; name: string }> = [];

  registerUser(name: string, email: string): boolean {
    const validation = EmailValidator.validate(email);
    if (!validation.isValid) {
      return false;
    }

    this.users.push({ email, name });
    return true;
  }
}

class NewsletterSubscription {
  private subscribers: string[] = [];

  subscribe(email: string): boolean {
    const validation = EmailValidator.validate(email);
    if (!validation.isValid) {
      return false;
    }

    this.subscribers.push(email);
    return true;
  }
}

class ImprovedEmailMarketing {
  sendCampaign(emails: string[], subject: string, content: string): void {
    const validEmails = emails.filter((email) => {
      const isValid = EmailValidator.isValid(email);

      return isValid;
    });
  }
}
```

## When Not to Refactor

- **When Code is Not Being Modified**: If the code containing the Shotgun Surgery smell works correctly and does not require modification, theres no immediate benefit to refactoring it. Refactoring adds value primarily when the code needs to be understood or changed.

- **When Rewriting is More Efficient**: If the complexity of dealing with the highly tangled code outweighs the benefits of gradual refactoring, it might be more practical to rewrite the relevant section entirely, although this decision requires good judgment and experience.

- **During Intermediate Consolidation Steps**: Solving Shotgun Surgery often involves techniques that temporarily increase the size of a module before making the final cleanup. For instance, combining poorly separated logic might use **Inline Function** or **Inline Class** to pull scattered logic together, resulting in a temporary **Long Method** or **Large Class**. Developers should not stop at this intermediate stage, as creating a larger element can be a necessary to reorganization, making the subsequent refactoring (like extraction) easier.

- **When Dealing with Untested Legacy Code**: If the system is large, inherited, and lacks comprehensive tests, attempting large-scale refactoring (which Shotgun Surgery often requires) carries significant risk of introducing bugs. In this situation, the priority should shift to first creating tests to provide a safety net, focusing on finding seams in the code to insert them, before undertaking high-risk changes.

- **In a Big Ball of Mud**: If the codebase is unstructured (a "Big Ball of Mud Anti-Pattern") and decomposition seems too difficult due to dependencies, a technique like **Tactical Forking** might be used. This approach involves cloning the entire monolith and then deleting the code that is not needed, rather than attempting to extract the desired parts and unraveling dependencies. This provides a tactical, rather than strategic, approach to restructuring the architecture quickly.
