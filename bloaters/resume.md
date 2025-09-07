# Bloaters

Bloaters are code smells that manifest as oversized code constructs—methods, classes, or modules that have grown beyond manageable proportions. These violations of the Single Responsibility Principle make code difficult to understand, test, and maintain. Bloaters typically emerge through incremental feature additions, copy-paste programming, and lack of refactoring discipline. As requirements evolve, developers often take shortcuts by adding functionality to existing code rather than restructuring, leading to decreased cohesion and increased coupling. This technical debt accumulates gradually, making the bloated code increasingly resistant to change and prone to bugs.

The main types of bloaters include:

- **Long Method**
- **Large Class**
- **Primitive Obsession**
- **Long Parameter List**
- **Data Clumps**

## Long Method

A method contains too many lines of code. Generally, any method longer than ten lines should make you start asking questions about whether it's doing too much and could be broken down into smaller, more focused methods.

## Large Class

A class contains too many fields, methods, or lines of code, making it difficult to understand and maintain. When a class tries to do too much, it becomes harder to modify and test.

## Primitive Obsession

- Use of primitives instead of small objects for simple tasks (such as currency, ranges, special strings for phone numbers, etc.)
- Use of constants for coding information (such as a constant USER_ADMIN_ROLE = 1 for referring to users with administrator rights)
- Use of string constants as field names for use in data arrays

## Long Parameter List

More than three or four parameters for a method. This makes the method harder to understand, test, and maintain.

## Data Clumps

Sometimes different parts of the code contain identical groups of variables (such as parameters for connecting to a database). These clumps should be turned into their own class to improve code organization and reduce duplication.
Rule of thumb: Delete one of the data values and see whether the other values still make sense.
If this is not the case, this is a good sign that this group of variables should be combined into an object.
