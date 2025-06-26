import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit, Trash2, Check } from 'lucide-react';
import { LeetCodeProblem } from '@/types';
import { getDifficultyColor } from '@/lib/leetcode';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  problem: LeetCodeProblem;
  onUpdate: (id: string, updates: Partial<LeetCodeProblem>) => void;
  onDelete: (id: string) => void;
}

export function ProblemCard({ problem, onUpdate, onDelete }: ProblemCardProps) {
  const handleCategoryChange = (newCategory: string) => {
    onUpdate(problem.id, { category: newCategory as LeetCodeProblem['category'] });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${problem.title}"?`)) {
      onDelete(problem.id);
    }
  };

  const isCompleted = problem.category === 'completed';

  return (
    <div className={cn(
      "bg-background dark:bg-background rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4",
      isCompleted && "opacity-75"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 flex items-center">
            {isCompleted && <Check className="h-3 w-3 text-emerald-500 mr-2 flex-shrink-0" />}
            {problem.title}
          </h3>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-600 flex items-center group"
          >
            <span className="truncate">
              {problem.url.replace('https://', '')}
            </span>
            <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        </div>
        <div className="ml-2 flex-shrink-0">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", getDifficultyColor(problem.difficulty))}
          >
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Tags */}
      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-gray-100 dark:bg-muted text-gray-700 dark:text-white border-0">
              {tag}
            </Badge>
          ))}
          {problem.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 border-0">
              +{problem.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Select value={problem.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="practice">Practice More</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500"
            title="Edit"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
