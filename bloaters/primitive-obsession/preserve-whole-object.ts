// The Problem
// Preserve Whole Object: You get several values from an object and then pass them as parameters to a method
class Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(width: number, height: number, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  getWidth(): number {
    return this.width;
  }
  getHeight(): number {
    return this.height;
  }
  getX(): number {
    return this.x;
  }
  getY(): number {
    return this.y;
  }
}

class CollisionDetector {
  checkCollision(
    width1: number,
    height1: number,
    x1: number,
    y1: number,
    width2: number,
    height2: number,
    x2: number,
    y2: number
  ): boolean {
    return (
      x1 < x2 + width2 &&
      x1 + width1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    );
  }
}

class Game {
  private detector = new CollisionDetector();

  checkRectangleCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    // Smell: Extracting individual values from objects
    const width1 = rect1.getWidth();
    const height1 = rect1.getHeight();
    const x1 = rect1.getX();
    const y1 = rect1.getY();

    const width2 = rect2.getWidth();
    const height2 = rect2.getHeight();
    const x2 = rect2.getX();
    const y2 = rect2.getY();

    // Passing primitive values instead of whole objects
    return this.detector.checkCollision(
      width1,
      height1,
      x1,
      y1,
      width2,
      height2,
      x2,
      y2
    );
  }
}

// Usage
const rect1 = new Rectangle(10, 20, 5, 5);
const rect2 = new Rectangle(15, 25, 10, 10);
const game = new Game();
console.log(game.checkRectangleCollision(rect1, rect2));

// ============================================================

// The Solution
// Preserve whole objects instead of extracting primitive values
class RefactoredCollisionDetector {
  checkCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
      rect1.getX() < rect2.getX() + rect2.getWidth() &&
      rect1.getX() + rect1.getWidth() > rect2.getX() &&
      rect1.getY() < rect2.getY() + rect2.getHeight() &&
      rect1.getY() + rect1.getHeight() > rect2.getY()
    );
  }
}

class RefactoredGame {
  private detector = new RefactoredCollisionDetector();

  checkRectangleCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    // Passing whole objects instead of primitive values
    return this.detector.checkCollision(rect1, rect2);
  }
}

// Usage after refactoring
console.log("=== After Refactoring ===");
const refactoredGame = new RefactoredGame();
console.log(refactoredGame.checkRectangleCollision(rect1, rect2));

// Benefits:
// 1. Reduced parameter explosion (8 params → 2 params)
// 2. Less error-prone - no risk of mixing up parameter order
// 3. More maintainable - method signature doesn't change if Rectangle gains properties
// 4. Better encapsulation - objects stay intact
// 5. Clearer intent - method clearly operates on Rectangle objects