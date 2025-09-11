# Change Preventers

Change preventers are elements or practices within software systems and organizations that make modifications difficult, costly, or risky. They hinder a system's evolvability, which is the ease with which it can be modified and adapted to changing requirements, and which is closely tied to simplicity and good abstractions. The true measure of good code lies in how easily it can be changed. Conversely, poor design leads to systems that are hard to understand and change, increasing the likelihood of errors and technical debt.

Specific Change Preventers:

## Divergent Change

- **Definition**: This "bad smell in code" occurs when a single module is frequently modified for different, unrelated reason. For instance, if a module needs change for both new database requirements and new financial instruments, it exhibits divergent change.
- **Impact**: It forces developers to understand multiple contexts within a single module when making a change, increasing cognitive load and the risk of introducing errors in unrelated parts. This makes it challenging to isolate and manage specific changes effectively
- **Solutions/Refactorings**: To address divergent change, separate the different contexts into distinct modules. Functions should generally reside with the module that holds most of the data they operate on. Techniques like **Extract Function**, _Slide Statements_, and **Pull Up Method** are useful. Design patterns such as **Strategy** and **Visitor** can also isolate varying behaviors. The core principle is to group "things together that change together".

## Dead Code

- **Definition**: Refers to code that exists within the system but is no longer executed or used.
- **Impact**: Even if compilers optimize it away, dead code creates a burden on developers. It lacks any indication that it's obsolete, leading programmers to spend time understanding its purpose, which can cause confusion and wasted effort when its removal or modification has no impact on the system's output. It also obscures the essential meaning of the software model.
- **Solutions/Refactorings**: The primary solution is to **Remove Dead Code** to enhance clarity and reduce cognitive overhead for maintainers.

## Data Class

- **Definition**: These are classes that primarly consist of fields and their associated getter and setter methods, serving marely as "dumb data holders" without significant ecanpsulated behavior.
- **Impact**: Data classes often signify that relevant behavior is located elsewhere, leading to excessive manipulation by other classes. This increases coupling throughout the system, making changes more difficult because logic pertaining to the data is scattered and not co-located with the data itself.
- **Solutions/Refactorings**: The recommended approach is to **Move Function** into the data class, consolidating behavior with its data. If a full function cannot be moved, **Extract Function** can create smaller, movable pieces of behavior. **Remove Setting Method** advised for fields that should not be changed, especially for immutable data classes used as "result records". If public fields are exposed, Encapsulate Record should be applied.

## Shotgun Surgery

- **Definition**: This anti-pattern is characterized by requiring many small, disparated edits across a multitude of different classes for a single conceptual change.
- **Impact**: Changes become hard to track, increasing the risk of missing a critical modification and introducing bugs. It indicates that a single responsibility is fragmented across too many places.
- **Solutions/Refactorings**: Consolidate scattered changes using **Move Function** and **Move Field** to bring related logic into a single module. **Combine Functions into Class** or **Combine Functions into Transform** can be used when functions operate or similar data, and **Split Phase** can also help restructure logic.

## Large Class

- **Definition**: A class that attempts to manage too many responsibilities, often evidenced by an excessive number of fields.
- **Impact**: Large classes inevitably lead to duplicated code and complex internal logic, making them difficult to understand and modify. Issues also arise when subtyping only affects a few features or when features require different subtyping approaches.
- **Solutions/Refactorings**: **Extract Class** to break down responsibilities into more cohesive units. If appropriate, **Extract Superclass** or **Replace Type Code with Subclasses** can be used to leverage inheritance for specialized functionalities

## Speculative Generality

- **Definition**: This anti-pattern occurs when developers add "all sorts of hooks and special cases to handle things that aren’t required," based on the idea that "we’ll need the ability to do this kind of thing someday". It represents over-engineering solutions by adding functionality that may be useful in the future, which goes against the "You Aren't Gonna Need It" (YAGNI) principle.
- **Impact**: Code with speculative generality is often harder to understand and maintain. The unnecessary machinery "just gets in the way" if it isn't used. Avoiding YAGNI code contributes to improved reliability, simpler code, fewer security bugs, and less developer time spent maintaining unused code.
- **Solutions/Refactorings**: The primary solution is to "get rid of it". If you have abstract classes that are not serving a significant purpose, use **Collapse Hierarchy**. Unnecessary delegation can be removed using **Inline Function** and **Inline Class** . Functions with unused parameters should be refactored using **Change Function Declaration** to remove those parameters, especially those added for anticipated future variations that never materialized. If a function or class is only being used by test cases, it indicates speculative generality; in such instances, delete the test case and apply **Remove Dead Code** .

## Lazy Class

- **Definition**: This code smell refers to a program element that was created to add structure for potential variation, reuse, or better naming, but where the anticipated structure is ultimately not needed or does not justify its existence. This can manifest as a function whose body is as clear as its name, a class that essentially performs one simple function, or a class that has been reduced in scope through refactoring.
- **Impact**: A lazy class or element incurs an unnecessary cost in understanding and maintenance. It adds needless indirection. If a subclass does too little, the cost in understanding it is no longer worthwhile.
- **Solutions/Refactorings**: Such program elements "need to die with dignity". Typically, this means using **Inline Function** to remove functions where the body is as clear as the name, or **Inline Class** to fold a class into another if it's no longer carrying its weight. In the context of inheritance, if a class and its parent are not sufficiently different, **Collapse Hierarchy** can be used to merge them. If a subclass provides minimal value, it's best to remove it and replace it "with a field on its superclass," using **Remove Subclass**
