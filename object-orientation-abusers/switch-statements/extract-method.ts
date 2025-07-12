// The Problem
// You have a code fragment that can be grouped together.

interface Product {
  price: number;
  quantity: number;
}

interface User {
  getCountry(): string;
}

const user: User = {
  getCountry: () => "US",
};

class Order {
  private total = 0;

  public getProducts(): Product[] {
    return [
      { price: 100, quantity: 2 },
      { price: 200, quantity: 1 },
      { price: 50, quantity: 5 },
    ];
  }

  public calculateTotal(): number {
    this.total = 0;
    for (let product of this.getProducts()) {
      this.total += product.price * product.quantity;
    }

    switch (user.getCountry()) {
      case "US":
        this.total *= 0.85;
        break;
      case "RU":
        this.total *= 0.75;
        break;
      case "CN":
        this.total *= 0.9;
        break;
      default:
        this.total *= 1.0;
    }

    return this.total;
  }
}

// The Solution
// Move this code to a saparate new method (or function) and replace the old code with a call to the method.
class RefactoredOrder {
  private total = 0;

  public getProducts(): Product[] {
    return [
      { price: 10, quantity: 2 },
      { price: 15, quantity: 1 },
    ];
  }

  public calculateTotal() {
    this.total = 0;

    for (let product of this.getProducts()) {
      this.total += product.price * product.quantity;
    }

    this.total = this.applyRegionalDiscounts(this.total);
    return this.total;
  }

  public applyRegionalDiscounts(total: number): number {
    switch (user.getCountry()) {
      case "US":
        return total * 1.1;
      case "EU":
        return total * 1.2;
      case "ASIA":
        return total * 1.3;
      default:
        return total;
    }
  }
}

// Example
const order = new Order();
console.log("Original order total:", order.calculateTotal());

const refactoredOrder = new RefactoredOrder();
console.log("Refactored order total:", refactoredOrder.calculateTotal());
