// The Problem
// Calling a query method and passing its results as the parameters of another method, while that method could call the query directly.

class Order {
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

  private discountedPrice(
    basePrice: number,
    seasonDiscount: number,
    fees: number
  ): number {
    const discountAmount = basePrice * seasonDiscount;
    return basePrice - discountAmount + fees;
  }

  calculateFinalPrice(): number {
    const basePrice = this.quantity * this.itemPrice;
    const seasonDiscount = this.getSeasonalDiscount();
    const fees = this.getFees();

    return this.discountedPrice(basePrice, seasonDiscount, fees);
  }
}

// The Solution
// Instead of passing the value through a parameter, try placing a query call inside the method body.
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

  calculateFinalPrice(): number {
    const basePrice = this.quantity * this.itemPrice;
    return this.discountedPrice(basePrice);
  }
}

// Usage example
console.log("=== Original Implementation ===");
const order = new Order();
console.log("Final price:", order.calculateFinalPrice());

console.log("\n=== Refactored Implementation ===");
const refactoredOrder = new RefactoredOrder();
console.log("Final price:", refactoredOrder.calculateFinalPrice());