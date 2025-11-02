# Refused Bequest

Refused Bequest is a bad smell in code categorized under the "Object-Orientation Abusers" section of code smells. It occurs when a subclass inherits methods and data from its parent class but chooses not to want or need the gifts it is given, only playing with a few of the inherited features.

## Why it's a Problem

The existence of the Refused Bequest smell traditionally implies that the inheritance hierarchy is wrong. Inheritance is a mechanism where subclasses receive the methods and data of their parents. If a subclass declines these inherited features, it signals that the elements being inherited are not common or generally applicable, contradicting the premise of the parent class.

The smell is generally considered much stronger if the subclass reuse behavior but refuses to support the interface of the superclass. If the interface itself is refused, it suggest a profound misalignment in the abstraction provided by the hierarchy.

## Refactoring Techniques

### Extract Superclass

```typescript
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

  setHeigh(height: number): void {
    this.height = height;
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

class Square extends Rectangle {
  constructor(side: number) {
    super(side, side);
  }

  setSide(side: number): void {
    this.width = side;
    this.height = side;
  }

  getSide(): number {
    return this.width;
  }
}
```

```typescript
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

class Rectangle extends Shape {
  constructor(width: number, height: number) {
    super(width, height);
  }

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

class Square extends Shape {
  constructor(side: number) {
    super(side, side);
  }

  setSide(side: number): void {
    this.width = side;
    this.height = side;
  }

  getSide(): number {
    return this.width;
  }

  scale(factor: number): void {
    const newSide = this.width * factor;
    this.setSide(newSide);
  }
}
```

### Replace With Delegation

```typescript
class ArrayList<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(index: number): T | undefined {
    return this.items.splice(index, 1)[0];
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  set(index: number, item: T): void {
    this.items[index] = item;
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }
}

class Stack<T> extends ArrayList<T> {
  push(item: T): void {
    this.add(item); // Using inherited method
  }

  pop(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.remove(this.size() - 1);
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.get(this.size() - 1);
  }
}
```

```typescript
class ArrayList<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(index: number): T | undefined {
    return this.items.splice(index, 1)[0];
  }

  size(): number {
    return this.items.length;
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  set(index: number, item: T): void {
    this.items[index] = item;
  }

  clear(): void {
    this.items = [];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

class Stack<T> {
  private list: ArrayList<T> = new ArrayList<T>();

  push(item: T): void {
    this.list.add(item);
  }

  pop(): T | undefined {
    if (this.list.isEmpty()) return undefined;
    return this.list.remove(this.list.size() - 1);
  }

  peek(): T | undefined {
    if (this.list.isEmpty()) return undefined;
    return this.list.get(this.list.size() - 1);
  }

  size(): number {
    return this.list.size();
  }
}
```

## When Not to Refactor

Although Refused Bequest indicates a potential issue, developers often find it is not mandatory to fix.

- **When the smell is weak or faint**: The smell is often "too faint to be worth cleaning". Developers commonly use subclassing simply to reuse a bit of behavior, and this practice is considered a perfectly good approach ("a perfectly good way of doing business"). You should only follow the traditional advice to fix the hierarchy if the refused bequest is actively causing confusion and problems.

- **When delegation is the better approach**: If the strong smell is present - meaning the subclass reuses behavior but fundamentally rejects the interface of the superclass - the solution is to "gut" the hierarchy rather than trying to reorganize it. In this specific case, the recommended refactorings are **Replace Subclass with Delegate** or **Replace Superclass with Delegate**. These refactorings replace subclasses with patterns that rely on the host delegating responsibilities to a separate entity or hierarchy.
