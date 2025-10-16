# Speculative Generality

Speculative Generality is a type of "bad smell" in code, categorized as a "Dispensable" or "Change Preventer". This smell occurs when developers add hooks, parameters, or special cases to handle functionality they anticipate might be needed sometime in the future, based on the belief that will "need the ability to do this kind of thing someday". This tendency often manifest as the premature inclusion of "flexibility mechanisms" into the software, intended to handle anticipated future variations of circumstances.

## Why it's Problem?

That introduces complexity and friction into the codebase unnecessarily.

- **Increased Maintenance Burden and Complexity**: If the added machinery is not actually used, it simple gets in the way, making the code harder to understand and maintain.

- **Wasted Effort**: Adding flexibility mechanisms, such as multiple parameters to a function, complicates that function even for the one current case it is used for.

- **Design Risk**: Architects often find that these anticipated flexibility needs do not materialize as expected, or that the design mechanism implemented to support them is faulty. Furthermore, fi a necessary element is later missed, all the prior parameterization may make it harder to add the required flexibility subsequently.

- **Obscuring Intent**: Leads to designs that are built for hypothetical future needs rather than current needs. This often obscures what the program is currently doing.

## Refactoring Technique

### Collapse Hierarchy

```typescript
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
}
```

```typescript
abstract class RefactoredDocument {
  protected title: string;
  protected content: string;
  protected createdAt: Date;

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
```

## When Not to Refactor

- **Code is Not Being Modified**: If the speculative code is part of a messy section that does not currently require modification, there may be no immediate benefit to cleaning it up. Refactoring is most valuable when the code needs to be understood or changed.

- **Strategic Incremental Flexibility**: The general strategy is to build software that solves only the currently understood needs, and then use refactoring to adapt the architecture later as understanding changes. However, developers might justify adding a flexibility mechanism now if they estimate that it would be substantially harder to apply the necessary refactoring later to support an anticipated change.

- **Delaying Refactoring When the Path is Unclear**: When confronted with ugly code resulting from speculating, if a programmer is unsure what specific improvement to make, they might delay the refactoring. However, refactoring should generally proceed by truing small changes as experiments to test if they improve the code.

- **Inherent Simplicity:**: Mechanisms that do not increase complexity, such as "small, well-named functions", can be included even when flexibility is not immediately needed. If assumptions about future functionality turn out to be true, developers can easily add that functionality later by following the principle of incremental development and design.
