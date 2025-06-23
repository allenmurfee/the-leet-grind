import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  difficulty: text("difficulty").notNull(), // 'easy' | 'medium' | 'hard'
  tags: text("tags").array().notNull().default([]),
  category: text("category").notNull().default("todo"), // 'todo' | 'practice' | 'completed'
  dateAdded: text("date_added").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;

// Additional schemas for frontend validation
export const addProblemSchema = z.object({
  url: z.string().url().refine(
    (url) => /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/?$/.test(url),
    "Must be a valid LeetCode problem URL"
  ),
  category: z.enum(["todo", "practice", "completed"]).default("todo"),
  title: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.array(z.string()).optional(),
});

export type AddProblemInput = z.infer<typeof addProblemSchema>;
