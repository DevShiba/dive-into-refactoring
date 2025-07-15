// The Problem
// You have a subclass that uses only a portion of the methods of its superclass
// (or it's not possible to inherit superclass data).

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

  indexOf(item: T): number {
    return this.items.indexOf(item);
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// PROBLEM: Stack inherits from ArrayList but only needs push, pop, peek, and size
// The Stack shouldn't expose methods like get(), set(), indexOf(), etc.
// This violates the Liskov Substitution Principle and creates a confusing API
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

  // Problem: Stack now exposes inappropriate methods inherited from ArrayList
  // Users can call stack.get(0), stack.set(1, item), stack.indexOf(item), etc.
  // This breaks the Stack's LIFO (Last In, First Out) contract
}

// Usage example showing the problem:
const problemStack = new Stack<number>();
problemStack.push(1);
problemStack.push(2);
problemStack.push(3);

// These operations shouldn't be possible on a Stack!
console.log(problemStack.get(0)); // Access bottom of stack directly
problemStack.set(1, 999); // Modify middle of stack
console.log(problemStack.indexOf(2)); // Search in stack

// =============================================================================

// The Solution
// Create a field and put a superclass object in it, delegate methods to the
// superclass object, and get rid of inheritance.

class RefactoredArrayList<T> {
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

  indexOf(item: T): number {
    return this.items.indexOf(item);
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// SOLUTION: Use delegation instead of inheritance
class RefactoredStack<T> {
  private list: RefactoredArrayList<T> = new RefactoredArrayList<T>();

  push(item: T): void {
    this.list.add(item); // Delegate to the ArrayList
  }

  pop(): T | undefined {
    if (this.list.isEmpty()) return undefined;
    return this.list.remove(this.list.size() - 1); // Delegate to the ArrayList
  }

  peek(): T | undefined {
    if (this.list.isEmpty()) return undefined;
    return this.list.get(this.list.size() - 1); // Delegate to the ArrayList
  }

  size(): number {
    return this.list.size(); // Delegate to the ArrayList
  }

  isEmpty(): boolean {
    return this.list.isEmpty(); // Delegate to the ArrayList
  }

  clear(): void {
    this.list.clear(); // Delegate to the ArrayList
  }

  // Only expose methods that make sense for a Stack
  // No get(), set(), indexOf(), etc. - proper encapsulation!
}

// Usage example showing the solution:
const goodStack = new RefactoredStack<number>();
goodStack.push(1);
goodStack.push(2);
goodStack.push(3);

console.log(goodStack.peek()); // 3
console.log(goodStack.pop()); // 3
console.log(goodStack.size()); // 2

// These operations are no longer possible - good!
// goodStack.get(0);     // Error: Property 'get' does not exist
// goodStack.set(1, 999); // Error: Property 'set' does not exist
// goodStack.indexOf(2);  // Error: Property 'indexOf' does not exist

// Benefits of the refactored solution:
// 1. Stack has a clean, appropriate API that only exposes stack operations
// 2. No violation of Liskov Substitution Principle
// 3. Better encapsulation - internal ArrayList is hidden
// 4. Stack is no longer "is-a" ArrayList but "has-a" ArrayList
// 5. More flexible - can easily change internal implementation without affecting clients
