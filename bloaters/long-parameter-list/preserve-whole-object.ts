// The Problem
// Long Parameter List: A method has too many parameters, making it hard to understand and use
class UserRegistrationService {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    dateOfBirth: Date,
    gender: string,
    occupation: string,
    company: string,
    emergencyContactName: string,
    emergencyContactPhone: string,
    emergencyContactRelation: string,
    newsletter: boolean,
    termsAccepted: boolean,
    privacyPolicyAccepted: boolean
  ): void {
    console.log(`Creating user: ${firstName} ${lastName}`);
    console.log(`Email: ${email}, Phone: ${phone}`);
    console.log(
      `Address: ${streetAddress}, ${city}, ${state} ${zipCode}, ${country}`
    );
    console.log(`DOB: ${dateOfBirth}, Gender: ${gender}`);
    console.log(`Work: ${occupation} at ${company}`);
    console.log(
      `Emergency: ${emergencyContactName} (${emergencyContactRelation}) - ${emergencyContactPhone}`
    );
    console.log(
      `Newsletter: ${newsletter}, Terms: ${termsAccepted}, Privacy: ${privacyPolicyAccepted}`
    );
  }

  updateUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    dateOfBirth: Date,
    gender: string,
    occupation: string,
    company: string,
    emergencyContactName: string,
    emergencyContactPhone: string,
    emergencyContactRelation: string,
    newsletter: boolean,
    termsAccepted: boolean,
    privacyPolicyAccepted: boolean
  ): void {
    console.log(`Updating user ${userId}`);
    // Same parameter handling as createUser...
  }
}

class EmailService {
  sendWelcomeEmail(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    company: string,
    newsletter: boolean
  ): void {
    console.log(
      `Sending welcome email to ${firstName} ${lastName} at ${email}`
    );
    console.log(`User details: ${company}, ${city}, ${state}, ${country}`);
    console.log(`Newsletter subscription: ${newsletter}`);
  }
}

// Usage - Long parameter lists are error-prone and hard to read
const registrationService = new UserRegistrationService();
const emailService = new EmailService();

registrationService.createUser(
  "John",
  "Doe",
  "john@example.com",
  "555-1234",
  "123 Main St",
  "Springfield",
  "IL",
  "62701",
  "USA",
  new Date("1990-01-01"),
  "Male",
  "Developer",
  "Tech Corp",
  "Jane Doe",
  "555-5678",
  "Sister",
  true,
  true,
  true
);

emailService.sendWelcomeEmail(
  "John",
  "Doe",
  "john@example.com",
  "555-1234",
  "123 Main St",
  "Springfield",
  "IL",
  "62701",
  "USA",
  "Tech Corp",
  true
);

// ============================================================

// The Solution
// Preserve whole objects instead of passing individual parameters
class PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: Date,
    gender: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getContactInfo(): string {
    return `${this.email}, ${this.phone}`;
  }
}

class Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  constructor(
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ) {
    this.streetAddress = streetAddress;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.country = country;
  }

  getFullAddress(): string {
    return `${this.streetAddress}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }

  getLocationInfo(): string {
    return `${this.city}, ${this.state}, ${this.country}`;
  }
}

class WorkInfo {
  occupation: string;
  company: string;

  constructor(occupation: string, company: string) {
    this.occupation = occupation;
    this.company = company;
  }

  getWorkDetails(): string {
    return `${this.occupation} at ${this.company}`;
  }
}

class EmergencyContact {
  name: string;
  phone: string;
  relation: string;

  constructor(name: string, phone: string, relation: string) {
    this.name = name;
    this.phone = phone;
    this.relation = relation;
  }

  getContactInfo(): string {
    return `${this.name} (${this.relation}) - ${this.phone}`;
  }
}

class UserPreferences {
  newsletter: boolean;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;

  constructor(newsletter: boolean, termsAccepted: boolean, privacyPolicyAccepted: boolean) {
    this.newsletter = newsletter;
    this.termsAccepted = termsAccepted;
    this.privacyPolicyAccepted = privacyPolicyAccepted;
  }

  areAllTermsAccepted(): boolean {
    return this.termsAccepted && this.privacyPolicyAccepted;
  }
}

class RefactoredUserRegistrationService {
  createUser(
    personalInfo: PersonalInfo,
    address: Address,
    workInfo: WorkInfo,
    emergencyContact: EmergencyContact,
    preferences: UserPreferences
  ): void {
    console.log(`Creating user: ${personalInfo.getFullName()}`);
    console.log(`Contact: ${personalInfo.getContactInfo()}`);
    console.log(`Address: ${address.getFullAddress()}`);
    console.log(`DOB: ${personalInfo.dateOfBirth}, Gender: ${personalInfo.gender}`);
    console.log(`Work: ${workInfo.getWorkDetails()}`);
    console.log(`Emergency: ${emergencyContact.getContactInfo()}`);
    console.log(`Newsletter: ${preferences.newsletter}, Terms: ${preferences.termsAccepted}, Privacy: ${preferences.privacyPolicyAccepted}`);
  }

  updateUser(
    userId: string,
    personalInfo: PersonalInfo,
    address: Address,
    workInfo: WorkInfo,
    emergencyContact: EmergencyContact,
    preferences: UserPreferences
  ): void {
    console.log(`Updating user ${userId}`);
    // Same logic but with organized parameters
  }
}

class RefactoredEmailService {
  sendWelcomeEmail(
    personalInfo: PersonalInfo,
    address: Address,
    workInfo: WorkInfo,
    preferences: UserPreferences
  ): void {
    console.log(`Sending welcome email to ${personalInfo.getFullName()} at ${personalInfo.email}`);
    console.log(`User details: ${workInfo.company}, ${address.getLocationInfo()}`);
    console.log(`Newsletter subscription: ${preferences.newsletter}`);
  }
}

// Usage after refactoring
console.log("=== After Refactoring ===");

const personalInfo = new PersonalInfo(
  "John",
  "Doe",
  "john@example.com",
  "555-1234",
  new Date("1990-01-01"),
  "Male"
);

const address = new Address(
  "123 Main St",
  "Springfield",
  "IL",
  "62701",
  "USA"
);

const workInfo = new WorkInfo("Developer", "Tech Corp");

const emergencyContact = new EmergencyContact(
  "Jane Doe",
  "555-5678",
  "Sister"
);

const preferences = new UserPreferences(true, true, true);

const refactoredRegistrationService = new RefactoredUserRegistrationService();
const refactoredEmailService = new RefactoredEmailService();

refactoredRegistrationService.createUser(
  personalInfo,
  address,
  workInfo,
  emergencyContact,
  preferences
);

refactoredEmailService.sendWelcomeEmail(
  personalInfo,
  address,
  workInfo,
  preferences
);

// Benefits:
// 1. Dramatic parameter reduction (19 params → 5 meaningful objects)
// 2. Self-documenting code - parameter types clearly indicate what data is expected
// 3. Reusable objects - same objects can be used across multiple methods
// 4. Type safety - impossible to mix up parameter order
// 5. Easier maintenance - adding new fields only requires updating relevant classes
// 6. Better encapsulation - related data is grouped together with helpful methods
// 7. Reduced cognitive load - easier to understand method signatures