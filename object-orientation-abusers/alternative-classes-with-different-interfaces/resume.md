# Alternative Classes with Different Interfaces

This smell occurs when two or more classes perform similar things but possess different interfaces. The core issue is having classes that should be interchangeable but cannot be due to non-uniform signatures or structure.

The existence of similar functionality across multiple classes that operate with distinct interfaces means that the code fails to support substitution . Supporting substitution is one of the great benefits derived from using classes. In object-oriented languages, interfaces provide a mechanism to define a contract outlining the expected properties and function an object must implement to be used by the surrounding code.

## Why it's a Problem

The primary consequence of having Alternative Classes with different interfaces is the loss of substitution and flexibility.

- **Impaired Substitution**: Classes can only be swapped in for one another if their interfaces are identical. When interfaces differ, the benefit of substitution - allowing one class to swap in for another in times of need - is lost.

- **Damaged Polymorphism**: This lack of uniformity prevents the straightforward use of polymorphism, which is a prominent feature of classical object-orientation often used to handle conditional logic or variations in behavior

- **Increased Complexity and Maintenance Risk**: If the domain contains classes that should be conceptually related but have differing protocols, this introduces unnecessary complexity. If code is modified to accommodate similar classes with different interfaces, it makes the design harder to understand and work with.

## Refactoring Techniques

### Add Parameter

```typescript
class EmailNotifier {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}

class SMSNotifier {
  sendSMS(phoneNumber: string, message: string): void {
    console.log(`Sending SMS to ${phoneNumber}`);
    console.log(`Message: ${message}`);
  }
}

class SlackNotifier {
  postMessage(channel: string, text: string): void {
    console.log(`Posting to Slack channel ${channel}`);
    console.log(`Text: ${text}`);
  }
}
```

```typescript
interface NotificationData {
  recipient: string;
  message: string;
  subject?: string;
  priority?: number;
}

class EmailNotifier {
  send(data: NotificationData): void {
    console.log(`Sending email to ${data.recipient}`);
    console.log(`Subject: ${data.subject || "No Subject"}`);
    console.log(`Body: ${data.message}`);
  }
}

class SMSNotifier {
  send(data: NotificationData): void {
    console.log(`Sending SMS to ${data.recipient}`);
    console.log(`Message: ${data.message}`);
  }
}

class SlackNotifier {
  send(data: NotificationData): void {
    console.log(`Posting to Slack channel ${data.recipient}`);
    console.log(`Text: ${data.message}`);
  }
}
```

### Parametrize Method

```typescript
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
```

```typescript
type EmailType = "welcome" | "password-reset" | "invoice";
type NotificationPriority = "urgent" | "normal" | "low";

class EmailService {
  sendEmail(recipient: string, type: EmailType): void {
    console.log(`Sending ${type} email to ${recipient}`);

    const emailConfig = this.getEmailConfig(type);
    console.log(`Subject: ${emailConfig.subject}`);
    console.log(`Template: ${emailConfig.template}`);
  }

  private getEmailConfig(type: EmailType): {
    subject: string;
    template: string;
  } {
    case "welcome":
      return {
          subject: "Welcome to our platform!",
          template: "welcome-template",
      };
    case "password-reset":
      return {
        subject: "Reset your password",
        template: "password-reset-template",
      };
    case "invoice":
      return {
        subject: "Your invoice is ready",
        template: "invoice-template",
      };
  }
}

class UnifiedNotificationService {
  sendNotification(
    message: string,
    userId: string,
    priority: NotificationPriority
  ): void {
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
        return {
          label: "URGENT",
          priorityLevel: "HIGH",
          channel: "push + email",
        };
      case "normal":
        return { label: "NORMAL", priorityLevel: "MEDIUM", channel: "push" };
      case "low":
        return { label: "LOW", priorityLevel: "LOW", channel: "email" };
    }
  }
}

```

### Rename Method

```typescript
class EmailNotifier {
  private recipientEmail: string;

  constructor(email: string) {
    this.recipientEmail = email;
  }

  transmit(message: string): void {
    console.log(`Sending email to ${this.recipientEmail}: ${message}`);
  }

  validate(): boolean {
    return this.recipientEmail.includes("@");
  }
}

class SMSNotifier {
  private phoneNumber: string;

  constructor(phone: string) {
    this.phoneNumber = phone;
  }

  dispatch(message: string): void {
    console.log(`Sending SMS to ${this.phoneNumber}: ${message}`);
  }

  check(): boolean {
    return this.phoneNumber.length >= 10;
  }
}

class NotificationService {
  sendNotification(message: string): void {
    const emailNotifier = new EmailNotifier("user@example.com");
    const smsNotifier = new SMSNotifier("1234567890");

    if (emailNotifier.validate()) {
      emailNotifier.transmit(message);
    }

    if (smsNotifier.check()) {
      smsNotifier.dispatch(message);
    }
  }
}
```

```typescript
interface Notifier {
  send(message: string): void;
  isValid(): boolean;
}

class EmailNotifier implements Notifier {
  private recipientEmail: string;

  constructor(email: string) {
    this.recipientEmail = email;
  }

  send(message: string): void {
    console.log(`Sending email to ${this.recipientEmail}: ${message}`);
  }

  isValid(): boolean {
    return this.recipientEmail.includes("@");
  }
}

class SMSNotifier implements Notifier {
  private phoneNumber: string;

  constructor(phone: string) {
    this.phoneNumber = phone;
  }

  send(message: string): void {
    console.log(`Sending SMS to ${this.phoneNumber}: ${message}`);
  }

  isValid(): boolean {
    return this.phoneNumber.length >= 10;
  }
}

class NotificationService {
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
```

## When Not to Refactor

- **When Rewriting is More Efficient**: If the cost or difficulty of refactoring the existing messy code outweighs the benefits, it might be more practical to rewrite the relevant code entirely.

- **When Functionality is Truly Separate**: If two sets of functionality have no "indispensable relationship" and do not call upon each other or share data during operations, they might be consciously separated using the **Separate Ways** pattern, allowing specialized solutions without integration overhead. This means foregoing the benefits of substitution for that specific context.

- **When External Interface Translation is Required**: If the differing interfaces are between your internal system and an external or legacy system, you might create a translation layer (or **Anticorruption Layer**) to shield your core domain model from the external system's design, rather than trying to harmonize the external system itself.
