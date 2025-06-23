import { users, problems, type User, type InsertUser, type Problem, type InsertProblem } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Problem methods
  getAllProblems(): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: number, updates: Partial<Omit<Problem, 'id'>>): Promise<Problem | undefined>;
  deleteProblem(id: number): Promise<boolean>;
  getProblemsByCategory(category: string): Promise<Problem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private problems: Map<number, Problem>;
  private currentUserId: number;
  private currentProblemId: number;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.currentUserId = 1;
    this.currentProblemId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    return this.problems.get(id);
  }

  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const id = this.currentProblemId++;
    const problem: Problem = { ...insertProblem, id };
    this.problems.set(id, problem);
    return problem;
  }

  async updateProblem(id: number, updates: Partial<Omit<Problem, 'id'>>): Promise<Problem | undefined> {
    const existing = this.problems.get(id);
    if (!existing) return undefined;
    
    const updated: Problem = { ...existing, ...updates };
    this.problems.set(id, updated);
    return updated;
  }

  async deleteProblem(id: number): Promise<boolean> {
    return this.problems.delete(id);
  }

  async getProblemsByCategory(category: string): Promise<Problem[]> {
    return Array.from(this.problems.values()).filter(
      (problem) => problem.category === category
    );
  }
}

export const storage = new MemStorage();
