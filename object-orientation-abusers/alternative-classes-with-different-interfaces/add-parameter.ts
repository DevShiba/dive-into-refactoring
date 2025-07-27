// The Problem
// Alternative classes perform similar functions but have different method signatures and parameters.

// === BEFORE: Classes with different interfaces ===

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

class PushNotifier {
    notify(deviceId: string, title: string, content: string, priority: number): void {
        console.log(`Sending push notification to device ${deviceId}`);
        console.log(`Title: ${title}`);
        console.log(`Content: ${content}`);
        console.log(`Priority: ${priority}`);
    }
}

// The Solution
// Add parameters to unify method signatures and make classes interchangeable.

// === AFTER: Unified interfaces with parameters ===

interface NotificationData {
    recipient: string;
    message: string;
    subject?: string;
    priority?: number;
}

class UnifiedEmailNotifier {
    send(data: NotificationData): void {
        console.log(`Sending email to ${data.recipient}`);
        console.log(`Subject: ${data.subject || 'No Subject'}`);
        console.log(`Body: ${data.message}`);
    }
}

class UnifiedSMSNotifier {
    send(data: NotificationData): void {
        console.log(`Sending SMS to ${data.recipient}`);
        console.log(`Message: ${data.message}`);
    }
}

class UnifiedSlackNotifier {
    send(data: NotificationData): void {
        console.log(`Posting to Slack channel ${data.recipient}`);
        console.log(`Text: ${data.message}`);
    }
}

class UnifiedPushNotifier {
    send(data: NotificationData): void {
        console.log(`Sending push notification to device ${data.recipient}`);
        console.log(`Title: ${data.subject || 'Notification'}`);
        console.log(`Content: ${data.message}`);
        console.log(`Priority: ${data.priority || 1}`);
    }
}

// === USAGE EXAMPLE ===

console.log("=== Before Add Parameter ===");

const emailNotifier = new EmailNotifier();
const smsNotifier = new SMSNotifier();
const slackNotifier = new SlackNotifier();
const pushNotifier = new PushNotifier();

emailNotifier.sendEmail("user@example.com", "Alert", "System is down");
smsNotifier.sendSMS("123-456-7890", "System is down");
slackNotifier.postMessage("#alerts", "System is down");
pushNotifier.notify("device123", "Alert", "System is down", 2);

console.log("\n=== After Add Parameter ===");

const unifiedEmailNotifier = new UnifiedEmailNotifier();
const unifiedSMSNotifier = new UnifiedSMSNotifier();
const unifiedSlackNotifier = new UnifiedSlackNotifier();
const unifiedPushNotifier = new UnifiedPushNotifier();

const notificationData: NotificationData = {
    recipient: "user@example.com",
    message: "System is down",
    subject: "Alert",
    priority: 2
};

unifiedEmailNotifier.send(notificationData);
unifiedSMSNotifier.send({ recipient: "123-456-7890", message: "System is down" });
unifiedSlackNotifier.send({ recipient: "#alerts", message: "System is down" });
unifiedPushNotifier.send(notificationData);

// Now classes can be used polymorphically
interface Notifier {
    send(data: NotificationData): void;
}

const notifiers: Notifier[] = [
    new UnifiedEmailNotifier(),
    new UnifiedSMSNotifier(),
    new UnifiedSlackNotifier(),
    new UnifiedPushNotifier()
];

const urgentAlert: NotificationData = {
    recipient: "admin@example.com",
    message: "Critical system failure",
    subject: "URGENT",
    priority: 3
};

notifiers.forEach(notifier => {
    notifier.send(urgentAlert);
});