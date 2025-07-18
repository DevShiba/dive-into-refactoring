// The Problem
// Multiple methods perform similar actions that are different only in their internal values, numbers or operations.

// === BEFORE: Classes with similar methods but different signatures ===

class EmailService {
  sendWelcomeEmail(recipient: string): void {
    console.log(`Sending welcome email to ${recipient}`);
    console.log("Subject: Welcome to our platform!");
    console.log("Template: welcome-template");
  }

  sendPasswordResetEmail(recipient: string): void {
    console.log(`Sending password reset email to ${recipient}`);
    console.log("Subject: Reset your password");
    console.log("Template: password-reset-template");
  }

  sendInvoiceEmail(recipient: string): void {
    console.log(`Sending invoice email to ${recipient}`);
    console.log("Subject: Your invoice is ready");
    console.log("Template: invoice-template");
  }
}

class NotificationService {
  sendUrgentNotification(message: string, userId: string): void {
    console.log(`[URGENT] Notification to user ${userId}: ${message}`);
    console.log("Priority: HIGH");
    console.log("Channel: push + email");
  }

  sendNormalNotification(message: string, userId: string): void {
    console.log(`[NORMAL] Notification to user ${userId}: ${message}`);
    console.log("Priority: MEDIUM");
    console.log("Channel: push");
  }

  sendLowPriorityNotification(message: string, userId: string): void {
    console.log(`[LOW] Notification to user ${userId}: ${message}`);
    console.log("Priority: LOW");
    console.log("Channel: email");
  }
}

class DiscountCalculator {
  calculateStudentDiscount(amount: number): number {
    const discount = 0.15; // 15% student discount
    return amount * (1 - discount);
  }

  calculateSeniorDiscount(amount: number): number {
    const discount = 0.20; // 20% senior discount
    return amount * (1 - discount);
  }

  calculateEmployeeDiscount(amount: number): number {
    const discount = 0.25; // 25% employee discount
    return amount * (1 - discount);
  }
}

// The Solution
// Combine these methods by using a parameter that will pass the necessary special value.

// === AFTER: Parameterized methods ===

type EmailType = "welcome" | "password-reset" | "invoice";
type NotificationPriority = "urgent" | "normal" | "low";
type CustomerType = "student" | "senior" | "employee";

class UnifiedEmailService {
  sendEmail(recipient: string, type: EmailType): void {
    console.log(`Sending ${type} email to ${recipient}`);
    
    const emailConfig = this.getEmailConfig(type);
    console.log(`Subject: ${emailConfig.subject}`);
    console.log(`Template: ${emailConfig.template}`);
  }

  private getEmailConfig(type: EmailType): { subject: string; template: string } {
    switch (type) {
      case "welcome":
        return { subject: "Welcome to our platform!", template: "welcome-template" };
      case "password-reset":
        return { subject: "Reset your password", template: "password-reset-template" };
      case "invoice":
        return { subject: "Your invoice is ready", template: "invoice-template" };
    }
  }
}

class UnifiedNotificationService {
  sendNotification(message: string, userId: string, priority: NotificationPriority): void {
    const config = this.getNotificationConfig(priority);
    console.log(`[${config.label}] Notification to user ${userId}: ${message}`);
    console.log(`Priority: ${config.priorityLevel}`);
    console.log(`Channel: ${config.channel}`);
  }

  private getNotificationConfig(priority: NotificationPriority): { 
    label: string; 
    priorityLevel: string; 
    channel: string; 
  } {
    switch (priority) {
      case "urgent":
        return { label: "URGENT", priorityLevel: "HIGH", channel: "push + email" };
      case "normal":
        return { label: "NORMAL", priorityLevel: "MEDIUM", channel: "push" };
      case "low":
        return { label: "LOW", priorityLevel: "LOW", channel: "email" };
    }
  }
}

class UnifiedDiscountCalculator {
  calculateDiscount(amount: number, customerType: CustomerType): number {
    const discount = this.getDiscountRate(customerType);
    return amount * (1 - discount);
  }

  private getDiscountRate(customerType: CustomerType): number {
    switch (customerType) {
      case "student":
        return 0.15; // 15% discount
      case "senior":
        return 0.20; // 20% discount
      case "employee":
        return 0.25; // 25% discount
    }
  }
}

// === USAGE EXAMPLE ===

console.log("=== Before Parameterize Method ===");

const emailService = new EmailService();
emailService.sendWelcomeEmail("user@example.com");
emailService.sendPasswordResetEmail("user@example.com");
emailService.sendInvoiceEmail("user@example.com");

const notificationService = new NotificationService();
notificationService.sendUrgentNotification("System maintenance", "user123");
notificationService.sendNormalNotification("New message", "user123");
notificationService.sendLowPriorityNotification("Newsletter", "user123");

const discountCalculator = new DiscountCalculator();
console.log("Student discount:", discountCalculator.calculateStudentDiscount(100));
console.log("Senior discount:", discountCalculator.calculateSeniorDiscount(100));
console.log("Employee discount:", discountCalculator.calculateEmployeeDiscount(100));

console.log("\n=== After Parameterize Method ===");

const unifiedEmailService = new UnifiedEmailService();
unifiedEmailService.sendEmail("user@example.com", "welcome");
unifiedEmailService.sendEmail("user@example.com", "password-reset");
unifiedEmailService.sendEmail("user@example.com", "invoice");

const unifiedNotificationService = new UnifiedNotificationService();
unifiedNotificationService.sendNotification("System maintenance", "user123", "urgent");
unifiedNotificationService.sendNotification("New message", "user123", "normal");
unifiedNotificationService.sendNotification("Newsletter", "user123", "low");

const unifiedDiscountCalculator = new UnifiedDiscountCalculator();
console.log("Student discount:", unifiedDiscountCalculator.calculateDiscount(100, "student"));
console.log("Senior discount:", unifiedDiscountCalculator.calculateDiscount(100, "senior"));
console.log("Employee discount:", unifiedDiscountCalculator.calculateDiscount(100, "employee"));

// Now classes can be used polymorphically
const emailServices = [new UnifiedEmailService()];
const notificationServices = [new UnifiedNotificationService()];
const discountCalculators = [new UnifiedDiscountCalculator()];

emailServices.forEach(service => {
  service.sendEmail("test@example.com", "welcome");
});

notificationServices.forEach(service => {
  service.sendNotification("Test message", "user456", "normal");
});

discountCalculators.forEach(calculator => {
  console.log("Test discount:", calculator.calculateDiscount(50, "student"));
});