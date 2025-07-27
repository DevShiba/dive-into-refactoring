// The Problem
// Data Clumps: Identical groups of variables appear together in multiple places.
// The same parameters are passed around repeatedly across different methods.

// === BEFORE: Data Clumps - Same parameters repeated everywhere ===

class UserService {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): void {
    console.log(`Creating user: ${firstName} ${lastName}`);
    console.log(`Email: ${email}, Phone: ${phone}`);
    console.log(`Address: ${street}, ${city}, ${state} ${zipCode}, ${country}`);
  }

  updateUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): void {
    console.log(`Updating user ${userId}`);
    console.log(`New details: ${firstName} ${lastName}`);
    console.log(`Email: ${email}, Phone: ${phone}`);
    console.log(`Address: ${street}, ${city}, ${state} ${zipCode}, ${country}`);
  }

  validateUserData(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): boolean {
    if (!firstName || !lastName || !email) return false;
    if (!phone || !street || !city) return false;
    if (!state || !zipCode || !country) return false;
    return true;
  }
}

class NotificationService {
  sendWelcomeEmail(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): void {
    console.log(`Sending welcome email to ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(
      `Mailing address: ${street}, ${city}, ${state} ${zipCode}, ${country}`
    );
  }

  sendAddressChangeNotification(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): void {
    console.log(`Address change notification for ${firstName} ${lastName}`);
    console.log(
      `New address: ${street}, ${city}, ${state} ${zipCode}, ${country}`
    );
    console.log(`Notification sent to: ${email} and ${phone}`);
  }
}

class ReportService {
  generateUserReport(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    registrationDate: Date
  ): void {
    console.log("=== USER REPORT ===");
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Contact: ${email}, ${phone}`);
    console.log(`Address: ${street}, ${city}, ${state} ${zipCode}, ${country}`);
    console.log(`Registered: ${registrationDate.toDateString()}`);
  }

  exportUserData(
    users: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }>
  ): void {
    console.log("Exporting user data...");
    users.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.firstName} ${user.lastName}`);
      console.log(`  Contact: ${user.email}, ${user.phone}`);
      console.log(
        `  Address: ${user.street}, ${user.city}, ${user.state} ${user.zipCode}, ${user.country}`
      );
    });
  }
}

// === USAGE EXAMPLE SHOWING THE PROBLEM ===

console.log("=== Before Introduce Parameter Object ===");
console.log("Problem: Same data clumps passed everywhere");

const userService = new UserService();
const notificationService = new NotificationService();
const reportService = new ReportService();

// Same data clump repeated in every method call
const firstName = "John";
const lastName = "Doe";
const email = "john.doe@example.com";
const phone = "123-456-7890";
const street = "123 Main St";
const city = "Springfield";
const state = "IL";
const zipCode = "62701";
const country = "USA";

userService.createUser(
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  state,
  zipCode,
  country
);
userService.validateUserData(
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  state,
  zipCode,
  country
);
notificationService.sendWelcomeEmail(
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  state,
  zipCode,
  country
);
reportService.generateUserReport(
  firstName,
  lastName,
  email,
  phone,
  street,
  city,
  state,
  zipCode,
  country,
  new Date()
);

// When updating, have to pass all parameters again
userService.updateUser(
  "user123",
  firstName,
  lastName,
  email,
  phone,
  "456 Oak Ave",
  city,
  state,
  zipCode,
  country
);

// The Solution
// Introduce Parameter Object: Group related parameters into objects.

// === AFTER: Introduce Parameter Object - Data organized into cohesive objects ===

interface PersonalInfo {
  firstName: string;
  lastName: string;
}

interface ContactInfo {
  email: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserData {
  personal: PersonalInfo;
  contact: ContactInfo;
  address: Address;
}

class ImprovedUserService {
  createUser(userData: UserData): void {
    console.log(
      `Creating user: ${userData.personal.firstName} ${userData.personal.lastName}`
    );
    console.log(
      `Email: ${userData.contact.email}, Phone: ${userData.contact.phone}`
    );
    console.log(`Address: ${this.formatAddress(userData.address)}`);
  }

  updateUser(userId: string, userData: UserData): void {
    console.log(`Updating user ${userId}`);
    console.log(
      `New details: ${userData.personal.firstName} ${userData.personal.lastName}`
    );
    console.log(
      `Email: ${userData.contact.email}, Phone: ${userData.contact.phone}`
    );
    console.log(`Address: ${this.formatAddress(userData.address)}`);
  }

  validateUserData(userData: UserData): boolean {
    const { personal, contact, address } = userData;

    if (!personal.firstName || !personal.lastName) return false;
    if (!contact.email || !contact.phone) return false;
    if (!address.street || !address.city || !address.state) return false;
    if (!address.zipCode || !address.country) return false;

    return true;
  }

  private formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  }
}

class ImprovedNotificationService {
  sendWelcomeEmail(userData: UserData): void {
    console.log(
      `Sending welcome email to ${userData.personal.firstName} ${userData.personal.lastName}`
    );
    console.log(`Email: ${userData.contact.email}`);
    console.log(`Mailing address: ${this.formatAddress(userData.address)}`);
  }

  sendAddressChangeNotification(userData: UserData): void {
    console.log(
      `Address change notification for ${userData.personal.firstName} ${userData.personal.lastName}`
    );
    console.log(`New address: ${this.formatAddress(userData.address)}`);
    console.log(
      `Notification sent to: ${userData.contact.email} and ${userData.contact.phone}`
    );
  }

  private formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  }
}

class ImprovedReportService {
  generateUserReport(userData: UserData, registrationDate: Date): void {
    console.log("=== USER REPORT ===");
    console.log(
      `Name: ${userData.personal.firstName} ${userData.personal.lastName}`
    );
    console.log(
      `Contact: ${userData.contact.email}, ${userData.contact.phone}`
    );
    console.log(`Address: ${this.formatAddress(userData.address)}`);
    console.log(`Registered: ${registrationDate.toDateString()}`);
  }

  exportUserData(users: UserData[]): void {
    console.log("Exporting user data...");
    users.forEach((userData, index) => {
      console.log(
        `User ${index + 1}: ${userData.personal.firstName} ${
          userData.personal.lastName
        }`
      );
      console.log(
        `  Contact: ${userData.contact.email}, ${userData.contact.phone}`
      );
      console.log(`  Address: ${this.formatAddress(userData.address)}`);
    });
  }

  private formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  }
}

// === USAGE EXAMPLE ===

console.log("\n=== After Introduce Parameter Object ===");
console.log("Solution: Data organized into cohesive objects");

const improvedUserService = new ImprovedUserService();
const improvedNotificationService = new ImprovedNotificationService();
const improvedReportService = new ImprovedReportService();

// Create organized data objects
const userData: UserData = {
  personal: {
    firstName: "John",
    lastName: "Doe",
  },
  contact: {
    email: "john.doe@example.com",
    phone: "123-456-7890",
  },
  address: {
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    country: "USA",
  },
};

// Much cleaner method calls
improvedUserService.createUser(userData);
improvedUserService.validateUserData(userData);
improvedNotificationService.sendWelcomeEmail(userData);
improvedReportService.generateUserReport(userData, new Date());

// Easy to update specific parts
const updatedUserData: UserData = {
  ...userData,
  address: {
    ...userData.address,
    street: "456 Oak Ave",
  },
};

improvedUserService.updateUser("user123", updatedUserData);

// Easy to work with collections
const users: UserData[] = [
  userData,
  {
    personal: { firstName: "Jane", lastName: "Smith" },
    contact: { email: "jane.smith@example.com", phone: "987-654-3210" },
    address: {
      street: "789 Pine St",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
      country: "USA",
    },
  },
];

improvedReportService.exportUserData(users);
