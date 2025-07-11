// The Problem
// Your methods contain a repeating group of parameters.

class Order {
  amountInvoicedIn(amount: number, currency: string): void {
    console.log(`Invoiced amount: ${amount} ${currency}`);
  }

  amountReceivedIn(amount: number, currency: string): void {
    console.log(`Received amount: ${amount} ${currency}`);
  }

  amountOverdueIn(amount: number, currency: string): void {
    console.log(`Overdue amount: ${amount} ${currency}`);
  }
}

// The Solution
// Replace these parameters with an object.

interface AmountDetails {
  amount: number;
  currency: string;
}

class RefactoredOrder {
  amountInvoicedIn(details: AmountDetails): void {
    console.log(`Invoiced amount: ${details.amount} ${details.currency}`);
  }

  amountReceivedIn(details: AmountDetails): void {
    console.log(`Received amount: ${details.amount} ${details.currency}`);
  }

  amountOverdueIn(details: AmountDetails): void {
    console.log(`Overdue amount: ${details.amount} ${details.currency}`);
  }
}

// Usage example
const order = new RefactoredOrder();
const amountDetails: AmountDetails = { amount: 1000, currency: "USD" };

order.amountInvoicedIn(amountDetails);
order.amountReceivedIn(amountDetails);
order.amountOverdueIn(amountDetails);
