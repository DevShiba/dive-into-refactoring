// The Problem
// You have multiple small classes that do almost nothing, causing shotgun surgery.
// Making a simple change requires modifying many classes across the codebase.

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

class UserId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}

class Username {
  private username: string;

  constructor(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }
}

class UserEmail {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  isValid(): boolean {
    return this.email.includes("@");
  }
}

class UserRole {
  private role: string;

  constructor(role: string) {
    this.role = role;
  }

  getRole(): string {
    return this.role;
  }

  setRole(role: string): void {
    this.role = role;
  }

  isAdmin(): boolean {
    return this.role === "admin";
  }
}

class User {
  private userId: UserId;
  private username: Username;
  private userEmail: UserEmail;
  private userRole: UserRole;

  constructor(data: UserData) {
    this.userId = new UserId(data.id);
    this.username = new Username(data.username);
    this.userEmail = new UserEmail(data.email);
    this.userRole = new UserRole(data.role);
  }

  getUserInfo(): string {
    return `${this.userId.getId()}: ${this.username.getUsername()} (${this.userEmail.getEmail()}) -       
  ${this.userRole.getRole()}`;
  }

  updateUsername(username: string): void {
    this.username.setUsername(username);
  }

  updateEmail(email: string): void {
    this.userEmail.setEmail(email);
  }

  promoteToAdmin(): void {
    this.userRole.setRole("admin");
  }

  hasValidEmail(): boolean {
    return this.userEmail.isValid();
  }

  canAccess(): boolean {
    return this.userRole.isAdmin();
  }
}

// The Solution
// Move all features from the small classes into the main User class via Inline Class.

class RefactoredUser {
  private id: string;
  private username: string;
  private email: string;
  private role: string;
  
  constructor(data: UserData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
  }

  getUserInfo(): string {
    return `${this.id}: ${this.username} (${this.email}) - ${this.role}`;
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): string {
    return this.role;
  }

  updateUsername(username: string): void {
    this.username = username;
  }

  updateEmail(email: string): void {
    this.email = email;
  }
  
  promoteToAdmin(): void {
    this.role = "admin";
  }

  hasValidEmail(): boolean {
    return this.email.includes("@");
  }

  canAccess(): boolean {
    return this.role === "admin";
  }
}

// Example
const userData: UserData = {
  id: "user-123",
  username: "john_doe",
  email: "john@example.com",
  role: "user",
};

const originalUser = new User(userData);
console.log("Original:", originalUser.getUserInfo());

const refactoredUser = new RefactoredUser(userData);
refactoredUser.updateUsername("jane_doe");
refactoredUser.promoteToAdmin();
console.log("Refactored:", refactoredUser.getUserInfo());
