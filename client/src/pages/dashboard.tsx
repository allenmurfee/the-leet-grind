import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Menu, Sun, Moon } from "lucide-react";
import { AddProblemModal } from "@/components/add-problem-modal";
import { ProblemCard } from "@/components/problem-card";
import { Sidebar } from "@/components/sidebar";
import { localStorageManager } from "@/lib/storage";
import { LeetCodeProblem, ProblemStats } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorageManager.loadData();
    setProblems(data.problems);
  }, []);

  const stats: ProblemStats = useMemo(() => {
    const total = problems.length;
    const completed = problems.filter((p) => p.category === "completed").length;
    const practice = problems.filter((p) => p.category === "practice").length;
    const todo = problems.filter((p) => p.category === "todo").length;
    const easy = problems.filter((p) => p.difficulty === "easy").length;
    const medium = problems.filter((p) => p.difficulty === "medium").length;
    const hard = problems.filter((p) => p.difficulty === "hard").length;

    return { total, completed, practice, todo, easy, medium, hard };
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        searchTerm === "" ||
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        categoryFilter === "all" || problem.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || problem.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [problems, searchTerm, categoryFilter, difficultyFilter]);

  const problemsByCategory = useMemo(() => {
    const categories = ["todo", "practice", "completed"];
    return categories.map((category) => ({
      category,
      problems: filteredProblems.filter((p) => p.category === category),
    }));
  }, [filteredProblems]);

  const handleAddProblem = (problem: LeetCodeProblem) => {
    const updatedProblems = [...problems, problem];
    setProblems(updatedProblems);
    localStorageManager.addProblem(problem);
    setShowAddModal(false);
    toast({
      title: "Problem Added",
      description: `"${problem.title}" has been added to your ${problem.category} list.`,
    });
  };

  const handleUpdateProblem = (
    id: string,
    updates: Partial<LeetCodeProblem>,
  ) => {
    const updatedProblems = problems.map((p) =>
      p.id === id ? { ...p, ...updates } : p,
    );
    setProblems(updatedProblems);
    localStorageManager.updateProblem(id, updates);

    if (updates.category) {
      toast({
        title: "Category Updated",
        description: `Problem moved to ${updates.category}.`,
      });
    }
  };

  const handleDeleteProblem = (id: string) => {
    const problem = problems.find((p) => p.id === id);
    const updatedProblems = problems.filter((p) => p.id !== id);
    setProblems(updatedProblems);
    localStorageManager.deleteProblem(id);
    toast({
      title: "Problem Deleted",
      description: `"${problem?.title}" has been removed.`,
      variant: "destructive",
    });
  };

  const handleExport = () => {
    try {
      const dataStr = localStorageManager.exportData();
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leetcode-progress.json";
      link.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Your progress has been exported to a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const success = localStorageManager.importData(
              e.target?.result as string,
            );
            if (success) {
              const data = localStorageManager.loadData();
              setProblems(data.problems);
              toast({
                title: "Import Successful",
                description: "Your progress has been imported successfully.",
              });
            } else {
              throw new Error("Invalid file format");
            }
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Error importing file: Invalid JSON format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setDifficultyFilter("all");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "todo":
        return "To Do";
      case "practice":
        return "Practice More";
      case "completed":
        return "Completed";
      default:
        return category;
    }
  };

  return (
    <div className="flex h-screen bg-secondary dark:bg-secondary font-inter">
      {/* Sidebar */}
      <Sidebar
        stats={stats}
        onExport={handleExport}
        onImport={handleImport}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-80 flex flex-col flex-1">
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-background dark:bg-background border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search and Add Problem */}
            <div className="flex justify-between items-center space-x-4 flex-1 max-w-2xl">
              {/* Filter Button */}
              <Button
                variant="ghost"
                size="sm"
                className="mr-max"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </Button>
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search problems..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add Problem Button */}
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Problem
              </Button>
            </div>

            {/* Dark Mode Button */}
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="practice">Practice More</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Problems Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {problemsByCategory.map(
            ({ category, problems: categoryProblems }) => (
              <div key={category} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        category === "todo"
                          ? "bg-gray-400"
                          : category === "practice"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                    />
                    {getCategoryDisplayName(category)}
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {categoryProblems.length}
                    </span>
                  </h2>
                </div>

                {categoryProblems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-white">
                    <p>No problems in this category yet.</p>
                    {category === "todo" && problems.length === 0 && (
                      <p className="mt-2">
                        <Button
                          variant="link"
                          onClick={() => setShowAddModal(true)}
                          className="p-0 h-auto text-blue-500"
                        >
                          Add your first problem
                        </Button>{" "}
                        to get started!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {categoryProblems.map((problem) => (
                      <ProblemCard
                        key={problem.id}
                        problem={problem}
                        onUpdate={handleUpdateProblem}
                        onDelete={handleDeleteProblem}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Add Problem Modal */}
      <AddProblemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProblem}
      />
    </div>
  );
}
