// The Problem
// Shotgun Surgery: Making any modifications requires many small changes to many different classes.
// Logic is scattered across multiple classes instead of being centralized.

// === BEFORE: Shotgun Surgery - Email validation logic scattered everywhere ===

class UserRegistration {
  private users: Array<{ email: string; name: string }> = [];

  registerUser(name: string, email: string): boolean {
    // Email validation logic scattered here
    if (!email.includes('@')) {
      console.log("Registration failed: Invalid email format");
      return false;
    }
    
    if (email.split('@')[1]?.length < 3) {
      console.log("Registration failed: Invalid domain");
      return false;
    }

    if (email.length < 5) {
      console.log("Registration failed: Email too short");
      return false;
    }

    this.users.push({ email, name });
    console.log(`User ${name} registered with email ${email}`);
    return true;
  }

  updateUserEmail(oldEmail: string, newEmail: string): boolean {
    // Same email validation logic duplicated here
    if (!newEmail.includes('@')) {
      console.log("Update failed: Invalid email format");
      return false;
    }
    
    if (newEmail.split('@')[1]?.length < 3) {
      console.log("Update failed: Invalid domain");
      return false;
    }

    if (newEmail.length < 5) {
      console.log("Update failed: Email too short");
      return false;
    }

    const user = this.users.find(u => u.email === oldEmail);
    if (user) {
      user.email = newEmail;
      console.log(`Email updated from ${oldEmail} to ${newEmail}`);
      return true;
    }
    return false;
  }
}

class NewsletterSubscription {
  private subscribers: string[] = [];

  subscribe(email: string): boolean {
    // Email validation logic duplicated again
    if (!email.includes('@')) {
      console.log("Subscription failed: Invalid email format");
      return false;
    }
    
    if (email.split('@')[1]?.length < 3) {
      console.log("Subscription failed: Invalid domain");
      return false;
    }

    if (email.length < 5) {
      console.log("Subscription failed: Email too short");
      return false;
    }

    this.subscribers.push(email);
    console.log(`Subscribed ${email} to newsletter`);
    return true;
  }

  unsubscribe(email: string): boolean {
    // Even unsubscribe validates email format
    if (!email.includes('@')) {
      console.log("Unsubscribe failed: Invalid email format");
      return false;
    }

    const index = this.subscribers.indexOf(email);
    if (index > -1) {
      this.subscribers.splice(index, 1);
      console.log(`Unsubscribed ${email} from newsletter`);
      return true;
    }
    return false;
  }
}

class ContactForm {
  submitContact(name: string, email: string, message: string): boolean {
    // Email validation logic scattered here too
    if (!email.includes('@')) {
      console.log("Contact form failed: Invalid email format");
      return false;
    }
    
    if (email.split('@')[1]?.length < 3) {
      console.log("Contact form failed: Invalid domain");
      return false;
    }

    if (email.length < 5) {
      console.log("Contact form failed: Email too short");
      return false;
    }

    console.log(`Contact form submitted by ${name} (${email}): ${message}`);
    return true;
  }
}

class EmailMarketing {
  sendCampaign(emails: string[], subject: string, content: string): void {
    const validEmails: string[] = [];

    emails.forEach(email => {
      // Email validation logic duplicated once more
      if (!email.includes('@')) {
        console.log(`Skipping invalid email: ${email}`);
        return;
      }
      
      if (email.split('@')[1]?.length < 3) {
        console.log(`Skipping invalid domain: ${email}`);
        return;
      }

      if (email.length < 5) {
        console.log(`Skipping email too short: ${email}`);
        return;
      }

      validEmails.push(email);
    });

    console.log(`Sending campaign "${subject}" to ${validEmails.length} valid emails`);
    validEmails.forEach(email => {
      console.log(`Sent to: ${email}`);
    });
  }
}

// The Solution
// Move Method: Move the scattered email validation logic to a centralized location.

// === AFTER: Move Method - Email validation centralized ===

class EmailValidator {
  static validate(email: string): { isValid: boolean; error?: string } {
    if (!email.includes('@')) {
      return { isValid: false, error: "Invalid email format" };
    }
    
    if (email.split('@')[1]?.length < 3) {
      return { isValid: false, error: "Invalid domain" };
    }

    if (email.length < 5) {
      return { isValid: false, error: "Email too short" };
    }

    return { isValid: true };
  }

  static isValid(email: string): boolean {
    return this.validate(email).isValid;
  }

  static getErrorMessage(email: string): string | null {
    const result = this.validate(email);
    return result.isValid ? null : result.error || "Invalid email";
  }
}

class ImprovedUserRegistration {
  private users: Array<{ email: string; name: string }> = [];

  registerUser(name: string, email: string): boolean {
    const validation = EmailValidator.validate(email);
    if (!validation.isValid) {
      console.log(`Registration failed: ${validation.error}`);
      return false;
    }

    this.users.push({ email, name });
    console.log(`User ${name} registered with email ${email}`);
    return true;
  }

  updateUserEmail(oldEmail: string, newEmail: string): boolean {
    const validation = EmailValidator.validate(newEmail);
    if (!validation.isValid) {
      console.log(`Update failed: ${validation.error}`);
      return false;
    }

    const user = this.users.find(u => u.email === oldEmail);
    if (user) {
      user.email = newEmail;
      console.log(`Email updated from ${oldEmail} to ${newEmail}`);
      return true;
    }
    return false;
  }
}

class ImprovedNewsletterSubscription {
  private subscribers: string[] = [];

  subscribe(email: string): boolean {
    const validation = EmailValidator.validate(email);
    if (!validation.isValid) {
      console.log(`Subscription failed: ${validation.error}`);
      return false;
    }

    this.subscribers.push(email);
    console.log(`Subscribed ${email} to newsletter`);
    return true;
  }

  unsubscribe(email: string): boolean {
    if (!EmailValidator.isValid(email)) {
      console.log(`Unsubscribe failed: ${EmailValidator.getErrorMessage(email)}`);
      return false;
    }

    const index = this.subscribers.indexOf(email);
    if (index > -1) {
      this.subscribers.splice(index, 1);
      console.log(`Unsubscribed ${email} from newsletter`);
      return true;
    }
    return false;
  }
}

class ImprovedContactForm {
  submitContact(name: string, email: string, message: string): boolean {
    const validation = EmailValidator.validate(email);
    if (!validation.isValid) {
      console.log(`Contact form failed: ${validation.error}`);
      return false;
    }

    console.log(`Contact form submitted by ${name} (${email}): ${message}`);
    return true;
  }
}

class ImprovedEmailMarketing {
  sendCampaign(emails: string[], subject: string, content: string): void {
    const validEmails = emails.filter(email => {
      const isValid = EmailValidator.isValid(email);
      if (!isValid) {
        console.log(`Skipping invalid email: ${email} - ${EmailValidator.getErrorMessage(email)}`);
      }
      return isValid;
    });

    console.log(`Sending campaign "${subject}" to ${validEmails.length} valid emails`);
    validEmails.forEach(email => {
      console.log(`Sent to: ${email}`);
    });
  }
}

// === USAGE EXAMPLE ===

console.log("=== Before Move Method ===");
console.log("Problem: Email validation logic scattered across multiple classes");

const userReg = new UserRegistration();
const newsletter = new NewsletterSubscription();
const contactForm = new ContactForm();
const marketing = new EmailMarketing();

userReg.registerUser("John Doe", "invalid-email");
newsletter.subscribe("test@domain.com");
contactForm.submitContact("Jane", "short", "Hello");
marketing.sendCampaign(["valid@email.com", "invalid"], "Test", "Content");

console.log("\n=== After Move Method ===");
console.log("Solution: Email validation centralized in EmailValidator class");

const improvedUserReg = new ImprovedUserRegistration();
const improvedNewsletter = new ImprovedNewsletterSubscription();
const improvedContactForm = new ImprovedContactForm();
const improvedMarketing = new ImprovedEmailMarketing();

improvedUserReg.registerUser("John Doe", "invalid-email");
improvedNewsletter.subscribe("test@domain.com");
improvedContactForm.submitContact("Jane", "short", "Hello");
improvedMarketing.sendCampaign(["valid@email.com", "invalid"], "Test", "Content");

