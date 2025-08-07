// The Problem
// You get several values from an object and then pass them as parameters to a method.

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
}

class OrderProcessor {
  processOrder(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    customerAddress: string
  ) {
    this.validateCustomerInfo(customerName, customerEmail, customerPhone);
    this.sendConfirmationEmail(customerEmail, customerName);
    this.scheduleDelivery(customerAddress, customerPhone, customerName);
  }

  validateCustomerInfo(name: string, email: string, phone: string) {
    if (!name || !email || !phone) {
      throw new Error("Invalid customer information");
    }
  }

  sendConfirmationEmail(email: string, name: string) {
    console.log(`Sending confirmation to ${email} for ${name}`);
  }

  scheduleDelivery(address: string, phone: string, name: string) {
    console.log(
      `Scheduling delivery to ${address} for ${name}, contact: ${phone}`
    );
  }

  checkCreditLimit(
    customerName: string,
    customerEmail: string,
    creditLimit: number,
    orderAmount: number
  ) {
    console.log(
      `Checking credit limit for ${customerName} (${customerEmail}): ${creditLimit} vs ${orderAmount}`
    );
    return creditLimit >= orderAmount;
  }
}

// Usage
const customer: Customer = {
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0123",
  address: "123 Main St",
  creditLimit: 5000,
};

const processor = new OrderProcessor();
processor.processOrder(
  customer.name,
  customer.email,
  customer.phone,
  customer.address
);
processor.checkCreditLimit(
  customer.name,
  customer.email,
  customer.creditLimit,
  2500
);

// The Solution
// Instead, try passing the whole object.
class OrderProcessorRefactored {
  processOrder(customer: Customer) {
    this.validateCustomerInfo(customer);
    this.sendConfirmationEmail(customer);
    this.scheduleDelivery(customer);
  }

  validateCustomerInfo(customer: Customer) {
    if (!customer.name || !customer.email || !customer.phone) {
      throw new Error("Invalid customer information");
    }
  }

  sendConfirmationEmail(customer: Customer) {
    console.log(
      `Sending confirmation to ${customer.email} for ${customer.name}`
    );
  }

  scheduleDelivery(customer: Customer) {
    console.log(
      `Scheduling delivery to ${customer.address} for ${customer.name}, contact: ${customer.phone}`
    );
  }

  checkCreditLimit(customer: Customer, orderAmount: number) {
    console.log(
      `Checking credit limit for ${customer.name} (${customer.email}): ${customer.creditLimit} vs ${orderAmount}`
    );
    return customer.creditLimit >= orderAmount;
  }
}
