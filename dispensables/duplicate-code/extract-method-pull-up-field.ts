// The Problem: Two subclasses contain duplicate code that uses similar fields.

abstract class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract makeSound(): void;
}

class Dog extends Animal {
  private breed: string;
  private energyLevel: number; // Field used in duplicate code
  private lastFeedTime: Date;  // Field used in duplicate code

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
    this.energyLevel = 100;
    this.lastFeedTime = new Date();
  }

  makeSound(): void {
    console.log(`${this.name} barks: Woof! Woof!`);
  }

  // Duplicate code - method that checks if animal needs care
  needsCare(): boolean {
    const hoursWithoutFood = (Date.now() - this.lastFeedTime.getTime()) / (1000 * 60 * 60);
    const lowEnergy = this.energyLevel < 30;
    const needsFood = hoursWithoutFood > 8;
    
    if (lowEnergy || needsFood) {
      console.log(`${this.name} needs immediate attention!`);
      console.log(`Energy: ${this.energyLevel}%, Last fed: ${hoursWithoutFood.toFixed(1)} hours ago`);
      return true;
    }
    return false;
  }

  play(): void {
    this.energyLevel -= 20;
    console.log(`${this.name} played fetch! Energy: ${this.energyLevel}%`);
  }
}

class Cat extends Animal {
  private furColor: string;
  private energyLevel: number; // Same field as in Dog - duplicate
  private lastFeedTime: Date;  // Same field as in Dog - duplicate

  constructor(name: string, furColor: string) {
    super(name);
    this.furColor = furColor;
    this.energyLevel = 80;
    this.lastFeedTime = new Date();
  }

  makeSound(): void {
    console.log(`${this.name} meows: Meow! Meow!`);
  }

  // Same duplicate code as in Dog class
  needsCare(): boolean {
    const hoursWithoutFood = (Date.now() - this.lastFeedTime.getTime()) / (1000 * 60 * 60);
    const lowEnergy = this.energyLevel < 30;
    const needsFood = hoursWithoutFood > 8;
    
    if (lowEnergy || needsFood) {
      console.log(`${this.name} needs immediate attention!`);
      console.log(`Energy: ${this.energyLevel}%, Last fed: ${hoursWithoutFood.toFixed(1)} hours ago`);
      return true;
    }
    return false;
  }

  hunt(): void {
    this.energyLevel -= 15;
    console.log(`${this.name} hunted a mouse! Energy: ${this.energyLevel}%`);
  }
}

// ============================================================================

abstract class AnimalRefactored {
  protected name: string;
  protected energyLevel: number; // Pulled up from subclasses
  protected lastFeedTime: Date;  // Pulled up from subclasses

  constructor(name: string, initialEnergy: number = 100) {
    this.name = name;
    this.energyLevel = initialEnergy;
    this.lastFeedTime = new Date();
  }

  abstract makeSound(): void;

  // Extracted method 
  needsCare(): boolean {
    const hoursWithoutFood = (Date.now() - this.lastFeedTime.getTime()) / (1000 * 60 * 60);
    const lowEnergy = this.energyLevel < 30;
    const needsFood = hoursWithoutFood > 8;
    
    if (lowEnergy || needsFood) {
      console.log(`${this.name} needs immediate attention!`);
      console.log(`Energy: ${this.energyLevel}%, Last fed: ${hoursWithoutFood.toFixed(1)} hours ago`);
      return true;
    }
    return false;
  }

  feed(): void {
    this.energyLevel = Math.min(100, this.energyLevel + 30);
    this.lastFeedTime = new Date();
    console.log(`${this.name} has been fed! Energy: ${this.energyLevel}%`);
  }

  // Protected method for energy reduction (used by subclasses)
  protected reduceEnergy(amount: number): void {
    this.energyLevel = Math.max(0, this.energyLevel - amount);
  }
}

class DogRefactored extends AnimalRefactored {
  private breed: string;

  constructor(name: string, breed: string) {
    super(name, 100); // Dogs start with full energy
    this.breed = breed;
  }

  makeSound(): void {
    console.log(`${this.name} barks: Woof! Woof!`);
  }

  play(): void {
    this.reduceEnergy(20);
    console.log(`${this.name} played fetch! Energy: ${this.energyLevel}%`);
  }

  getBreed(): string {
    return this.breed;
  }
}

class CatRefactored extends AnimalRefactored {
  private furColor: string;

  constructor(name: string, furColor: string) {
    super(name, 80); // Cats start with slightly less energy
    this.furColor = furColor;
  }

  makeSound(): void {
    console.log(`${this.name} meows: Meow! Meow!`);
  }

  hunt(): void {
    this.reduceEnergy(15);
    console.log(`${this.name} hunted a mouse! Energy: ${this.energyLevel}%`);
  }

  getFurColor(): string {
    return this.furColor;
  }
}

// Usage example
const dog = new DogRefactored('Buddy', 'Golden Retriever');
const cat = new CatRefactored('Whiskers', 'Orange Tabby');

console.log('=== INITIAL STATE ===');
dog.makeSound();
cat.makeSound();

console.log('\n=== CHECKING CARE NEEDS ===');
console.log('Dog needs care:', dog.needsCare());
console.log('Cat needs care:', cat.needsCare());

console.log('\n=== ACTIVITIES ===');
dog.play();
dog.play();
dog.play();
dog.play();
dog.play(); 

cat.hunt();
cat.hunt();

console.log('\n=== CHECKING CARE NEEDS AFTER ACTIVITIES ===');
console.log('Dog needs care:', dog.needsCare());
console.log('Cat needs care:', cat.needsCare());

console.log('\n=== FEEDING TIME ===');
dog.feed();
cat.feed();

console.log('\n=== FINAL CHECK ===');
console.log('Dog needs care:', dog.needsCare());
console.log('Cat needs care:', cat.needsCare());