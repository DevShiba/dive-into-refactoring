# Inappropriate Intimacy

Inappropriate Intimacy is a code smell categorized as a Coupler, indicating poor modularity and excessive coupling between modules. It is also referred to as **Insider Trading**. this smells arises when one module knows too much about the internal implementation or structure of another, meaning that modules are "trading data around too much". For example, classes or modules that constantly "whisper to each other by the coffee machine" require separation. A specific instance of this coupling occurs in inheritance hierarchies, where subclasses inevitably "know more about their parents than their parents would like them to know".

## Why it's a Problem

Inappropriate Intimacy creates significant fragility and reduces the modularity of the codebase:

- **Tight Coupling and Rippling Changes**: When modules communicate too closely and trade too much data, coupling is increased. This tight coupling makes the architecture brittle. In tightly coupled architectures, changes to another part of the system. This necessitates extensive testing of related components whenever a change is made to ne component.

- **Violation of Information Hiding**: The existence of excessive knowledge about another module's internals violates the principle of information hiding. Information hiding aims to conceal implementation details behind a boundary and expose only the minimal necessary interface. If code ownership boundaries are present,tight coupling prevents necessary refactoring because changes in one module will break the clients in the other.

- **Pathological Coupling Risk**: When a upstream service accesses the internals of a downstream service and modifies its internal state, this highly undesirable scenario is know as **Content Coupling** (or pathological coupling). Content coupling exposes internal data structures, requiring extreme care when making subsequent changes to the service that owns the data.

## Refactoring Technique

### Hide Delegate

```typescript
class Department {
  private manager: string;

  constructor(manager: string) {
    this.manager = manager;
  }

  getManager(): string {
    return this.manager;
  }

  setManager(manager: string): void {
    this.manager = manager;
  }
}

class Employee {
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
```

Create a new method in class A that delegates the call to object B. Now the client doesn't know about, or depend on, class B

```typescript
class Department {
  private manager: string;

  constructor(manager: string) {
    this.manager = manager;
  }

  getName(): string {
    return this.name;
  }

  getManager(): string {
    return this.department.getManager();
  }

  setManager(manager: string): void {
    this.department.setManager(manager);
  }
}
```

## When Not to Refactor

The primary solution for eliminating this smell is to use refactorings like **Move Function** and **Move Field** to consolidate features and reduce the need for modules to "chat". However, immediate refactoring may not always be necessary or straightforward.

- **Orthogonal Coupling**: Not all interactions denote design flaws. Sometimes two parts of an architecture are necessarily coupled because they fulfill two distinct purposes that mus intersect to create a complete solution (know as orthogonal coupling), such as monitoring infrastructure intersecting with domain behavior. Architects must recognize these intersections to minimize unnecessary entanglement.

- **Minor Behavioral Reuse in Inheritance**: Although inheritance naturally leads to coupling between superclasses and subclasses, the "refused bequest" smell (where a subclass reuses behavior but does not want to support the interface of the superclass) is often too subtle to warrant immediate elimination. If the refusal involves only implementation details, it may be acceptable to leave it, provided the coupling does not cause confusion or problems.

- **Using Intermediaries as a Stepping Stone**: When modules have common interests that lead to intimacy, a third module can be introduced to hold that commonality, acting as a "well-regulated-vehicle". Similarly, temporary delegation techniques like **Hide Delegate** can be used to make one module an intermediary, reducing direct coupling, before eventually collapsing the relationship entirely using **Remove MIddle Man**.
