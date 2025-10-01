# Divergent Change

Divergent change is recognized as a "bad smell" in code and is categorized as a "Change Preventer". It occurs when one module is frequently modified in different ways for different reasons.

## Why it's a Problem?

The fundamental issue with Divergent Change is that it indicates a failure in modularity and cohesion, making the software harder to maintain and modify.

- **Violation of Cohesion and Separation of Concerns**: Divergent Change signals that a single module is conflating multiple, distinct areas of responsibility or "contexts". For example, if a module require changes to three functions whenever a new database is added, but changes to four different function when a new financial instrument is introduced, this means two separate contexts (database interaction and financial processing) are mixed together.

- **Increased Effort and Risk:**: The goal of structuring software is to enable changes to be made by jumping to a single, clear point in the system. When divergent change occurs, a modification related to one context (e.g, financial processing) forces a developer to interact with a module that also contains code for unrelated contexts. This significantly increases the effort required to make a change and heightens the risk of introducing unintended consequences or bugs in the unrelated parts of module.

## Refactoring Techniques

### Extract Superclass

```typescript
// Before: Multiple classes with duplicated common functionality.
class PhysicalProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public weight: number,
    public dimensions: { length: number; width: number; height: number }
  ) {}

  // Common product operations - duplicated across product types
  calculateTax(): number {
    return this.price * 0.1;
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  // Physical product specific
  calculateShippingCost(): number {
    const volumeWeight =
      (this.dimensions.length *
        this.dimensions.width *
        this.dimensions.height) /
      5000;
    return Math.max(this.weight, volumeWeight) * 2.5;
  }
}

class DigitalProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public fileSize: number,
    public downloadFormat: string
  ) {}

  // Common product operations - DUPLICATED
  calculateTax(): number {
    return this.price * 0.1;
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  // Digital product specific
  generateDownloadLink(): string {
    return `https://downloads.example.com/${this.id}.${this.downloadFormat}`;
  }
}

class SubscriptionProduct {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public billingCycle: "monthly" | "yearly",
    public features: string[]
  ) {}

  // Common product operations - DUPLICATED
  calculateTax(): number {
    return this.price * 0.1;
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  // Subscription product specific
  getNextBillingDate(): Date {
    const now = new Date();
    if (this.billingCycle === "monthly") {
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  }
}
```

**Code Issue**:
The product classes exhibit divergent change because when adding a new product type or modifying common business logic (like tax calculation), you need to change multiple unrelated classes. Each class duplicates common functionality, making the system harder to maintain and prone to inconsistencies.

```typescript
// After: Common functionality is extracted into a superclass.
abstract class Product {
  constructor(public id: string, public name: string, public price: number) {}

  // Common product operations - centralized in superclass
  calculateTax(): number {
    return this.price * 0.1;
  }

  applyDiscount(percentage: number): number {
    return this.price * (1 - percentage / 100);
  }

  validatePrice(): boolean {
    return this.price > 0;
  }

  calculateFinalPrice(discountPercentage: number = 0): number {
    const discountedPrice = this.applyDiscount(discountPercentage);
    return discountedPrice + this.calculateTax();
  }
}

class PhysicalProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public weight: number,
    public dimensions: { length: number; width: number; height: number }
  ) {
    super(id, name, price);
  }

  calculateShippingCost(): number {
    const volumeWeight =
      (this.dimensions.length *
        this.dimensions.width *
        this.dimensions.height) /
      5000;
    return Math.max(this.weight, volumeWeight) * 2.5;
  }

  canShipTo(country: string): boolean {
    const restrictedCountries = ["Country1", "Country2"];
    return !restrictedCountries.includes(country);
  }
}

class DigitalProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public fileSize: number,
    public downloadFormat: string
  ) {
    super(id, name, price);
  }

  generateDownloadLink(): string {
    return `https://downloads.example.com/${this.id}.${this.downloadFormat}`;
  }

  getFileInfo(): string {
    return `${this.fileSize}MB ${this.downloadFormat.toUpperCase()} file`;
  }
}

class SubscriptionProduct extends Product {
  constructor(
    id: string,
    name: string,
    price: number,
    public billingCycle: "monthly" | "yearly",
    public features: string[]
  ) {
    super(id, name, price);
  }

  getNextBillingDate(): Date {
    const now = new Date();
    if (this.billingCycle === "monthly") {
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  }

  listFeatures(): string {
    return this.features.join(", ");
  }
}
```

**Benefits**:

- **Centralized Common Logic**: Tax calculation, discount application, and price validation are now in one place, eliminating duplication.
- **Easier Maintenance**: Changes to common business logic only need to be made in the superclass.
- **Polymorphic Operations**: All products can be treated uniformly through the common interface.
- **Simplified Extension**: Adding new product types requires implementing only product-specific behavior.

### Extract Class

```typescript
// Before: A single class handling multiple responsibilities.
class ProductManager {
  private products: Product[] = [];

  // Product data management methods
  addProduct(product: Product): void {
    this.products.push(product);
    console.log(`Product ${product.name} added to catalog`);
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
    console.log(`Product ${productId} removed from catalog`);
  }

  findProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  findProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  // Display and formatting methods
  formatProductForDisplay(product: Product): string {
    return `${product.name} - $${product.price} (${product.category})`;
  }

  generateProductCatalog(): string {
    return this.products.map((p) => this.formatProductForDisplay(p)).join("\n");
  }

  // Inventory management methods
  checkStock(productId: string): boolean {
    const product = this.findProductById(productId);
    return product ? product.inStock : false;
  }

  updateStock(productId: string, inStock: boolean): void {
    const product = this.findProductById(productId);
    if (product) {
      product.inStock = inStock;
    }
  }
}
```

**Code Issue**:
The `ProductManager` class suffers from divergent change because it handles multiple responsibilities: data management, display formatting, and inventory management. When adding new product features, display formats, or inventory logic, you need to modify this single class in different ways for different reasons.

```typescript
// After: Responsibilities are separated into focused classes.
class ProductCatalog {
  private products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
    console.log(`Product ${product.name} added to catalog`);
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
    console.log(`Product ${productId} removed from catalog`);
  }

  findProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  findProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  getAllProducts(): Product[] {
    return [...this.products];
  }
}

class ProductDisplayFormatter {
  formatProductForDisplay(product: Product): string {
    return `${product.name} - $${product.price} (${product.category})`;
  }

  generateProductCatalog(products: Product[]): string {
    return products.map((p) => this.formatProductForDisplay(p)).join("\n");
  }
}

class InventoryManager {
  updateStock(product: Product, inStock: boolean): void {
    product.inStock = inStock;
    console.log(
      `Stock status for ${product.name} updated to ${
        inStock ? "in stock" : "out of stock"
      }`
    );
  }

  checkStock(product: Product): boolean {
    return product.inStock;
  }

  getLowStockProducts(products: Product[]): Product[] {
    return products.filter((p) => !p.inStock);
  }
}

class ProductManager {
  private catalog: ProductCatalog;
  private formatter: ProductDisplayFormatter;
  private inventoryManager: InventoryManager;

  constructor() {
    this.catalog = new ProductCatalog();
    this.formatter = new ProductDisplayFormatter();
    this.inventoryManager = new InventoryManager();
  }

  addProduct(product: Product): void {
    this.catalog.addProduct(product);
  }

  generateCatalog(): string {
    return this.formatter.generateProductCatalog(this.catalog.getAllProducts());
  }

  updateProductStock(productId: string, inStock: boolean): void {
    const product = this.catalog.findProductById(productId);
    if (product) {
      this.inventoryManager.updateStock(product, inStock);
    }
  }
}
```

**Benefits**:

- **Single Responsibility**: Each class now has a single, well-defined responsibility.
- **Easier Maintenance**: Changes to catalog logic, display formatting, or inventory management are isolated to their respective classes.
- **Improved Testability**: Each class can be tested independently without complex setup.
- **Enhanced Reusability**: Individual components can be reused in different contexts.

_For detailed code examples, see the files in this folder._

## When Not to Refactor

- **When Code Is Stable and Not Changing**: If the code exhibiting the smell works correctly and does not require frequent modification, the cost of refactoring may not be warranted. Refactoring provides value primarily when the code needs to be understood or changed.

- **When Costs Outweigh Benefits**: Deciding whether to refactor or rewrite code requires good judgment and experience. If the complexity of reorganizing the tangled module is too high, or if rewriting the relevant section is easier, refactoring should be avoided.

- **In Early Stages of Development**: Context boundaries (the separation points needed to fix Divergent Change) are often unclear in the early life of a program and continue to shift as software capabilities evolve. The problem often only becomes pronounced and clear enough to address constructively after repeated modifications have been made, such as adding several new features or components. Trying to fix it prematurely might introduce speculative generality or hooks that are ultimately unnecessary.
