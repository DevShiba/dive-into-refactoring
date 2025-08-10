// The Problem
// Subclasses have constructors with code that's mostly identical, leading to duplication.

// === BEFORE: Subclasses with duplicate constructor code ===

class Manager {
  protected name: string;
  protected id: string;
  protected department: string;
  private team: string[];
  private budget: number;

  constructor(name: string, id: string, department: string, team: string[], budget: number) {
    // Duplicate initialization code
    this.name = name;
    this.id = id;
    this.department = department;
    
    this.team = team;
    this.budget = budget;
    console.log(`Manager ${name} created with team of ${team.length} members`);
  }

  getInfo(): string {
    return `${this.name} (ID: ${this.id}) - ${this.department}`;
  }

  getTeamInfo(): string {
    return `Manager: ${this.name}, Team: ${this.team.join(', ')}, Budget: $${this.budget}`;
  }
}

class Developer {
  protected name: string;
  protected id: string;
  protected department: string;
  private skills: string[];
  private level: string;

  constructor(name: string, id: string, department: string, skills: string[], level: string) {
    // Same duplicate initialization code
    this.name = name;
    this.id = id;
    this.department = department;
    
    this.skills = skills;
    this.level = level;
    console.log(`Developer ${name} created with ${skills.length} skills`);
  }

  getInfo(): string {
    return `${this.name} (ID: ${this.id}) - ${this.department}`;
  }

  getSkillsInfo(): string {
    return `Developer: ${this.name}, Level: ${this.level}, Skills: ${this.skills.join(', ')}`;
  }
}

class Designer {
  protected name: string;
  protected id: string;
  protected department: string;
  private tools: string[];
  private portfolio: string;

  constructor(name: string, id: string, department: string, tools: string[], portfolio: string) {
    // Same duplicate initialization code again
    this.name = name;
    this.id = id;
    this.department = department;
    
    this.tools = tools;
    this.portfolio = portfolio;
    console.log(`Designer ${name} created with portfolio: ${portfolio}`);
  }

  getInfo(): string {
    return `${this.name} (ID: ${this.id}) - ${this.department}`;
  }

  getPortfolioInfo(): string {
    return `Designer: ${this.name}, Tools: ${this.tools.join(', ')}, Portfolio: ${this.portfolio}`;
  }
}

// The Solution
// Create a superclass constructor and move the common code to it. Call the superclass constructor in the subclass constructors.

// === AFTER: Pull Up Constructor Body refactoring ===

class EmployeeRefactored {
  protected name: string;
  protected id: string;
  protected department: string;

  constructor(name: string, id: string, department: string) {
    this.name = name;
    this.id = id;
    this.department = department;
  }

  getInfo(): string {
    return `${this.name} (ID: ${this.id}) - ${this.department}`;
  }
}

class ManagerRefactored extends EmployeeRefactored {
  private team: string[];
  private budget: number;

  constructor(name: string, id: string, department: string, team: string[], budget: number) {
    super(name, id, department); // Call superclass constructor
    
    this.team = team;
    this.budget = budget;
    console.log(`Manager ${name} created with team of ${team.length} members`);
  }

  getTeamInfo(): string {
    return `Manager: ${this.name}, Team: ${this.team.join(', ')}, Budget: $${this.budget}`;
  }
}

class DeveloperRefactored extends EmployeeRefactored {
  private skills: string[];
  private level: string;

  constructor(name: string, id: string, department: string, skills: string[], level: string) {
    super(name, id, department); // Call superclass constructor
    
    this.skills = skills;
    this.level = level;
    console.log(`Developer ${name} created with ${skills.length} skills`);
  }

  getSkillsInfo(): string {
    return `Developer: ${this.name}, Level: ${this.level}, Skills: ${this.skills.join(', ')}`;
  }
}

class DesignerRefactored extends EmployeeRefactored {
  private tools: string[];
  private portfolio: string;

  constructor(name: string, id: string, department: string, tools: string[], portfolio: string) {
    super(name, id, department); // Call superclass constructor
    
    this.tools = tools;
    this.portfolio = portfolio;
    console.log(`Designer ${name} created with portfolio: ${portfolio}`);
  }

  getPortfolioInfo(): string {
    return `Designer: ${this.name}, Tools: ${this.tools.join(', ')}, Portfolio: ${this.portfolio}`;
  }
}

// === USAGE EXAMPLE ===

console.log("=== Before Pull Up Constructor Body ===");

const manager = new Manager(
  "Alice Johnson", 
  "MGR001", 
  "Engineering", 
  ["Bob", "Charlie", "Diana"], 
  50000
);
console.log(manager.getInfo());
console.log(manager.getTeamInfo());

const developer = new Developer(
  "Bob Smith", 
  "DEV001", 
  "Engineering", 
  ["TypeScript", "React", "Node.js"], 
  "Senior"
);
console.log(developer.getInfo());
console.log(developer.getSkillsInfo());

const designer = new Designer(
  "Carol White", 
  "DES001", 
  "Design", 
  ["Figma", "Photoshop", "Sketch"], 
  "https://portfolio.carol.com"
);
console.log(designer.getInfo());
console.log(designer.getPortfolioInfo());

console.log("\n=== After Pull Up Constructor Body ===");

const managerRefactored = new ManagerRefactored(
  "Alice Johnson", 
  "MGR001", 
  "Engineering", 
  ["Bob", "Charlie", "Diana"], 
  50000
);
console.log(managerRefactored.getInfo());
console.log(managerRefactored.getTeamInfo());

const developerRefactored = new DeveloperRefactored(
  "Bob Smith", 
  "DEV001", 
  "Engineering", 
  ["TypeScript", "React", "Node.js"], 
  "Senior"
);
console.log(developerRefactored.getInfo());
console.log(developerRefactored.getSkillsInfo());

const designerRefactored = new DesignerRefactored(
  "Carol White", 
  "DES001", 
  "Design", 
  ["Figma", "Photoshop", "Sketch"], 
  "https://portfolio.carol.com"
);
console.log(designerRefactored.getInfo());
console.log(designerRefactored.getPortfolioInfo());

// Now all classes properly use inheritance
const employees: EmployeeRefactored[] = [
  managerRefactored,
  developerRefactored,
  designerRefactored
];

console.log("\n=== Polymorphic Usage ===");
employees.forEach(employee => {
  console.log(employee.getInfo());
});


