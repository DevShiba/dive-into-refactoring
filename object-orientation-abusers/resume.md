# Object Orientation Abusers

The classification "Object-Orientation Abusers" refers to a category of code smells that indicate potential design issues within software, particularly within object-oriented paradigms.

## Alternative Classes With Different Interfaces

- **Definition**: This smell occurs when classes that should be substitutable for one another have different interfaces. The interface are not the same, preventing one class from easily swapping in for another.
- **Impact**: The primary impact is the loss of one of the great benefits of using classes: support for substitution. Substitution requires that class interfaces match up.
- **Solutions/Refactorings**: To fix this smell, use **Change Function Declaration** to ensure functions match up. You can also use **Move Function** to shift behavior into classes until the protocols algin. If the process of aligning interfaces introduces duplication, use **Extract Superclass** to resolve the issue.

## Refused Bequest

- **Definition**: Occurs when a subclass chooses to inherit the methods and data of its parent but doest not use or need much of what is inherited. Developers may use subclassing to reuse a small bit of behavior but refuse to support the full interface of the superclass.
- **Impact**: Traditionally, this indicates that the inheritance hierarchy is incorrect. The smell is much stronger if the subclass is refusing the interface of the superclass, as opposed to simply refusing an implementation. However, the smell is often too faint to be worth fixing, and subclassing to reuse behavior can be acceptable practice.
- **Solutions/Refactorings**: The traditional solution involves shifting code around so the parent only holds what is common. Use **Push Down Method** and **Push Down Field** to move unused code to a ew sibling class. If the main concern is refusing the superclass interface, the inheritance structure should be placed by applying **Replace Subclass with Delegate** or **Replace Superclass with Delegate**.

## Switch Statements

- **Definition**: This smells focuses on the "repeated switch", where the same conditional logic appears redundantly in different locations. Historically, any siwtchs statement was considered suspicious because polymorphism was underappreciated.
- **Impact**: Duplicate switches create a maintenance problem: whenever a new clause is added, all instances of the duplicate switching logic must be found and updated.
- **Solutions/Refactorings**: Polymorphism provides an elegant solution against repetition. The core refactoring is **Replace Conditional with Polymorphism**.

## Temporary Fields

- **Definition**: This occurs when a field within a class is set only under specific circumstances and is not universally needed by the object.
- **Impact**:
  This code is difficult to understand because developers expect an object to consistently use all of its declared fields
  . Trying to figure out why a field is present when it appears unused can cause significant confusion.
- **Solutions/Refactorings**: To isolate the problematic fields and related logic: use **Extract Class** to create a new home for the field. Then, use **Move Function** to place all functions related to that field into the new class. To eliminate conditional dependencies, use **Introduce Special Case** to create an alternative class that handles situations where the variables are invalid or unneeded.
