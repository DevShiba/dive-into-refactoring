// The Problem
// You have a class hierarchy where a subclass is practically the same as its superclass.
// The subclass adds little to no value and creates unnecessary complexity.

abstract class Vehicle {
  protected brand: string;
  protected model: string;
  protected year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo(): string {
    return `${this.year} ${this.brand} ${this.model}`;
  }

  abstract getType(): string;
}

class Car extends Vehicle {
  constructor(brand: string, model: string, year: number) {
    super(brand, model, year);
  }

  getType(): string {
    return "Car";
  }
}

class Sedan extends Car {
  constructor(brand: string, model: string, year: number) {
    super(brand, model, year);
  }

  // This subclass adds no meaningful functionality
  // It just exists but doesn't override or add anything useful
}

class SportsCar extends Car {
  private maxSpeed: number;

  constructor(brand: string, model: string, year: number, maxSpeed: number) {
    super(brand, model, year);
    this.maxSpeed = maxSpeed;
  }

  getMaxSpeed(): number {
    return this.maxSpeed;
  }

  // This class actually adds value with specific functionality
}

// Usage showing the problem
const sedan = new Sedan("Toyota", "Camry", 2023);
const sportsCar = new SportsCar("Ferrari", "F8", 2023, 340);

console.log("Problem with unnecessary hierarchy:");
console.log(sedan.getInfo()); // Sedan adds nothing over Car
console.log(sedan.getType()); // Just returns "Car" anyway
console.log(sportsCar.getInfo());
console.log(`Max speed: ${sportsCar.getMaxSpeed()}`);

// The Solution
// Collapse the hierarchy by merging the unnecessary subclass with its parent.

abstract class RefactoredVehicle {
  protected brand: string;
  protected model: string;
  protected year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo(): string {
    return `${this.year} ${this.brand} ${this.model}`;
  }

  abstract getType(): string;
}

class RefactoredCar extends RefactoredVehicle {
  private maxSpeed?: number;

  constructor(brand: string, model: string, year: number, maxSpeed?: number) {
    super(brand, model, year);
    this.maxSpeed = maxSpeed;
  }

  getType(): string {
    return "Car";
  }

  getMaxSpeed(): number | undefined {
    return this.maxSpeed;
  }

  // We can now handle both regular cars and sports cars in one class
  isSportsCar(): boolean {
    return this.maxSpeed !== undefined && this.maxSpeed > 200;
  }
}

class RefactoredTruck extends RefactoredVehicle {
  private payloadCapacity: number;

  constructor(brand: string, model: string, year: number, payloadCapacity: number) {
    super(brand, model, year);
    this.payloadCapacity = payloadCapacity;
  }

  getType(): string {
    return "Truck";
  }

  getPayloadCapacity(): number {
    return this.payloadCapacity;
  }
}

// Usage example
const regularCar = new RefactoredCar("Toyota", "Camry", 2023);
const sportsCar2 = new RefactoredCar("Ferrari", "F8", 2023, 340);
const truck = new RefactoredTruck("Ford", "F-150", 2023, 1500);

console.log("\nBenefits of collapsed hierarchy:");
console.log(regularCar.getInfo());
console.log(`Is sports car: ${regularCar.isSportsCar()}`);
console.log(sportsCar2.getInfo());
console.log(`Is sports car: ${sportsCar2.isSportsCar()}`);
console.log(`Max speed: ${sportsCar2.getMaxSpeed()}`);
console.log(truck.getInfo());
console.log(`Payload: ${truck.getPayloadCapacity()} lbs`);