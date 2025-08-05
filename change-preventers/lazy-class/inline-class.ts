// Lazy Class Code Smell Example
// Problem: OrderInfo class does almost nothing and doesn't justify its existence

class OrderInfo {
  private orderId: string;

  constructor(orderId: string) {
    this.orderId = orderId;
  }

  getOrderId(): string {
    return this.orderId;
  }
}

class Order {
  private orderInfo: OrderInfo;
  private items: string[];
  private totalAmount: number;

  constructor(orderId: string, items: string[], totalAmount: number) {
    this.orderInfo = new OrderInfo(orderId);
    this.items = items;
    this.totalAmount = totalAmount;
  }

  getOrderId(): string {
    return this.orderInfo.getOrderId();
  }

  getItems(): string[] {
    return this.items;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  displayOrderSummary(): string {
    return `Order ${this.getOrderId()}: ${this.items.length} items, Total: $${
      this.totalAmount
    }`;
  }
}

// Usage
const order = new Order("ORD-001", ["Laptop", "Mouse"], 1299.99);
console.log(order.displayOrderSummary());
console.log(`Order ID: ${order.getOrderId()}`);

// ============================================================================

// The Solution
class RefactoredOrder {
  private orderId: string;
  private items: string[];
  private totalAmount: number;

  constructor(orderId: string, items: string[], totalAmount: number) {
    this.orderId = orderId;
    this.items = items;
    this.totalAmount = totalAmount;
  }

  getOrderId(): string {
    return this.orderId;
  }

  getItems(): string[] {
    return this.items;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  displayOrderSummary(): string {
    return `Order ${this.orderId}: ${this.items.length} items, Total: $${this.totalAmount}`;
  }
}

// Usage example
const refactoredOrder = new RefactoredOrder(
  "ORD-001",
  ["Laptop", "Mouse"],
  1299.99
);
console.log(refactoredOrder.displayOrderSummary());
console.log(`Order ID: ${refactoredOrder.getOrderId()}`);
