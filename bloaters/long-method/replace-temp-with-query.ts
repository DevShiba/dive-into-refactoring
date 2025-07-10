// The Problem
// You place the result of an expression in a local variable for later use in your code.

class PriceCalculator {
  quantity: number = 10;
  itemPrice: number = 150.0;

  CalculateTotal(): number {
    const basePrice = this.quantity * this.itemPrice;

    if (basePrice > 1000) {
      return basePrice * 0.95;
    } else {
      return basePrice * 0.98;
    }
  }
}

// The Solution
// Move the entire expression to a separate method and return the result from it. Query the method instead of using a variable. Incorporate the new method in other methods, if necessary.

class PriceCalculatorRefactored {
  quantity: number = 10;
  itemPrice: number = 150.0;

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
