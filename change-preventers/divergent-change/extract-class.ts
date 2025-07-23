// The Problem
// You have a class that handles multiple responsibilities, causing divergent change.
// When adding new product types or features, you need to modify unrelated methods.

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  weight: number;
  dimensions: { length: number; width: number; height: number };
}

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

  updateProduct(productId: string, updates: Partial<Product>): void {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updates,
      };
      console.log(`Product ${productId} updated`);
    }
  }

  // Product search and filtering methods
  findProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  findProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  findProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    return this.products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );
  }

  searchProductsByName(searchTerm: string): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Display and formatting methods
  formatProductForDisplay(product: Product): string {
    return `${product.name} - $${product.price} (${product.category})`;
  }

  generateProductCatalog(): string {
    return this.products.map((p) => this.formatProductForDisplay(p)).join("\n");
  }

  generateCategoryReport(): string {
    const categories = [...new Set(this.products.map((p) => p.category))];
    return categories
      .map((cat) => {
        const count = this.products.filter((p) => p.category === cat).length;
        return `${cat}: ${count} products`;
      })
      .join("\n");
  }

  // Shipping calculation methods
  calculateShippingCost(productId: string, destination: string): number {
    const product = this.findProductById(productId);
    if (!product) return 0;

    const baseRate = this.getBaseShippingRate(destination);
    const weightMultiplier = product.weight * 0.1;
    const dimensionMultiplier = this.calculateDimensionMultiplier(
      product.dimensions
    );

    return baseRate + weightMultiplier + dimensionMultiplier;
  }

  private getBaseShippingRate(destination: string): number {
    const rates: { [key: string]: number } = {
      domestic: 5.99,
      international: 15.99,
      express: 25.99,
    };
    return rates[destination] || rates["domestic"];
  }

  private calculateDimensionMultiplier(dimensions: {
    length: number;
    width: number;
    height: number;
  }): number {
    const volume = dimensions.length * dimensions.width * dimensions.height;
    return volume > 1000 ? 10 : 2;
  }

  calculateBulkShipping(productIds: string[], destination: string): number {
    const totalCost = productIds.reduce((sum, id) => {
      return sum + this.calculateShippingCost(id, destination);
    }, 0);

    // Apply bulk discount
    return totalCost * 0.9;
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
      console.log(
        `Stock status for ${product.name} updated to ${
          inStock ? "in stock" : "out of stock"
        }`
      );
    }
  }

  getLowStockProducts(): Product[] {
    // In a real scenario, this would check actual inventory levels
    return this.products.filter((p) => !p.inStock);
  }

  generateInventoryReport(): string {
    const inStock = this.products.filter((p) => p.inStock).length;
    const outOfStock = this.products.filter((p) => !p.inStock).length;
    return `Inventory Report:\nIn Stock: ${inStock}\nOut of Stock: ${outOfStock}`;
  }
}

// Usage example showing the problem
const productManager = new ProductManager();

// Adding a new product type requires understanding ALL these different concerns
productManager.addProduct({
  id: "1",
  name: "Laptop",
  price: 999.99,
  category: "Electronics",
  inStock: true,
  weight: 2.5,
  dimensions: { length: 30, width: 20, height: 2 },
});

// When we want to add a new product category or modify shipping logic,
// we have to change this monolithic class in multiple unrelated places
console.log(productManager.generateProductCatalog());
console.log(productManager.calculateShippingCost("1", "domestic"));
console.log(productManager.generateInventoryReport());


// The Solution
// Extract separate classes for different responsibilities to eliminate divergent change.

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
  
  generateCategoryReport(products: Product[]): string {
    const categories = [...new Set(products.map((p) => p.category))];
    return categories
      .map((cat) => {
        const count = products.filter((p) => p.category === cat).length;
        return `${cat}: ${count} products`;
      })
      .join("\n");
  }
}

class ShippingCalculator {
  calculateShippingCost(product: Product, destination: string): number {
    const baseRate = this.getBaseShippingRate(destination);
    const weightMultiplier = product.weight * 0.1;
    const dimensionMultiplier = this.calculateDimensionMultiplier(product.dimensions);
    
    return baseRate + weightMultiplier + dimensionMultiplier;
  }
  
  private getBaseShippingRate(destination: string): number {
    const rates: { [key: string]: number } = {
      domestic: 5.99,
      international: 15.99,
      express: 25.99,
    };
    return rates[destination] || rates["domestic"];
  }
  
  private calculateDimensionMultiplier(dimensions: {
    length: number;
    width: number;
    height: number;
  }): number {
    const volume = dimensions.length * dimensions.width * dimensions.height;
    return volume > 1000 ? 10 : 2;
  }
  
  calculateBulkShipping(products: Product[], destination: string): number {
    const totalCost = products.reduce((sum, product) => {
      return sum + this.calculateShippingCost(product, destination);
    }, 0);
    
    return totalCost * 0.9;
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
  
  generateInventoryReport(products: Product[]): string {
    const inStock = products.filter((p) => p.inStock).length;
    const outOfStock = products.filter((p) => !p.inStock).length;
    return `Inventory Report:\nIn Stock: ${inStock}\nOut of Stock: ${outOfStock}`;
  }
}

class RefactoredProductManager {
  private catalog: ProductCatalog;
  private formatter: ProductDisplayFormatter;
  private shippingCalculator: ShippingCalculator;
  private inventoryManager: InventoryManager;
  
  constructor() {
    this.catalog = new ProductCatalog();
    this.formatter = new ProductDisplayFormatter();
    this.shippingCalculator = new ShippingCalculator();
    this.inventoryManager = new InventoryManager();
  }
  
  addProduct(product: Product): void {
    this.catalog.addProduct(product);
  }
  
  generateCatalog(): string {
    return this.formatter.generateProductCatalog(this.catalog.getAllProducts());
  }
  
  calculateShipping(productId: string, destination: string): number {
    const product = this.catalog.findProductById(productId);
    return product ? this.shippingCalculator.calculateShippingCost(product, destination) : 0;
  }
  
  updateProductStock(productId: string, inStock: boolean): void {
    const product = this.catalog.findProductById(productId);
    if (product) {
      this.inventoryManager.updateStock(product, inStock);
    }
  }
  
  getInventoryReport(): string {
    return this.inventoryManager.generateInventoryReport(this.catalog.getAllProducts());
  }
}

// Example
const originalManager = new ProductManager();
originalManager.addProduct({
  id: "1",
  name: "Laptop",
  price: 999.99,
  category: "Electronics",
  inStock: true,
  weight: 2.5,
  dimensions: { length: 30, width: 20, height: 2 },
});

console.log("Original:", originalManager.generateProductCatalog());
console.log("Shipping:", originalManager.calculateShippingCost("1", "domestic"));

const refactoredManager = new RefactoredProductManager();
refactoredManager.addProduct({
  id: "1",
  name: "Laptop",
  price: 999.99,
  category: "Electronics",
  inStock: true,
  weight: 2.5,
  dimensions: { length: 30, width: 20, height: 2 },
});

console.log("Refactored:", refactoredManager.generateCatalog());
console.log("Shipping:", refactoredManager.calculateShipping("1", "domestic"));

