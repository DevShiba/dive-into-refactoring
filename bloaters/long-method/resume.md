# Long Method

Also reffered to as "Long Function" is a common code smell that describes functions or methods that contain an excessive number of lines of code or too many responsabilities. While a short program might tolerate such a structure, in a larger system, a single long function can significantly hinder comprehension and maintenance.

## Why it's a Problem

- **Difficulty in Understanding and Reasoning**: Programs with overly long functions are harder to developers to graps, leading to increased effort in figuring out what the code does. A good heuristic is that if you need comment something, you should instead write a function named after the intention of that code.

- **Increased Risk of Bugs and Errors:**: Complexity and lack of clarity in long methods make it easier for developers to overlook hidden assumptions, unintended consequences, or unexpected interactions, thereby increasing the risk of introducing bugs. When logic is duplicated across a long method, ensuring consistent updates becomes challenging, potentially leading to errors. Refactoring, by clarifying the program's structure, can help in spotting these bugs.

- **Obscures Intent and Hides Purpose**: Long methods often blend the "what" (the function's purpose) with the "how" (its implementation details). This makes it hard to see the high-level intent, forcing anyone reading the code to delve into low-level mechanics to understand its goal.

- **Hinders Modularity and Decomposition**: Long functions make it difficult to logically break down a program into smaller, reusable components. They can introduce many locally scoped variables, complicating the process of extracting smaller, more focused functions. Without good modularity, changes tend to ripple across the codebase.

- **Slows Down Feature Development and Bug Fixes**: Although initially avoiding refactoring a long method might seem faster, over time, a codebase burdened with complex, long methods slows down development. Adding new features or fixing bugs becomes more time-consuming as developers struggle to understand the existing code, leading to a desire to rewrite the system from scratch.

- **Promotes Design Decay**: : Without continuous refactoring to address issues like long methods, the internal design and architecture of the software tend to decay. This makes the code harder to read, understand, and maintain, leading to a faster decline in its structural integrity.

- **Encourages Duplication**: Long methods can lead to duplicated code because extracting similar logic for reuse becomes cumbersome. nstead, developers might copy-paste, creating multiple places that need to be updated if the logic changes.

## Refactoring Techniques

### Extract Method

Moves a code fragment to a separate new method, replacing the old code with a call to the method. This technique helps break down long methods into smaller, more manageable pieces.

```typescript
// Before: Long method with mixed responsibilities
class Invoice {
  name: string = "";

  PrintBanner(): void {
    console.log("**************************");
    console.log("***** Customer Owes ******");
    console.log("**************************");
  }

  GetOutstanding(): number {
    return 1500.0;
  }

  PrintOwing(): void {
    this.PrintBanner();

    console.log("name: " + this.name);
    console.log("amount: " + this.GetOutstanding());
  }
}
```

**Code Issue**: The `PrintOwing` method handles both banner printing and details printing, mixing different concerns and making the method longer than necessary.

```typescript
// After: Extracted PrintDetails method
class Invoice {
  name: string = "";

  PrintBanner(): void {
    console.log("**************************");
    console.log("***** Customer Owes ******");
    console.log("**************************");
  }

  GetOutstanding(): number {
    // Calculate outstanding amount
    return 1500.0;
  }

  PrintDetails(): void {
    // Print details.
    console.log("name: " + this.name);
    console.log("amount: " + this.GetOutstanding());
  }

  PrintOwing(): void {
    this.PrintBanner();
    this.PrintDetails();
  }
}
```

**Benefits**: Improves readability by separating concerns into focused methods. Makes the code easier to test and reuse individual parts.

**Trade-off Consideration**: May introduce more method calls, which could have a slight performance impact in performance-critical sections.

### Parameter Object

Replaces a group of parameters that frequently appear together with a single object, reducing method signature complexity.

```typescript
// Before: Multiple related parameters
class Order {
  amountInvoicedIn(amount: number, currency: string): void {
    console.log(`Invoiced amount: ${amount} ${currency}`);
  }

  amountReceivedIn(amount: number, currency: string): void {
    console.log(`Received amount: ${amount} ${currency}`);
  }

  amountOverdueIn(amount: number, currency: string): void {
    console.log(`Overdue amount: ${amount} ${currency}`);
  }
}
```

**Code Issue**: Methods repeatedly use the same parameter pair (amount and currency), creating long parameter lists and potential for errors in parameter order.

```typescript
// After: Parameter object encapsulates related data
interface AmountDetails {
  amount: number;
  currency: string;
}

class Order {
  amountInvoicedIn(details: AmountDetails): void {
    console.log(`Invoiced amount: ${details.amount} ${details.currency}`);
  }

  amountReceivedIn(details: AmountDetails): void {
    console.log(`Received amount: ${details.amount} ${details.currency}`);
  }

  amountOverdueIn(details: AmountDetails): void {
    console.log(`Overdue amount: ${details.amount} ${details.currency}`);
  }
}
```

**Benefits**: Reduces parameter list length and prevents parameter order mistakes. Makes it easier to add new properties to the parameter object without changing all method signatures.

**Trade-off Consideration**: Creates an additional object that needs to be instantiated, which might be unnecessary for simple cases with few parameters.

### Replace Temp With Query

Replaces a temporary variable with a method call, eliminating the need to store intermediate results.

```typescript
// Before: Temporary variable for intermediate calculation
class PriceCalculator {
  quantity: number = 10;
  itemPrice: number = 150.0;

  CalculateTotal(): number {
    const basePrice = this.quantity * this.itemPrice;

    if (basePrice > 1000) {
      return basePrice * 0.95;
    }

    return basePrice * 0.98;
  }
}
```

**Code Issue**: The `basePrice` temporary variable is only used within the method and could be replaced with a query method for better encapsulation.

```typescript
// After: Extracted BasePrice method
class PriceCalculator {
  quantity: number = 10;
  itemPrice: number = 150;

  BasePrice(): number {
    return this.quantity * this.itemPrice;
  }

  CalculateTotal(): number {
    if (this.BasePrice() > 1000) {
      return this.BasePrice() * 0.95;
    }

    return this.BasePrice() * 0.98;
  }
}
```

**Benefits**: Eliminates temporary variables, making the method more concise. The extracted method can be reused elsewhere and makes the code more testable.

**Trade-off Consideration**: Multiple calls to the query method might have performance implications if the calculation is expensive, though this is usually negligible.

## When Not to Refactor

- **Code That Will Not Be Modified**: If a long or messy piece of code is stable and does not need to be modified, and can effectively be treated as an external API, then refactoring it may not yield any practical benefit. Refactoring is most valuable when you need to understand or change the code.

- **Rewriting is a Better Option**: In extreme cases, if a method or component is so convulated and deeply intertwined that refactoring it would be more complex and time-consuming than simply rewriting it, then a rewrite might be prefered. This decision requires careful judgment and experience.

- **Disproportionate Effort for Small Gains**: Sometimes, a large-scale refactoring of a long method might be necessary, but the immediate task involves adding a very small feature. In such scenarios, a developer might choose to add the small feature and defer the large refactoring, especially if the code is rarely touched or the inconvenience is minor. However, the "camping rule" suggests leaving the codebase slightly better than you found it, even with small changes.

- **Initial Performance Concerns**: While a well-factored codebase is easier to tune for performance, some refactorings (like replacing a temporary variable with a query or splitting a loop) might initially introduce perceived performance overhead. However, such performance impacts are usually negligible, and the advice is to prioritize clarity and then optimize later if a bottleneck is identified. The economic benefits of refactoring, such as faster feature delivery and bug fixes, should be the primary drivers, rather than concerns about immediate performance.
