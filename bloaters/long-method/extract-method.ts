// The Problem
// You have a code fragment that can be grouped together.

class Invoice {
  name: string = "";

  PrintBanner(): void {
    console.log("**************************");
    console.log("***** Customer Owes ******");
    console.log("**************************");
  }

  GetOutstanding(): number {
    // Calculate outstanding amount
    return 1500.0;
  }

  PrintOwing(): void {
    this.PrintBanner();

    // Print details.
    console.log("name: " + this.name);
    console.log("amount: " + this.GetOutstanding());
  }
}

// The Solution
// Move this code to a separate new method (or function) and replace the old code with a call to the method.

class InvoiceRefactored {
  name: string = "";

  PrintBanner(): void {
    console.log("**************************");
    console.log("***** Customer Owes ******");
    console.log("**************************");
  }

  GetOutstanding(): number {
    // Calculate outstanding amount
    return 1500.0;
  }

  PrintDetails(): void {
    // Print details.
    console.log("name: " + this.name);
    console.log("amount: " + this.GetOutstanding());
  }

  PrintOwing(): void {
    this.PrintBanner();
    this.PrintDetails();
  }
}

// Usage example
const invoice = new Invoice();
invoice.name = "John Doe";
console.log("=== Original Invoice ===");
invoice.PrintOwing();

const refactoredInvoice = new InvoiceRefactored();
refactoredInvoice.name = "Jane Smith";
console.log("\n=== Refactored Invoice ===");
refactoredInvoice.PrintOwing();
refactoredInvoice.PrintDetails();
