// The Problem
// Data clumps: The same group of variables (host, port, username, password) appears in multiple places throughout the code

class DatabaseService {
  connectToUserDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(
      `Connecting to user database at ${host}:${port} with user ${username}`
    );
  }

  connectToProductDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(
      `Connecting to product database at ${host}:${port} with user ${username}`
    );
  }

  connectToOrderDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(
      `Connecting to order database at ${host}:${port} with user ${username}`
    );
  }
}

class ReportGenerator {
  generateUserReport(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(
      `Generating user report from ${host}:${port} with user ${username}`
    );
  }

  generateSalesReport(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(
      `Generating sales report from ${host}:${port} with user ${username}`
    );
  }
}

class BackupService {
  backupDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(`Backing up database at ${host}:${port} with user ${username}`);
  }

  restoreDatabase(
    host: string,
    port: number,
    username: string,
    password: string
  ): void {
    console.log(`Restoring database at ${host}:${port} with user ${username}`);
  }
}

// Usage
const dbService = new DatabaseService();
const reportGen = new ReportGenerator();
const backupService = new BackupService();

// Using the same parameters repeatedly leads to data clumps
const host = "localhost";
const port = 5432;
const username = "admin";
const password = "secret123";

dbService.connectToUserDatabase(host, port, username, password);
reportGen.generateUserReport(host, port, username, password);
backupService.backupDatabase(host, port, username, password);

// ============================================================

// The Solution
class DatabaseConnection {
  private host: string;
  private port: number;
  private username: string;
  private password: string;

  constructor(host: string, port: number, username: string, password: string) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
  }

  // Extract method: Common connection logic
  private createConnectionString(): string {
    return `postgres://${this.username}:${this.password}@${this.host}:${this.port}`;
  }

  // Extract method: Common authentication info
  private getAuthenticationInfo(): string {
    return `User: ${this.username}`;
  }

  // Extract method: Common connection procedure
  connect(databaseName: string): void {
    console.log(
      `Connecting to ${databaseName} database at ${this.createConnectionString()} with ${this.getAuthenticationInfo()}`
    );
  }

  // Getters for when individual components are needed
  getHost(): string {
    return this.host;
  }
  getPort(): number {
    return this.port;
  }
  getUsername(): string {
    return this.username;
  }
  getConnectionString(): string {
    return this.createConnectionString();
  }
}

class RefactoredDatabaseService {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  // Extract method: Common connection pattern
  private connectToDatabase(databaseName: string): void {
    this.connection.connect(databaseName);
  }

  connectToUserDatabase(): void {
    this.connectToDatabase("user");
  }

  connectToProductDatabase(): void {
    this.connectToDatabase("product");
  }

  connectToOrderDatabase(): void {
    this.connectToDatabase("order");
  }
}

class RefactoredReportGenerator {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  // Extract method: Common report generation pattern
  private generateReport(reportType: string): void {
    console.log(
      `Generating ${reportType} report from ${this.connection.getConnectionString()} with ${this.connection.getUsername()}`
    );
    // Report generation logic here
  }

  generateUserReport(): void {
    this.generateReport("user");
  }

  generateSalesReport(): void {
    this.generateReport("sales");
  }
}

class RefactoredBackupService {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  // Extract method: Common backup operation pattern
  private performBackupOperation(operation: string): void {
    console.log(
      `${operation} database at ${this.connection.getConnectionString()} with ${this.connection.getUsername()}`
    );
  }

  backupDatabase(): void {
    this.performBackupOperation("Backing up");
  }

  restoreDatabase(): void {
    this.performBackupOperation("Restoring");
  }
}

// Usage after refactoring
console.log("=== After Refactoring ===");

// Create the connection object once
const dbConnection = new DatabaseConnection("localhost", 5432, "admin", "secret123");

// Pass the connection object instead of individual parameters
const refactoredDbService = new RefactoredDatabaseService(dbConnection);
const refactoredReportGen = new RefactoredReportGenerator(dbConnection);
const refactoredBackupService = new RefactoredBackupService(dbConnection);

// Clean, simple method calls
refactoredDbService.connectToUserDatabase();
refactoredReportGen.generateUserReport();
refactoredBackupService.backupDatabase();

// Benefits:
// 1. No more repeated parameter lists
// 2. Easier to maintain connection details in one place
// 3. Type safety and better encapsulation
// 4. Common patterns extracted into reusable methods
// 5. If connection requirements change, only one class needs updating