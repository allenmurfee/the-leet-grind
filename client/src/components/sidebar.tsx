import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Code, Download, Upload, X } from 'lucide-react';
import { ProblemStats } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  stats: ProblemStats;
  onExport: () => void;
  onImport: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ stats, onExport, onImport, isOpen, onClose }: SidebarProps) {
  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
          {/* Close button for mobile */}
          {isOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Logo and Title */}
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">The Leet Grind</h1>
                <p className="text-xs text-gray-500">Progress Tracker</p>
              </div>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="mt-8 px-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h2>
            
            {/* Total Progress */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                <span className="text-sm">
                  <span className="font-bold text-gray-900">{stats.completed}</span>
                  <span className="text-gray-500">/{stats.total}</span>
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{progressPercentage}% Complete</p>
            </div>

            {/* Category Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3" />
                  <span className="text-sm text-gray-600">To Do</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.todo}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-400 rounded-full mr-3" />
                  <span className="text-sm text-gray-600">Practice More</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.practice}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.completed}</span>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="mt-8 px-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">By Difficulty</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  <span className="text-xs text-gray-600">Easy</span>
                </div>
                <span className="text-xs font-medium text-gray-900">{stats.easy}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <span className="text-xs text-gray-600">Medium</span>
                </div>
                <span className="text-xs font-medium text-gray-900">{stats.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                  <span className="text-xs text-gray-600">Hard</span>
                </div>
                <span className="text-xs font-medium text-gray-900">{stats.hard}</span>
              </div>
            </div>
          </div>

          {/* Export/Import */}
          <div className="mt-8 px-6">
            <div className="border-t border-gray-200 pt-6">
              <Button 
                variant="outline" 
                className="w-full mb-2" 
                onClick={onExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Progress
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onImport}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Progress
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
