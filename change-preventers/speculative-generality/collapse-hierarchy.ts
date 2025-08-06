// The Problem
// You have a class hierarchy in which a subclass is practically the same as its superclass.
// This creates unnecessary complexity and maintenance overhead.

abstract class Document {
  protected title: string;
  protected content: string;
  protected createdAt: Date;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  abstract getDocumentType(): string;
}

class TextDocument extends Document {
  constructor(title: string, content: string) {
    super(title, content);
  }

  getDocumentType(): string {
    return "Text Document";
  }
}

// This is speculative generality - the PlainTextDocument adds nothing!
class PlainTextDocument extends TextDocument {
  constructor(title: string, content: string) {
    super(title, content);
  }
  
  // No additional functionality - just exists "in case we need it later"
}

class RichTextDocument extends TextDocument {
  private formatting: string[];

  constructor(title: string, content: string, formatting: string[]) {
    super(title, content);
    this.formatting = formatting;
  }

  getFormatting(): string[] {
    return this.formatting;
  }

  // This class actually adds value with specific functionality
}

// Usage showing the problem
const plainDoc = new PlainTextDocument("Simple Note", "Just some text");
const richDoc = new RichTextDocument("Formatted Doc", "Bold text", ["bold", "italic"]);

console.log("Problem - unnecessary hierarchy:");
console.log(plainDoc.getTitle(), plainDoc.getDocumentType());
console.log(richDoc.getTitle(), richDoc.getDocumentType());

// The Solution
// Merge the subclass and superclass by removing the unnecessary PlainTextDocument.

abstract class RefactoredDocument {
  protected title: string;
  protected content: string;
  protected createdAt: Date;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  abstract getDocumentType(): string;
}

class RefactoredTextDocument extends RefactoredDocument {
  private formatting?: string[];

  constructor(title: string, content: string, formatting?: string[]) {
    super(title, content);
    this.formatting = formatting;
  }

  getDocumentType(): string {
    return "Text Document";
  }

  getFormatting(): string[] {
    return this.formatting || [];
  }

  hasFormatting(): boolean {
    return this.formatting !== undefined && this.formatting.length > 0;
  }

  isRichText(): boolean {
    return this.hasFormatting();
  }
}

// Usage after refactoring
const simplifiedPlainDoc = new RefactoredTextDocument("Simple Note", "Just some text");
const simplifiedRichDoc = new RefactoredTextDocument("Formatted Doc", "Bold text", ["bold", "italic"]);

console.log("\nAfter collapse hierarchy refactoring:");
console.log(`${simplifiedPlainDoc.getTitle()} - Rich text: ${simplifiedPlainDoc.isRichText()}`);
console.log(`${simplifiedRichDoc.getTitle()} - Rich text: ${simplifiedRichDoc.isRichText()}`);
console.log(`Formatting: ${simplifiedRichDoc.getFormatting().join(", ")}`);