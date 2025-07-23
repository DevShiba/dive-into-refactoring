// The Problem
// Switch Statement: You have a conditional that performs various actions depending on object type or properties
enum PaymentType {
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
  CRYPTO = "CRYPTO",
}

class PaymentProcessor {
  private type: PaymentType;
  private amount: number;
  private cardNumber?: string;
  private email?: string;
  private accountNumber?: string;
  private walletAddress?: string;

  constructor(
    type: PaymentType,
    amount: number,
    cardNumber?: string,
    email?: string,
    accountNumber?: string,
    walletAddress?: string
  ) {
    this.type = type;
    this.amount = amount;
    this.cardNumber = cardNumber;
    this.email = email;
    this.accountNumber = accountNumber;
    this.walletAddress = walletAddress;
  }

  // Switch statement smell: Different behavior based on type
  processPayment(): string {
    switch (this.type) {
      case PaymentType.CREDIT_CARD:
        return this.processCreditCard();
      case PaymentType.PAYPAL:
        return this.processPayPal();
      case PaymentType.BANK_TRANSFER:
        return this.processBankTransfer();
      case PaymentType.CRYPTO:
        return this.processCrypto();
      default:
        throw new Error("Unsupported payment type");
    }
  }

  // More switch statements - code duplication
  calculateFee(): number {
    switch (this.type) {
      case PaymentType.CREDIT_CARD:
        return this.amount * 0.029; // 2.9% fee
      case PaymentType.PAYPAL:
        return this.amount * 0.034; // 3.4% fee
      case PaymentType.BANK_TRANSFER:
        return this.amount * 0.01; // 1% fee
      case PaymentType.CRYPTO:
        return this.amount * 0.015; // 1.5% fee
      default:
        throw new Error("Unsupported payment type");
    }
  }

  getProcessingTime(): string {
    switch (this.type) {
      case PaymentType.CREDIT_CARD:
        return "Instant";
      case PaymentType.PAYPAL:
        return "Instant";
      case PaymentType.BANK_TRANSFER:
        return "1-3 business days";
      case PaymentType.CRYPTO:
        return "10-60 minutes";
      default:
        throw new Error("Unsupported payment type");
    }
  }

  private processCreditCard(): string {
    if (!this.cardNumber) throw new Error("Card number required");
    return `Processing $${
      this.amount
    } credit card payment with card ****${this.cardNumber.slice(-4)}`;
  }

  private processPayPal(): string {
    if (!this.email) throw new Error("Email required");
    return `Processing $${this.amount} PayPal payment to ${this.email}`;
  }

  private processBankTransfer(): string {
    if (!this.accountNumber) throw new Error("Account number required");
    return `Processing $${
      this.amount
    } bank transfer to account ****${this.accountNumber.slice(-4)}`;
  }

  private processCrypto(): string {
    if (!this.walletAddress) throw new Error("Wallet address required");
    return `Processing $${
      this.amount
    } crypto payment to ${this.walletAddress.slice(0, 10)}...`;
  }
}

// Usage - Client code needs to know about payment types
const creditCardPayment = new PaymentProcessor(
  PaymentType.CREDIT_CARD,
  100,
  "1234567890123456"
);

const paypalPayment = new PaymentProcessor(
  PaymentType.PAYPAL,
  150,
  undefined,
  "user@example.com"
);

const bankPayment = new PaymentProcessor(
  PaymentType.BANK_TRANSFER,
  200,
  undefined,
  undefined,
  "9876543210"
);

console.log(creditCardPayment.processPayment());
console.log(`Fee: $${creditCardPayment.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${creditCardPayment.getProcessingTime()}`);

console.log(paypalPayment.processPayment());
console.log(`Fee: $${paypalPayment.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${paypalPayment.getProcessingTime()}`);

console.log(bankPayment.processPayment());
console.log(`Fee: $${bankPayment.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${bankPayment.getProcessingTime()}`);

// The Solution
// Replace conditional with polymorphism. Create separate classes for each payment type.
abstract class PaymentMethod {
  protected amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  abstract processPayment(): string;
  abstract calculateFee(): number;
  abstract getProcessingTime(): string;
}

class CreditCardPayment extends PaymentMethod {
  private cardNumber: string;

  constructor(amount: number, cardNumber: string) {
    super(amount);
    this.cardNumber = cardNumber;
  }

  processPayment(): string {
    return `Processing $${this.amount} credit card payment with card ****${this.cardNumber.slice(-4)}`;
  }

  calculateFee(): number {
    return this.amount * 0.029;
  }

  getProcessingTime(): string {
    return "Instant";
  }
}

class PayPalPayment extends PaymentMethod {
  private email: string;

  constructor(amount: number, email: string) {
    super(amount);
    this.email = email;
  }

  processPayment(): string {
    return `Processing $${this.amount} PayPal payment to ${this.email}`;
  }

  calculateFee(): number {
    return this.amount * 0.034;
  }

  getProcessingTime(): string {
    return "Instant";
  }
}

class BankTransferPayment extends PaymentMethod {
  private accountNumber: string;

  constructor(amount: number, accountNumber: string) {
    super(amount);
    this.accountNumber = accountNumber;
  }

  processPayment(): string {
    return `Processing $${this.amount} bank transfer to account ****${this.accountNumber.slice(-4)}`;
  }

  calculateFee(): number {
    return this.amount * 0.01;
  }

  getProcessingTime(): string {
    return "1-3 business days";
  }
}

class CryptoPayment extends PaymentMethod {
  private walletAddress: string;

  constructor(amount: number, walletAddress: string) {
    super(amount);
    this.walletAddress = walletAddress;
  }

  processPayment(): string {
    return `Processing $${this.amount} crypto payment to ${this.walletAddress.slice(0, 10)}...`;
  }

  calculateFee(): number {
    return this.amount * 0.015;
  }

  getProcessingTime(): string {
    return "10-60 minutes";
  }
}

// Example
const refactoredCreditCard = new CreditCardPayment(100, "1234567890123456");
const refactoredPayPal = new PayPalPayment(150, "user@example.com");
const refactoredBankTransfer = new BankTransferPayment(200, "9876543210");
const refactoredCrypto = new CryptoPayment(75, "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");

console.log("\nRefactored solution:");
console.log(refactoredCreditCard.processPayment());
console.log(`Fee: $${refactoredCreditCard.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${refactoredCreditCard.getProcessingTime()}`);

console.log(refactoredPayPal.processPayment());
console.log(`Fee: $${refactoredPayPal.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${refactoredPayPal.getProcessingTime()}`);

console.log(refactoredBankTransfer.processPayment());
console.log(`Fee: $${refactoredBankTransfer.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${refactoredBankTransfer.getProcessingTime()}`);

console.log(refactoredCrypto.processPayment());
console.log(`Fee: $${refactoredCrypto.calculateFee().toFixed(2)}`);
console.log(`Processing time: ${refactoredCrypto.getProcessingTime()}`);