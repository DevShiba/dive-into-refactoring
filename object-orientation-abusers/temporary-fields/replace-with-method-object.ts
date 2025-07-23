// The Problem
// Temporary fields that are only used in specific methods and complex intertwined logic

enum CustomerType {
  REGULAR = "REGULAR",
  PREMIUM = "PREMIUM",
  VIP = "VIP",
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  category: string;
  weight: number;
}

class Order {
  private items: OrderItem[] = [];
  private customerType: CustomerType = CustomerType.REGULAR;
  private region: string = "US";
  private seasonalDiscount: number = 0;

  // Temporary fields - only used during price calculation
  private primaryBasePrice: number = 0;
  private secondaryBasePrice: number = 0;
  private tertiaryBasePrice: number = 0;
  private discountAmount: number = 0;
  private taxAmount: number = 0;
  private shippingCost: number = 0;
  private loyaltyDiscount: number = 0;
  private bulkDiscount: number = 0;

  constructor(items: OrderItem[], customerType: CustomerType, region: string) {
    this.items = items;
    this.customerType = customerType;
    this.region = region;
  }

  calculatePrice(): number {
    this.primaryBasePrice = 0;
    this.secondaryBasePrice = 0;
    this.tertiaryBasePrice = 0;
    this.discountAmount = 0;
    this.taxAmount = 0;
    this.shippingCost = 0;
    this.loyaltyDiscount = 0;
    this.bulkDiscount = 0;

    // Complex calculation logic that's hard to extract due to intertwined variables
    for (const item of this.items) {
      if (item.category === "electronics") {
        this.primaryBasePrice += item.price * item.quantity;
      } else if (item.category === "clothing") {
        this.secondaryBasePrice += item.price * item.quantity * 0.9; // 10% discount
      }
    }

    if (this.customerType === CustomerType.PREMIUM) {
      this.loyaltyDiscount =
        (this.primaryBasePrice +
          this.secondaryBasePrice +
          this.tertiaryBasePrice) *
        0.1;
    } else if (this.customerType === CustomerType.VIP) {
      this.loyaltyDiscount =
        (this.primaryBasePrice +
          this.secondaryBasePrice +
          this.tertiaryBasePrice) *
        0.15;
    }

    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 10) {
      this.bulkDiscount = this.primaryBasePrice * 0.05;
    }
    if (totalItems > 20) {
      this.bulkDiscount += this.secondaryBasePrice * 0.03;
    }

    this.discountAmount =
      this.loyaltyDiscount +
      this.bulkDiscount +
      (this.primaryBasePrice + this.secondaryBasePrice) * this.seasonalDiscount;

    const totalWeight = this.items.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0
    );
    if (this.region === "US") {
      this.shippingCost = totalWeight * 0.5;
    } else if (this.region === "EU") {
      this.shippingCost = totalWeight * 0.7;
    }

    this.shippingCost = totalWeight * 1.2;

    if (
      this.primaryBasePrice + this.secondaryBasePrice + this.tertiaryBasePrice >
      100
    ) {
      this.shippingCost *= 0.8;
    }

    // Apply shipping discount for large orders
    if (
      this.primaryBasePrice + this.secondaryBasePrice + this.tertiaryBasePrice >
      100
    ) {
      this.shippingCost *= 0.8;
    }

    // Calculate tax
    const subtotal =
      this.primaryBasePrice +
      this.secondaryBasePrice +
      this.tertiaryBasePrice -
      this.discountAmount;
    if (this.region === "US") {
      this.taxAmount = subtotal * 0.08;
    } else if (this.region === "EU") {
      this.taxAmount = subtotal * 0.2;
    }

    this.taxAmount = subtotal * 0.15;

    // Final calculation
    return (
      this.primaryBasePrice +
      this.secondaryBasePrice +
      this.tertiaryBasePrice -
      this.discountAmount +
      this.shippingCost +
      this.taxAmount
    );
  }

  getItemCount(): number {
    return this.items.length;
  }

  getCustomerType(): CustomerType {
    return this.customerType;
  }
}

// ==========================================

// The Solution
// Replace Method with Method Object - Extract the complex calculation into a separate class
class RefactoredOrder {
  private items: OrderItem[] = [];
  private customerType: CustomerType = CustomerType.REGULAR;
  private region: string = "US";
  private seasonalDiscount: number = 0;

  constructor(items: OrderItem[], customerType: CustomerType, region: string) {
    this.items = items;
    this.customerType = customerType;
    this.region = region;
  }

  // Simple method that delegates to the method object
  calculatePrice(): number {
    return new PriceCalculator(this).compute();
  }

  // Getters for the calculator to access order data
  getItems(): OrderItem[] {
    return this.items;
  }

  getCustomerType(): CustomerType {
    return this.customerType;
  }

  getRegion(): string {
    return this.region;
  }

  getSeasonalDiscount(): number {
    return this.seasonalDiscount;
  }

  // Other methods remain clean
  getItemCount(): number {
    return this.items.length;
  }
}

// Method Object - temporary fields become instance fields of this class
class PriceCalculator {
  // Former temporary fields are now proper fields of this class
  private primaryBasePrice: number = 0;
  private secondaryBasePrice: number = 0;
  private tertiaryBasePrice: number = 0;
  private discountAmount: number = 0;
  private taxAmount: number = 0;
  private shippingCost: number = 0;
  private loyaltyDiscount: number = 0;
  private bulkDiscount: number = 0;

  // Order data copied from the original order
  private items: OrderItem[];
  private customerType: CustomerType;
  private region: string;
  private seasonalDiscount: number;

  constructor(order: RefactoredOrder) {
    this.items = order.getItems();
    this.customerType = order.getCustomerType();
    this.region = order.getRegion();
    this.seasonalDiscount = order.getSeasonalDiscount();
  }

  // Main computation method - now broken down into smaller methods
  compute(): number {
    this.calculateBasePrices();
    this.calculateDiscounts();
    this.calculateShipping();
    this.calculateTax();
    return this.getFinalPrice();
  }

  // Extracted method: Calculate base prices for different categories
  private calculateBasePrices(): void {
    for (const item of this.items) {
      if (item.category === "electronics") {
        this.primaryBasePrice += item.price * item.quantity;
      } else if (item.category === "clothing") {
        this.secondaryBasePrice += item.price * item.quantity * 0.95;
      }
      this.tertiaryBasePrice += item.price * item.quantity * 1.1;
    }
  }

  // Extracted method: Calculate all types of discounts
  private calculateDiscounts(): void {
    this.calculateLoyaltyDiscount();
    this.calculateBulkDiscount();
    this.applySeasonalDiscount();
  }

  // Extracted method: Calculate loyalty discount based on customer type
  private calculateLoyaltyDiscount(): void {
    const totalBasePrice =
      this.primaryBasePrice + this.secondaryBasePrice + this.tertiaryBasePrice;

    if (this.customerType === CustomerType.PREMIUM) {
      this.loyaltyDiscount = totalBasePrice * 0.1;
    } else if (this.customerType === CustomerType.VIP) {
      this.loyaltyDiscount = totalBasePrice * 0.15;
    }
  }

  // Extracted method: Calculate bulk discount
  private calculateBulkDiscount(): void {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 10) {
      this.bulkDiscount = this.primaryBasePrice * 0.05;
    }
    if (totalItems > 20) {
      this.bulkDiscount += this.secondaryBasePrice * 0.03;
    }
  }

  // Extracted method: Apply seasonal discount
  private applySeasonalDiscount(): void {
    this.discountAmount =
      this.loyaltyDiscount +
      this.bulkDiscount +
      (this.primaryBasePrice + this.secondaryBasePrice) * this.seasonalDiscount;
  }

  // Extracted method: Calculate shipping cost
  private calculateShipping(): void {
    const totalWeight = this.items.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0
    );

    // Base shipping cost by region
    if (this.region === "US") {
      this.shippingCost = totalWeight * 0.5;
    } else if (this.region === "EU") {
      this.shippingCost = totalWeight * 0.7;
    } else {
      this.shippingCost = totalWeight * 1.2;
    }

    // Apply shipping discount for large orders
    const totalBasePrice =
      this.primaryBasePrice + this.secondaryBasePrice + this.tertiaryBasePrice;
    if (totalBasePrice > 100) {
      this.shippingCost *= 0.8;
    }
  }

  private calculateTax(): void {
    const subtotal =
      this.primaryBasePrice +
      this.secondaryBasePrice +
      this.tertiaryBasePrice -
      this.discountAmount;

    if (this.region === "US") {
      this.taxAmount = subtotal * 0.08;
    } else if (this.region === "EU") {
      this.taxAmount = subtotal * 0.2;
    } else {
      this.taxAmount = subtotal * 0.15;
    }
  }

  private getFinalPrice(): number {
    return (
      this.primaryBasePrice +
      this.secondaryBasePrice +
      this.tertiaryBasePrice -
      this.discountAmount +
      this.shippingCost +
      this.taxAmount
    );
  }

  getBasePrice(): number {
    return (
      this.primaryBasePrice + this.secondaryBasePrice + this.tertiaryBasePrice
    );
  }

  getTotalDiscount(): number {
    return this.discountAmount;
  }

  getShippingCost(): number {
    return this.shippingCost;
  }

  getTaxAmount(): number {
    return this.taxAmount;
  }
}
