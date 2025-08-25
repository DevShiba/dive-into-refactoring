# Data Clumps

Data clumps refer to groups of data items that frequently appear together in various parts of the codebase. This can be observed when the same three or four data items are used as fields in multiple classes or as parameters in many method signatures. The core idea is that such "bunches of data that hang around together really ought to find a home together" in a single, cohesive unit.

A good test for identifying a data clump is to consider if deleting one of the data values would make the others meaningless. If so, it's a strong indication that these values belong together in an object.

## How to avoid / Why it's a problem

Instead of focusing on "how to avoid" in a preventative sense, this section can emphasize why data clumps are problematic and what principles they violate.

- **Increased Duplication**: The repeated appearance of the same group of data items inherently creates duplication across the codebase. This means if you need to change the duplicated data (e.g., add a new field to the "clump"), you have to find and update each instance, increasing the risk of errors and making modifications harder.

- **Reduced Cohesion and Clarity**: When data items that logically belong together are scattered, it obscurer their relationship and makes the code harder to understand. The program's desgin becomes less clear, as the underlying "data structures are the key to understanding what's going on".

- **Long Parameter List**: Data clumps frequently manifest as "long parameter lists" in method signatures, which are "often confusing in their own right". Such long lists make function calls harder to understand and maintain.

- **Impeded Refactoring**: Without a clear. encapsulated structure for related data, it becomes more difficult to perform other refactorings or to introduce new behavior that operates on this data.

## Refactoring techniques

### Extract Method

### Introduce Parameter Object

### Preserve Whole Object

## When not refactor

- **If the code is not being modified**: "If i run across code that is a mess, but i don't need to modify it, then i don't need to refactor it".
- **If rewriting is easier**: Sometimes, it's simplerto "rewrite it than to refactor it". This requires good judgment and experience.
- **If refactoring for its own sake**: Avoid "supple designs" that are "just demonstrations of technical virtuosity but fail to cut to the core of the domain".
- **Before a critical release**: Don't refactor the day before a release
- **Performance vs. Refactoring**: While refactoring generally leads to faster development, if a specific refactoring introduces performance slowdowns, finish refactoring first and do performance tuning afterwards.
- **Trade-off for small features**: If a large refactoring is needed, but the new feature you want to add is very small, you might prioritize adding the feature first, leaving the larger refactoring for later.
- **Infrequently touched code**: If the code is "part of the code I rarely touch," the cost of inconvenience from not refactoring might be acceptable
