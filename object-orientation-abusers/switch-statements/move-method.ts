// The Problem
// A method is used more in another class than in its own class.

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

// The Solution
// Create a new method in the class that uses the method the most, then move the code from the old method to there.
// Turn the code of the original method into a reference to the new method in the other class or else remove it entirely.

class RefactoredOrder {
  private total = 0;

  public getProducts(): Product[] {
    return [
      { price: 10, quantity: 2 },
      { price: 15, quantity: 1 },
    ];
  }

  public calculateTotal(): number {
    this.total = 0;

    for (let product of this.getProducts()) {
      this.total += product.price * product.quantity;
    }

    this.total = Discounts.applyRegionalDiscounts(
      this.total,
      user.getCountry()
    );
    this.total = Discounts.applyCoupons(this.total);
    return this.total;
  }
}

class Discounts {
  public static applyRegionalDiscounts(total: number, country: string): number {
    switch (country) {
      case "US":
        return total * 0.85;
      case "RU":
        return total * 0.75;
      case "CN":
        return total * 0.9;
      default:
        return total;
    }
  }

  public static applyCoupons(total: number): number {
    if (total > 100) {
      return total * 0.9;
    }
    return total;
  }
}

// Usage example
const order = new Order();
console.log("Original order total:", order.calculateTotal());

const refactoredOrder = new RefactoredOrder();
console.log("Refactored order total:", refactoredOrder.calculateTotal());

