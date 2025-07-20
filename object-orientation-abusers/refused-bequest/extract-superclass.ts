// Refused Bequest - Extract Superclass Example
// Problem: A subclass inherits methods from its parent class but doesn't use or need them,
// violating the principle that inheritance should represent an "is-a" relationship.

// === BEFORE: Refused Bequest Smell ===

class Rectangle {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  isSquare(): boolean {
    return this.width === this.height;
  }

  scale(factor: number): void {
    this.width *= factor;
    this.height *= factor;
  }
}

// PROBLEM: Square inherits from Rectangle but "refuses" setWidth/setHeight methods
// These methods break the square constraint (equal sides) and don't make semantic sense
class Square extends Rectangle {
  constructor(side: number) {
    super(side, side);
  }

  // Square "refuses" the inherited setWidth and setHeight methods
  // because they would break the square's fundamental constraint
  // Client code can still call these methods, leading to bugs
  
  setSide(side: number): void {
    this.width = side;
    this.height = side;
  }

  getSide(): number {
    return this.width;
  }
}

// Problem demonstration
function demonstrateProblem() {
  const square = new Square(5);
  console.log("Square side:", square.getSide()); // 5
  
  // This breaks the square! Should not be possible
  square.setWidth(10);
  console.log("After setWidth(10) - width:", square.getWidth()); // 10
  console.log("After setWidth(10) - height:", square.getHeight()); // 5
  console.log("Is it still a square?", square.isSquare()); // false!
}

// === AFTER: Extract Superclass Solution ===

abstract class Shape {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  scale(factor: number): void {
    this.width *= factor;
    this.height *= factor;
  }
}

class RefactoredRectangle extends Shape {
  constructor(width: number, height: number) {
    super(width, height);
  }

  // Rectangle-specific methods that make sense for rectangles
  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  isSquare(): boolean {
    return this.width === this.height;
  }
}

class RefactoredSquare extends Shape {
  constructor(side: number) {
    super(side, side);
  }

  // Square-specific methods that maintain the square constraint
  setSide(side: number): void {
    this.width = side;
    this.height = side;
  }

  getSide(): number {
    return this.width;
  }

  // Override scale to maintain square constraint
  scale(factor: number): void {
    const newSide = this.width * factor;
    this.setSide(newSide);
  }
}

// === USAGE EXAMPLE ===

console.log("=== Before Refactoring (Problematic) ===");
demonstrateProblem();

console.log("\n=== After Refactoring (Clean) ===");
function demonstrateSolution() {
  const rect = new RefactoredRectangle(5, 10);
  const square = new RefactoredSquare(5);
  
  console.log("Rectangle area:", rect.getArea()); // 50
  console.log("Square area:", square.getArea()); // 25
  
  // Rectangle can change dimensions independently
  rect.setWidth(8);
  console.log("Rectangle after setWidth(8):", rect.getWidth(), "x", rect.getHeight()); // 8 x 10
  
  // Square maintains its constraint - no setWidth/setHeight methods available!
  // square.setWidth(8); // ❌ Compilation error - method doesn't exist
  square.setSide(8);
  console.log("Square after setSide(8):", square.getSide()); // 8
  
  // Both can scale appropriately
  rect.scale(2);
  square.scale(2);
  console.log("Rectangle after scale(2):", rect.getWidth(), "x", rect.getHeight()); // 16 x 20
  console.log("Square after scale(2):", square.getSide()); // 16
}

demonstrateSolution();

// Can use polymorphically for common operations
function demonstratePolymorphism() {
  const shapes: Shape[] = [
    new RefactoredRectangle(3, 4),
    new RefactoredSquare(5)
  ];
  
  shapes.forEach((shape, index) => {
    console.log(`Shape ${index + 1} area: ${shape.getArea()}`);
    shape.scale(1.5);
    console.log(`Shape ${index + 1} area after scaling: ${shape.getArea()}`);
  });
}

console.log("\n=== Polymorphic Usage ===");
demonstratePolymorphism();

// Benefits of Extract Superclass refactoring:
// 1. Eliminates refused bequest - each class only has methods it actually uses
// 2. Prevents runtime errors - impossible to break square constraint through inheritance
// 3. Cleaner interfaces - each class has only methods that make semantic sense
// 4. Better encapsulation - square logic is contained within RefactoredSquare
// 5. Maintains polymorphism for common behavior through the Shape base class
// 6. Follows Liskov Substitution Principle - subclasses can replace the base class
// 7. Reduces coupling between Rectangle and Square - they're now siblings, not parent-child
