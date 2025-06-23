import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProblemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all problems
  app.get("/api/problems", async (req, res) => {
    try {
      const problems = await storage.getAllProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  // Create a new problem
  app.post("/api/problems", async (req, res) => {
    try {
      const validatedData = insertProblemSchema.parse(req.body);
      const problem = await storage.createProblem(validatedData);
      res.status(201).json(problem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create problem" });
      }
    }
  });

  // Update a problem
  app.patch("/api/problems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const problem = await storage.updateProblem(id, updates);
      
      if (!problem) {
        res.status(404).json({ message: "Problem not found" });
        return;
      }
      
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update problem" });
    }
  });

  // Delete a problem
  app.delete("/api/problems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProblem(id);
      
      if (!deleted) {
        res.status(404).json({ message: "Problem not found" });
        return;
      }
      
      res.json({ message: "Problem deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete problem" });
    }
  });

  // Get problems by category
  app.get("/api/problems/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const problems = await storage.getProblemsByCategory(category);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems by category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
