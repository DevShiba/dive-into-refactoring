// Problem: Temporary Fields Code Smell
// The Order class has temporary fields that are only used during discount calculation
class Order {
  private items: OrderItem[] = [];
  private customerType: string = '';
  
  // Temporary fields - only used during discount calculation
  private discountPercentage: number = 0;
  private minimumAmount: number = 0;
  private volumeThreshold: number = 0;
  private isEligibleForDiscount: boolean = false;

  constructor(customerType: string) {
    this.customerType = customerType;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  calculateTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.getPrice(), 0);
    
    // These temporary fields are populated only during discount calculation
    this.setupDiscountParameters();
    this.checkDiscountEligibility(subtotal);
    
    let total = subtotal;
    if (this.isEligibleForDiscount) {
      total = subtotal * (1 - this.discountPercentage / 100);
    }
    
    // Clear temporary fields after use
    this.clearTemporaryFields();
    
    return total;
  }

  private setupDiscountParameters(): void {
    switch (this.customerType) {
      case 'VIP':
        this.discountPercentage = 15;
        this.minimumAmount = 100;
        this.volumeThreshold = 5;
        break;
      case 'PREMIUM':
        this.discountPercentage = 10;
        this.minimumAmount = 200;
        this.volumeThreshold = 3;
        break;
      case 'REGULAR':
        this.discountPercentage = 5;
        this.minimumAmount = 300;
        this.volumeThreshold = 10;
        break;
      default:
        this.discountPercentage = 0;
        this.minimumAmount = 0;
        this.volumeThreshold = 0;
    }
  }

  private checkDiscountEligibility(subtotal: number): void {
    this.isEligibleForDiscount = 
      subtotal >= this.minimumAmount && 
      this.items.length >= this.volumeThreshold;
  }

  private clearTemporaryFields(): void {
    this.discountPercentage = 0;
    this.minimumAmount = 0;
    this.volumeThreshold = 0;
    this.isEligibleForDiscount = false;
  }
}

class OrderItem {
  constructor(private name: string, private price: number) {}

  getPrice(): number {
    return this.price;
  }

  getName(): string {
    return this.name;
  }
}

// Usage example showing the problem
const order = new Order('VIP');
order.addItem(new OrderItem('Laptop', 1200));
order.addItem(new OrderItem('Mouse', 25));
order.addItem(new OrderItem('Keyboard', 75));

console.log('Order total:', order.calculateTotal());

// ============================================================================
// Solution: Extract Class Refactoring
// Extract the temporary fields and related logic into a separate DiscountCalculator class

class DiscountCalculator {
  private discountPercentage: number = 0;
  private minimumAmount: number = 0;
  private volumeThreshold: number = 0;

  constructor(customerType: string) {
    this.setupDiscountParameters(customerType);
  }

  calculateDiscount(subtotal: number, itemCount: number): number {
    if (this.isEligibleForDiscount(subtotal, itemCount)) {
      return subtotal * (this.discountPercentage / 100);
    }
    return 0;
  }

  private setupDiscountParameters(customerType: string): void {
    switch (customerType) {
      case 'VIP':
        this.discountPercentage = 15;
        this.minimumAmount = 100;
        this.volumeThreshold = 5;
        break;
      case 'PREMIUM':
        this.discountPercentage = 10;
        this.minimumAmount = 200;
        this.volumeThreshold = 3;
        break;
      case 'REGULAR':
        this.discountPercentage = 5;
        this.minimumAmount = 300;
        this.volumeThreshold = 10;
        break;
      default:
        this.discountPercentage = 0;
        this.minimumAmount = 0;
        this.volumeThreshold = 0;
    }
  }

  private isEligibleForDiscount(subtotal: number, itemCount: number): boolean {
    return subtotal >= this.minimumAmount && itemCount >= this.volumeThreshold;
  }
}

// Refactored Order class - cleaner and focused on its core responsibility
class RefactoredOrder {
  private items: OrderItem[] = [];
  private customerType: string = '';

  constructor(customerType: string) {
    this.customerType = customerType;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  calculateTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.getPrice(), 0);
    
    // Delegate discount calculation to the extracted class
    const discountCalculator = new DiscountCalculator(this.customerType);
    const discount = discountCalculator.calculateDiscount(subtotal, this.items.length);
    
    return subtotal - discount;
  }
}

// Usage example showing the solution
const refactoredOrder = new RefactoredOrder('VIP');
refactoredOrder.addItem(new OrderItem('Laptop', 1200));
refactoredOrder.addItem(new OrderItem('Mouse', 25));
refactoredOrder.addItem(new OrderItem('Keyboard', 75));

console.log('Refactored order total:', refactoredOrder.calculateTotal());