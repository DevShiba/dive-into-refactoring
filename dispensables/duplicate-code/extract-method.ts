// The Problem: You have a code fragment that can be grouped together.

class Invoice {
  private name: string;
  private amount: number;
  private orders: Array<{ product: string; price: number; quantity: number }>;

  constructor(name: string, amount: number, orders: Array<{ product: string; price: number; quantity: number }>) {
    this.name = name;
    this.amount = amount;
    this.orders = orders;
  }

  printInvoice(): void {
    this.printBanner();
    
    // Duplicate code starts here
    console.log(`Customer: ${this.name}`);
    console.log(`Amount: $${this.amount.toFixed(2)}`);
    console.log('-------------------');
    // Duplicate code ends here
    
    this.printOrderDetails();
  }

  // Method 2 with duplicate code
  printReceipt(): void {
    this.printBanner();
    
    // Same duplicate code again
    console.log(`Customer: ${this.name}`);
    console.log(`Amount: $${this.amount.toFixed(2)}`);
    console.log('-------------------');
    // Same duplicate code ends here
    
    console.log('Thank you for your business!');
  }

  private printBanner(): void {
    console.log('***********************');
    console.log('    COMPANY INVOICE    ');
    console.log('***********************');
  }

  private printOrderDetails(): void {
    console.log('Order Details:');
    this.orders.forEach(order => {
      console.log(`${order.product} x${order.quantity} - $${(order.price * order.quantity).toFixed(2)}`);
    });
  }
}

// ============================================================================
// Solution: Extract Method Refactoring
// Extract the duplicate code into a separate method

class InvoiceRefactored {
  private name: string;
  private amount: number;
  private orders: Array<{ product: string; price: number; quantity: number }>;

  constructor(name: string, amount: number, orders: Array<{ product: string; price: number; quantity: number }>) {
    this.name = name;
    this.amount = amount;
    this.orders = orders;
  }

  printInvoice(): void {
    this.printBanner();
    this.printCustomerDetails(); // Extracted method call
    this.printOrderDetails();
  }

  printReceipt(): void {
    this.printBanner();
    this.printCustomerDetails(); // Same extracted method call
    console.log('Thank you for your business!');
  }

  private printCustomerDetails(): void {
    console.log(`Customer: ${this.name}`);
    console.log(`Amount: $${this.amount.toFixed(2)}`);
    console.log('-------------------');
  }

  private printBanner(): void {
    console.log('***********************');
    console.log('    COMPANY INVOICE    ');
    console.log('***********************');
  }

  private printOrderDetails(): void {
    console.log('Order Details:');
    this.orders.forEach(order => {
      console.log(`${order.product} x${order.quantity} - $${(order.price * order.quantity).toFixed(2)}`);
    });
  }
}

// Usage example
const orders = [
  { product: 'Widget A', price: 10.99, quantity: 2 },
  { product: 'Widget B', price: 15.50, quantity: 1 }
];

const invoice = new InvoiceRefactored('John Doe', 37.48, orders);

console.log('=== INVOICE ===');
invoice.printInvoice();

console.log('\n=== RECEIPT ===');
invoice.printReceipt();