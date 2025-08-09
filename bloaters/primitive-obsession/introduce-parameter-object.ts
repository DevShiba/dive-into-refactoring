// The Problem
// Your methods contain a repeating group of parameters.
class OrderService {
  calculateShippingCost(
    weight: number,
    length: number,
    width: number,
    height: number,
    zipCode: string,
    country: string,
    isExpress: boolean
  ): number {
    const volume = length * width * height;
    const baseRate = this.getBaseRate(country, zipCode);
    const weightMultiplier = weight * 0.5;
    const volumeMultiplier = volume * 0.001;
    const expressMultiplier = isExpress ? 2 : 1;

    return (baseRate + weightMultiplier + volumeMultiplier) * expressMultiplier;
  }

  validatePackage(
    weight: number,
    length: number,
    width: number,
    height: number,
    zipCode: string,
    country: string,
    isExpress: boolean
  ): boolean {
    if (weight > 50) return false;
    if (length > 100 || width > 100 || height > 100) return false;
    if (!this.isValidAddress(country, zipCode)) return false;
    if (isExpress && weight > 25) return false;
    return true;
  }

  createShippingLabel(
    weight: number,
    length: number,
    width: number,
    height: number,
    zipCode: string,
    country: string,
    isExpress: boolean
  ): string {
    const dimensions = `${length}x${width}x${height}`;
    const service = isExpress ? "EXPRESS" : "STANDARD";
    return `${service} - ${weight}kg - ${dimensions} - ${zipCode}, ${country}`;
  }

  private getBaseRate(country: string, zipCode: string): number {
    return country === "US" ? 5.99 : 12.99;
  }

  private isValidAddress(country: string, zipCode: string): boolean {
    return zipCode.length >= 5 && country.length === 2;
  }
}

class PackageDimensions {
  constructor(
    public readonly length: number,
    public readonly width: number,
    public readonly height: number,
    public readonly weight: number
  ) {}

  get volume(): number {
    return this.length * this.width * this.height;
  }

  get dimensionsString(): string {
    return `${this.length}x${this.width}x${this.height}`;
  }

  isOversized(): boolean {
    return this.length > 100 || this.width > 100 || this.height > 100;
  }

  isOverweight(): boolean {
    return this.weight > 50;
  }
}

class ShippingAddress {
  constructor(
    public readonly zipCode: string,
    public readonly country: string
  ) {}

  isValid(): boolean {
    return this.zipCode.length >= 5 && this.country.length === 2;
  }

  isDomestic(): boolean {
    return this.country === "US";
  }
}

class ShippingOptions {
  constructor(public readonly isExpress: boolean = false) {}

  get serviceType(): string {
    return this.isExpress ? "EXPRESS" : "STANDARD";
  }

  getMultiplier(): number {
    return this.isExpress ? 2 : 1;
  }
}


// The Solution
// Replace these parameters with an object.


class ImprovedOrderService {
  calculateShippingCost(
    dimensions: PackageDimensions,
    address: ShippingAddress,
    options: ShippingOptions
  ): number {
    const baseRate = this.getBaseRate(address);
    const weightMultiplier = dimensions.weight * 0.5;
    const volumeMultiplier = dimensions.volume * 0.001;
    const expressMultiplier = options.getMultiplier();

    return (baseRate + weightMultiplier + volumeMultiplier) * expressMultiplier;
  }

  validatePackage(
    dimensions: PackageDimensions,
    address: ShippingAddress,
    options: ShippingOptions
  ): boolean {
    if (dimensions.isOverweight()) return false;
    if (dimensions.isOversized()) return false;
    if (!address.isValid()) return false;
    if (options.isExpress && dimensions.weight > 25) return false;
    return true;
  }

  createShippingLabel(
    dimensions: PackageDimensions,
    address: ShippingAddress,
    options: ShippingOptions
  ): string {
    return `${options.serviceType} - ${dimensions.weight}kg - ${dimensions.dimensionsString} - ${address.zipCode}, ${address.country}`;
  }

  private getBaseRate(address: ShippingAddress): number {
    return address.isDomestic() ? 5.99 : 12.99;
  }
}

// Usage Example
const dimensions = new PackageDimensions(30, 20, 15, 5);
const address = new ShippingAddress("12345", "US");
const options = new ShippingOptions(true);

const service = new ImprovedOrderService();
const cost = service.calculateShippingCost(dimensions, address, options);
const isValid = service.validatePackage(dimensions, address, options);
const label = service.createShippingLabel(dimensions, address, options);

console.log(`Shipping cost: $${cost}`);
console.log(`Valid package: ${isValid}`);
console.log(`Label: ${label}`);