# Message Chains

A Message Chain is a type of code smell categorized as a Coupler. It occurs when a client asks one object for another object, which the client then asks for yet for another object, and so on. This smells may manifest as a long sequence getThis methods or as a sequence of temporary variables.

In Distributed architectures, this concept related to **chatty communication**. When relying on synchronous calls, having many chains of calls begins to be problematic. For example, RPC-style method calls that are excessively chatty can be overly brittle.

## Why it's a Problem

Message Chains are detrimental to software design primarily because they introduce tight coupling and compromise encapsulation:

- **Tight Coupling and Fragility**: Navigating through a chain means the client becomes directly coupled to the internal structure of that navigation path. Consequently, any change to the relationships of the intermediate objects in the chain requires the client object to change as well. Furthermore, excessively chatty communication often leads to tight coupling between collaborating components.

- **Brittle Interfaces and Performance Issues**: When interaction is chatty (as often seen with Message Chains in distributed calls), it can result in brittle service interfaces. This behavior can also cause performance issues, sometimes necessitating the creation of elaborate mechanisms for batching remote procedure calls (RPC).

## Refactoring Technique

### Hide Delegate

```typescript
class Department {
  private manager: string;
  private chargeCode: string;

  constructor(manager: string, chargeCode: string) {
    this.manager = manager;
    this.chargeCode = chargeCode;
  }

  getManager(): string {
    return this.manager;
  }

  getChargeCode(): string {
    return this.chargeCode;
  }
}

class Person {
  private name: string;
  private department: Department;

  constructor(name: string, department: Department) {
    this.name = name;
    this.department = department;
  }

  getName(): string {
    return this.name;
  }

  getDepartment(): Department {
    return this.department;
  }
}

class Client {
  displayPersonInfo(person: Person): void {
    // Message chain: person.getDepartment().getManager()
    const manager = person.getDepartment().getManager();
    const chargeCode = person.getDepartment().getChargeCode();

    console.log(`Person: ${person.getName()}`);
    console.log(`Manager: ${manager}`);
    console.log(`Charge Code: ${chargeCode}`);
  }
}
```

Create a new method in class A that delegates the call to object B. Now the client doesn't know about, or depend on, class B.

```typescript
class Person {
  private name: string;
  private department: Department;

  constructor(name: string, department: Department) {
    this.name = name;
    this.department = department;
  }

  getName(): string {
    return this.name;
  }

  getDepartment(): Department {
    return this.department;
  }

  getManager(): string {
    return this.department.getManager();
  }

  getChargeCode(): string {
    return this.department.getChargeCode();
  }
}

class Client {
  displayPersonInfo(person: Person): void {
    const manager = person.getManager();
    const chargeCode = person.getChargeCode();
  }
}
```

## When Not to Refactor

While Message Chains are generally considered an anti-pattern that warrants refactoring (often addressed using techniques like Hide Delegate or Remove Middle Man), there are specific contexts where refactoring may be unnecessary or inadvisable:

- **When Code is Not Being Modified**: If the code containing the Message Chain is functioning correctly and does not require modification, there may be no immediate benefit to refactoring it. If the code works and will never need to change, leaving it alone is fine. Refactoring yields value primarily when the code needs to be understood or altered.

- **When Rewriting is More Efficient**: The decision to refactor a complicated mess or rewrite it entirely requires good judgment and experience. In certain scenarios, the complexity of refactoring the existing code structure might be so high that rewriting the relevant piece of functionality is the more practical and economical approach.

- **For Small Feature Trade-offs**: When implementing a new feature is small, a programmer might choose to postpone a larger refactoring if the cost of the inconvenience of the existing design is rarely felt, even though the refactoring is ultimately needed.
