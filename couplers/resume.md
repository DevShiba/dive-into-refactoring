# Couplers

The category of Couplers is a type of "bad smell" in code, signaling potential design issues related to how tightly different parts of the system are bound together.

In software architecture, two artifacts of parts of a software system are coupled if a change in one might require a change in other to maintain proper functionality. Low coupling between modules is generally considered a key design principle. Coupler smells indicate problems where modules are excessively or inappropriately interdependent.

## Feature Envy

- **Definition**: Occurs when a function or method in one module spends more time communicating with functions or data inside a different module than it does within its own module. A classic sign is when a function repeatedly invokes getter methods on another object to calculate a value. This smell often arises because behavior and logic that logically belong with the data are instead implemented in external classes that manipulate the data structure in excessive detail.

- **Impact**: This is a symptom of poor modularization, as software elements should be grouped to maximize internal interaction and minimize interaction between separate units. It often leads to the logic being scattered across the codebase, increasing the effort and risk of introducing bugs when the data structure or rules change.e

- **Solutions/Refactorings**: The primary solution is to **Move Function**. The function clearly "wants to be with the data" it primarily uses. If only a portion of the function exhibits feature envy, use **Extract Function** on that part and then **Move Function** to relocate the extracted piece. If the function uses features from several modules, the recommended heuristic is to locate the function with the module that holds most of the necessary data.

## Inappropriate Intimacy

- **Definition**: Occurs when modules exchange data around too much, causing excessive coupling. This is metaphorically described as modules "whispering to each other by the coffee machine"

- **Impact**: This excessive data exchange increases coupling between parts of the code. Inheritance can sometimes leads to this type of coupling, as subclasses inevitably know more about their parents than the parents might prefer them to know.

- **Solutions/Refactorings**: To reduce the need for modules to "chat", use **Move Function** and **Move Field** to put related functionality together. Alternatively, you can create a third module to contain the common data or functionality, acting as a "well-regulated vehicle". If the trading involves delegation, use **Hide Delegate** to introduce an intermediary. If the coupling stems from inheritance, consider replacing the hierarchy structure using **Replace Subclass with Delegate** or **Replace Superclass with Delegate**.

## Message Chains

- **Definition**: Occur when a client requests one object, then asks that object for another object, which is then asked for yet another object, and so on. This typically appears in the code as long sequence of getter methods or a long sequence of temporary variables.

- **Impact**: This method of navigation tightly couples the client code to the deep structure of the object relationships. If any of the intermediate relationships change, the client code must also be modified.

- **Solutions/Refactorings**: The main fix is **Hide Delegate**. This involves placing a simple delegating method on the server object that hides the delegate, so clients are no longer dependent on the delegate's interface. A secondary approach is to look at what the resulting object is used for, and use **Extract Function** to isolate that portion of code, then **Move Function** to push the code that uses the result down the chain. Adding a method to the appropriate intermediate object to perform the required navigation can also help if multiple clients need to access the final object. (Note: If Hide Delegate is overused, it can turn intermediate objects into a different smell: Middle Man).
