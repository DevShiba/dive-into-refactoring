// Alternative Classes with Different Interfaces - Rename Method Example
// Problem: Two classes perform similar functions but have different method names,
// making it difficult to use them interchangeably.

// === BEFORE: Alternative Classes with Different Interfaces ===

class EmailNotifier {
  private recipientEmail: string;

  constructor(email: string) {
    this.recipientEmail = email;
  }

  // Different method name: "transmit"
  transmit(message: string): void {
    console.log(`Sending email to ${this.recipientEmail}: ${message}`);
    // Email sending logic here
  }

  // Different method name: "validate"
  validate(): boolean {
    return this.recipientEmail.includes("@");
  }
}

class SMSNotifier {
  private phoneNumber: string;

  constructor(phone: string) {
    this.phoneNumber = phone;
  }

  // Different method name: "dispatch"
  dispatch(message: string): void {
    console.log(`Sending SMS to ${this.phoneNumber}: ${message}`);
    // SMS sending logic here
  }

  // Different method name: "check"
  check(): boolean {
    return this.phoneNumber.length >= 10;
  }
}

class PushNotifier {
  private deviceId: string;

  constructor(device: string) {
    this.deviceId = device;
  }

  // Different method name: "deliver"
  deliver(message: string): void {
    console.log(`Sending push notification to ${this.deviceId}: ${message}`);
    // Push notification logic here
  }

  // Different method name: "isValid"
  isValid(): boolean {
    return this.deviceId.length > 0;
  }
}

// Problem: Cannot use these classes polymorphically due to different interfaces
class NotificationService {
  sendNotifications(message: string): void {
    const emailNotifier = new EmailNotifier("user@example.com");
    const smsNotifier = new SMSNotifier("1234567890");
    const pushNotifier = new PushNotifier("device123");

    // Must call different methods for each notifier
    if (emailNotifier.validate()) {
      emailNotifier.transmit(message);
    }

    if (smsNotifier.check()) {
      smsNotifier.dispatch(message);
    }

    if (pushNotifier.isValid()) {
      pushNotifier.deliver(message);
    }
  }
}

// === AFTER: Unified Interface using Rename Method ===

interface Notifier {
  send(message: string): void;
  isValid(): boolean;
}

class EmailNotifierRefactored implements Notifier {
  private recipientEmail: string;

  constructor(email: string) {
    this.recipientEmail = email;
  }

  // Renamed from "transmit" to "send"
  send(message: string): void {
    console.log(`Sending email to ${this.recipientEmail}: ${message}`);
    // Email sending logic here
  }

  // Renamed from "validate" to "isValid"
  isValid(): boolean {
    return this.recipientEmail.includes("@");
  }
}

class SMSNotifierRefactored implements Notifier {
  private phoneNumber: string;

  constructor(phone: string) {
    this.phoneNumber = phone;
  }

  // Renamed from "dispatch" to "send"
  send(message: string): void {
    console.log(`Sending SMS to ${this.phoneNumber}: ${message}`);
    // SMS sending logic here
  }

  // Renamed from "check" to "isValid"
  isValid(): boolean {
    return this.phoneNumber.length >= 10;
  }
}

class PushNotifierRefactored implements Notifier {
  private deviceId: string;

  constructor(device: string) {
    this.deviceId = device;
  }

  // Renamed from "deliver" to "send"
  send(message: string): void {
    console.log(`Sending push notification to ${this.deviceId}: ${message}`);
    // Push notification logic here
  }

  // Method already named "isValid" - no rename needed
  isValid(): boolean {
    return this.deviceId.length > 0;
  }
}

// Now we can use polymorphism effectively
class NotificationServiceRefactored {
  private notifiers: Notifier[];

  constructor(notifiers: Notifier[]) {
    this.notifiers = notifiers;
  }

  sendNotifications(message: string): void {
    this.notifiers.forEach((notifier) => {
      if (notifier.isValid()) {
        notifier.send(message);
      }
    });
  }

  addNotifier(notifier: Notifier): void {
    this.notifiers.push(notifier);
  }
}

// === USAGE EXAMPLE ===

console.log("=== Before Refactoring ===");
const service = new NotificationService();
service.sendNotifications("Hello World!");

console.log("\n=== After Refactoring ===");
const notifiers: Notifier[] = [
  new EmailNotifierRefactored("user@example.com"),
  new SMSNotifierRefactored("1234567890"),
  new PushNotifierRefactored("device123"),
];

const refactoredService = new NotificationServiceRefactored(notifiers);
refactoredService.sendNotifications("Hello World!");

// Easy to add new notifiers
refactoredService.addNotifier(new EmailNotifierRefactored("admin@example.com"));
refactoredService.sendNotifications("Admin Alert!");

// Benefits of Rename Method:
// 1. Enables polymorphism and consistent interface usage
// 2. Improves code readability and maintainability
// 3. Reduces duplication in client code
// 4. Makes classes interchangeable
// 5. Simplifies testing by allowing mock implementations
