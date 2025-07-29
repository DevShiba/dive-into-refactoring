// The Problem
// Long Parameter List: A method has too many parameters, making it hard to understand and use
class PaymentProcessor {
  processPayment(
    amount: number,
    currency: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string,
    billingStreet: string,
    billingCity: string,
    billingState: string,
    billingZip: string,
    billingCountry: string,
    email: string,
    phone: string,
    merchantId: string,
    transactionType: string,
    isRecurring: boolean,
    description: string
  ): string {
    console.log(`Processing ${transactionType} payment for ${amount} ${currency}`);
    console.log(`Card: ${cardNumber} - ${cardHolderName}`);
    console.log(`Expires: ${expiryMonth}/${expiryYear}, CVV: ${cvv}`);
    console.log(`Billing: ${billingStreet}, ${billingCity}, ${billingState} ${billingZip}, ${billingCountry}`);
    console.log(`Contact: ${email}, ${phone}`);
    console.log(`Merchant: ${merchantId}, Recurring: ${isRecurring}`);
    console.log(`Description: ${description}`);
    
    return `Transaction-${Date.now()}`;
  }

  refundPayment(
    transactionId: string,
    amount: number,
    currency: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string,
    billingStreet: string,
    billingCity: string,
    billingState: string,
    billingZip: string,
    billingCountry: string,
    email: string,
    phone: string,
    merchantId: string,
    reason: string
  ): string {
    console.log(`Processing refund for transaction ${transactionId}`);
    console.log(`Amount: ${amount} ${currency}`);
    console.log(`Reason: ${reason}`);
    return `Refund-${Date.now()}`;
  }
}

class OrderService {
  createOrder(
    customerId: string,
    amount: number,
    currency: string,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string,
    billingStreet: string,
    billingCity: string,
    billingState: string,
    billingZip: string,
    billingCountry: string,
    email: string,
    phone: string,
    productId: string,
    quantity: number,
    shippingMethod: string
  ): void {
    console.log(`Creating order for customer ${customerId}`);
    console.log(`Product: ${productId}, Quantity: ${quantity}`);
    console.log(`Shipping: ${shippingMethod}`);
    console.log(`Payment: ${amount} ${currency}`);
  }
}

// Usage - Long parameter lists are error-prone and hard to read
const processor = new PaymentProcessor();
const orderService = new OrderService();

processor.processPayment(
  99.99,
  "USD",
  "4111111111111111",
  12,
  2025,
  "123",
  "John Doe",
  "123 Main St",
  "Springfield",
  "IL",
  "62701",
  "USA",
  "john@example.com",
  "555-1234",
  "MERCHANT123",
  "purchase",
  false,
  "Online store purchase"
);

orderService.createOrder(
  "CUST123",
  99.99,
  "USD",
  "4111111111111111",
  12,
  2025,
  "123",
  "John Doe",
  "123 Main St",
  "Springfield",
  "IL",
  "62701",
  "USA",
  "john@example.com",
  "555-1234",
  "PROD456",
  2,
  "express"
);

// ============================================================

// The Solution
// Introduce Parameter Object - Group related parameters into objects
class PaymentAmount {
  amount: number;
  currency: string;

  constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }

  getFormattedAmount(): string {
    return `${this.amount} ${this.currency}`;
  }

  isValidAmount(): boolean {
    return this.amount > 0;
  }
}

class CreditCard {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardHolderName: string;

  constructor(
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardHolderName: string
  ) {
    this.cardNumber = cardNumber;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
    this.cvv = cvv;
    this.cardHolderName = cardHolderName;
  }

  getDisplayNumber(): string {
    return `****-****-****-${this.cardNumber.slice(-4)}`;
  }

  getExpiryDate(): string {
    return `${this.expiryMonth.toString().padStart(2, '0')}/${this.expiryYear}`;
  }

  isExpired(): boolean {
    const now = new Date();
    const cardExpiry = new Date(this.expiryYear, this.expiryMonth - 1);
    return cardExpiry < now;
  }
}

class BillingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  constructor(street: string, city: string, state: string, zip: string, country: string) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}, ${this.country}`;
  }

  getLocationInfo(): string {
    return `${this.city}, ${this.state}, ${this.country}`;
  }
}

class ContactInfo {
  email: string;
  phone: string;

  constructor(email: string, phone: string) {
    this.email = email;
    this.phone = phone;
  }

  getContactDetails(): string {
    return `${this.email}, ${this.phone}`;
  }

  isValidEmail(): boolean {
    return this.email.includes('@');
  }
}

class TransactionDetails {
  merchantId: string;
  transactionType: string;
  isRecurring: boolean;
  description: string;

  constructor(merchantId: string, transactionType: string, isRecurring: boolean, description: string) {
    this.merchantId = merchantId;
    this.transactionType = transactionType;
    this.isRecurring = isRecurring;
    this.description = description;
  }

  getTransactionInfo(): string {
    return `${this.transactionType} (${this.merchantId})`;
  }
}

class OrderDetails {
  customerId: string;
  productId: string;
  quantity: number;
  shippingMethod: string;

  constructor(customerId: string, productId: string, quantity: number, shippingMethod: string) {
    this.customerId = customerId;
    this.productId = productId;
    this.quantity = quantity;
    this.shippingMethod = shippingMethod;
  }

  getOrderSummary(): string {
    return `Customer ${this.customerId}: ${this.quantity}x ${this.productId} via ${this.shippingMethod}`;
  }
}

class RefactoredPaymentProcessor {
  processPayment(
    paymentAmount: PaymentAmount,
    creditCard: CreditCard,
    billingAddress: BillingAddress,
    contactInfo: ContactInfo,
    transactionDetails: TransactionDetails
  ): string {
    console.log(`Processing ${transactionDetails.getTransactionInfo()} payment for ${paymentAmount.getFormattedAmount()}`);
    console.log(`Card: ${creditCard.getDisplayNumber()} - ${creditCard.cardHolderName}`);
    console.log(`Expires: ${creditCard.getExpiryDate()}, CVV: ${creditCard.cvv}`);
    console.log(`Billing: ${billingAddress.getFullAddress()}`);
    console.log(`Contact: ${contactInfo.getContactDetails()}`);
    console.log(`Recurring: ${transactionDetails.isRecurring}`);
    console.log(`Description: ${transactionDetails.description}`);
    
    return `Transaction-${Date.now()}`;
  }

  refundPayment(
    transactionId: string,
    paymentAmount: PaymentAmount,
    creditCard: CreditCard,
    billingAddress: BillingAddress,
    contactInfo: ContactInfo,
    reason: string
  ): string {
    console.log(`Processing refund for transaction ${transactionId}`);
    console.log(`Amount: ${paymentAmount.getFormattedAmount()}`);
    console.log(`Reason: ${reason}`);
    return `Refund-${Date.now()}`;
  }
}

class RefactoredOrderService {
  createOrder(
    orderDetails: OrderDetails,
    paymentAmount: PaymentAmount,
    creditCard: CreditCard,
    billingAddress: BillingAddress,
    contactInfo: ContactInfo
  ): void {
    console.log(`Creating order: ${orderDetails.getOrderSummary()}`);
    console.log(`Payment: ${paymentAmount.getFormattedAmount()}`);
  }
}

// Usage after refactoring
console.log("=== After Refactoring ===");

const paymentAmount = new PaymentAmount(99.99, "USD");
const creditCard = new CreditCard(
  "4111111111111111",
  12,
  2025,
  "123",
  "John Doe"
);
const billingAddress = new BillingAddress(
  "123 Main St",
  "Springfield",
  "IL",
  "62701",
  "USA"
);
const contactInfo = new ContactInfo("john@example.com", "555-1234");
const transactionDetails = new TransactionDetails(
  "MERCHANT123",
  "purchase",
  false,
  "Online store purchase"
);
const orderDetails = new OrderDetails("CUST123", "PROD456", 2, "express");

const refactoredProcessor = new RefactoredPaymentProcessor();
const refactoredOrderService = new RefactoredOrderService();

refactoredProcessor.processPayment(
  paymentAmount,
  creditCard,
  billingAddress,
  contactInfo,
  transactionDetails
);

refactoredOrderService.createOrder(
  orderDetails,
  paymentAmount,
  creditCard,
  billingAddress,
  contactInfo
);

// Benefits:
// 1. Dramatic parameter reduction (18 params - 5 meaningful objects)
// 2. Self-documenting code - parameter types clearly indicate what data is expected
// 3. Reusable objects - same objects can be used across multiple methods
// 4. Type safety - impossible to mix up parameter order
// 5. Easier maintenance - adding new fields only requires updating relevant classes
// 6. Better encapsulation - related data is grouped together with helpful methods
// 7. Reduced cognitive load - easier to understand method signatures
// 8. Validation methods - each object can have its own validation logic
// 9. Display methods - objects can format their own data for display