# Large Class

The "Large Class" code smell occurs when a class attempts to handle too many responsibilities, often characterized by an excessive number of fields or lines of code. This condition is considered a prime breeding ground for duplicated code, chaos, and ultimately, makes the system harder to maintain.

## Why it's a Problem

- **Excessive Complexity and Difficulty in Understanding**: A large class is too big to understand easily. Its complexity can make it difficult to reason about, leading, to hidden assumptions, unintended consequences, and overlooked interactions. This incrase cognitive overload and limits a developer's ability to handle design complexity. When complex operations are forced into an object that doesn't fit its definition, the object loses its conceptual clarity.

- **Duplication of Code**: Large classes are a "prime breeding ground for duplicated code". This means the same code logic may appear in multiple places, making the codebase larger than necessary and harder to understand. If this duplicated behavior needs to change, it's easy to forget to update all instances, which can lead to bugs. Eliminating duplication ensures that code is stated "once and only once," which is essential for good design.

- **Lack of Crisp Abstraction**: A class that is too large often loses its "crisp abstraction". It struggles to maintain a single, clear responsability, making it difficult to understand the class's purpose and its role in the system.

- **Impacts Modularity**: When a class is trying to do too much, it undermines modularity, which is crucial for enabling modifications to a program by understanding only a small part of it. High coupling, often found in large classes, can become a significant obstacle to an application's growth and scalability. An intricate dependency graph means every part of the system is a liability, requiring careful evaluation of any change.

## Refactoring Techniques

Creates a new class to encapsulate a subset of fields and behaviors that logically belong together, reducing the size and responsibility of the original class.

### Extract Class

Creates a new class to encapsulate a subset of fields and behaviors that logically belong together, reducing the size and responsibility of the original class.

```typescript
// Before: When one class does the work of two, awkwardness results.
class Person {
  name: string = "";
  officeAreaCode: string = "";
  officeNumber: string = "";

  getTelephoneNumber(): string {
    return `${this.officeAreaCode} ${this.officeNumber}`;
  }
}
```

**Code Issue**:  
The `Person` class is responsible for both personal identity and telephone details. This mixes unrelated responsibilities, making the class harder to maintain and extend.

```typescript
// After: Telephone details are extracted into their own class.
class TelephoneNumber {
  officeAreaCode: string = "";
  officeNumber: string = "";

  constructor(areaCode?: string, number?: string) {
    if (areaCode) this.officeAreaCode = areaCode;
    if (number) this.officeNumber = number;
  }

  getTelephoneNumber(): string {
    return `${this.officeAreaCode} ${this.officeNumber}`;
  }

  setAreaCode(areaCode: string): void {
    this.officeAreaCode = areaCode;
  }

  setNumber(number: string): void {
    this.officeNumber = number;
  }
}

class Person {
  name: string = "";
  private telephoneNumber: TelephoneNumber = new TelephoneNumber();

  constructor(name?: string, areaCode?: string, number?: string) {
    if (name) this.name = name;
    if (areaCode || number) {
      this.telephoneNumber = new TelephoneNumber(areaCode, number);
    }
  }

  getTelephoneNumber(): string {
    return this.telephoneNumber.getTelephoneNumber();
  }

  setTelephoneNumber(areaCode: string, number: string): void {
    this.telephoneNumber.setAreaCode(areaCode);
    this.telephoneNumber.setNumber(number);
  }
}
```

**Benefits**:

- Telephone-related logic is isolated, making future changes to telephone formatting or validation easier.
- The `Person` class is now focused on personal identity, improving clarity and maintainability.
- Enables reuse of `TelephoneNumber` in other contexts without duplicating code.

**Trade-off Consideration**:

- May introduce more classes to manage, which can increase the learning curve for new developers.
- If the telephone details are only ever used in one place, the indirection may be unnecessary.

### Extract Subclass

```typescript
// Before:
class Employee {
  name: string = "";
  salary: number = 0;
  department: string = "";

  teamSize: number = 0;
  budgetLimit: number = 0;

  programmingLanguages: string[] = [];
  yearsOfExperience: number = 0;

  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  getAnnualSalary(): number {
    return this.salary * 12;
  }

  // Manager-specific methods
  getTeamSize(): number {
    return this.teamSize;
  }

  // Developer-specific methods
  addProgrammingLanguage(language: string): void {
    this.programmingLanguages.push(language);
  }
}
```

_For detailed code examples, see the files in this folder._

```typescript
// After:
class Employee {
  name: string = "";
  salary: number = 0;
  department: string = "";

  constructor(name: string, salary: number, department: string) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  getAnnualSalary(): number {
    return this.salary * 12;
  }

  // Other related functionalities here...
}

class Manager extends Employee {
  teamSize: number = 0;
  budgetLimit: number = 0;

  constructor(
    name: string,
    salary: number,
    department: string,
    teamSize: number
  ) {
    supeer(name, salary, department);
    this.teamSize = teamSize;
  }

  getTeamSize(): number {
    return this.teamSize;
  }

  // Other related functionalities here...
}

class Developer extends Employee {
  programmingLanguages: string[] = [];
  yearsOfExperience: number = 0;

  constructor(
    name: string,
    salary: number,
    department: string,
    yearsOfExperience: number
  ) {
    super(name, salary, department);
    this.yearsOfExperience = yearsOfExperience;
  }

  addProgrammingLanguage(language: string): void {
    this.programmingLanguages.push(language);
  }

  // Other related functionalities here...
}
```

_For detailed code examples, see the files in this folder._

**Benefits**:

- Each subclass contains only relevant fields and methods, reducing confusion and memory usage.
- The base class remains simple and focused.
- Easier to extend functionality for specific employee types without affecting others.
- Prevents accidental misuse of fields that don't apply to a given employee type.

**Trade-off Consideration**:

- If too many subclasses are created, the class hierarchy can become deep and harder to navigate.
- May require refactoring client code to use the correct subclass.

## When Not to Refactor

- **When Code Does Not Need Modification**: If the code, despite beign messy, does not need to be modified or is treated as an external API, then refactoring may not yield significant benefits. Refactoring becomes valuable primarily when there's a need to understand or change the code

- **When Rewriting is Easier**: Sometimes, the complexity of existing code is so overwhelming that rewriting it from scratch is less effort than refactoring it incrementally. This decision requires good judgment and experience.

- **Lack of Automated Tests**: Refactoring involves changing working code, which inherently carries the risk of introducing subtle bugs. Without a comprehensive suite of automated tests, refactoring is much more dangerous, as there's no safety net to quickly detect if changes have broken existing functionality

- **Complexity from Over-Engineering (Speculative Generality)**: Refactoring should avoid the opposite problem of speculative generality, where functionality is added "just in case" it's needed in the future (the "You Aren't Gonna Need It" or YAGNI principle). This adds unnecessary complexity that makes the code harder to understand and maintain if the machinery is not actually used. Excessive layers of abstraction of indirection can also get in the way rather than help.

- **When Managers or Customers Resist**: Although not a technical reason to avoid refactoring, practical constraints exist. Managers may require developers to justify refactoring decisions, and such justification can be difficult to quantify upfront, potentially leading to resistance or the postponement of necessary improvements
