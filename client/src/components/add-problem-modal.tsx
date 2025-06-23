import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addProblemSchema, type AddProblemInput } from '@shared/schema';
import { LeetCodeProblem } from '@/types';
import { validateLeetCodeUrl, extractProblemSlug, formatProblemTitle, generateProblemId } from '@/lib/leetcode';
import { useToast } from '@/hooks/use-toast';

interface AddProblemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (problem: LeetCodeProblem) => void;
}

export function AddProblemModal({ open, onClose, onAdd }: AddProblemModalProps) {
  const [showManualFields, setShowManualFields] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddProblemInput>({
    resolver: zodResolver(addProblemSchema),
    defaultValues: {
      url: '',
      category: 'todo',
      title: '',
      difficulty: 'easy',
      tags: [],
    },
  });

  const handleUrlChange = (url: string) => {
    form.setValue('url', url);
    
    if (url && validateLeetCodeUrl(url)) {
      // Auto-fill title from URL slug
      const slug = extractProblemSlug(url);
      if (slug) {
        const title = formatProblemTitle(slug);
        form.setValue('title', title);
        setShowManualFields(true);
      }
    } else if (url) {
      setShowManualFields(true);
    } else {
      setShowManualFields(false);
      form.reset();
    }
  };

  const onSubmit = (data: AddProblemInput) => {
    if (!validateLeetCodeUrl(data.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LeetCode problem URL",
        variant: "destructive",
      });
      return;
    }

    const problem: LeetCodeProblem = {
      id: generateProblemId(),
      title: data.title,
      url: data.url,
      difficulty: data.difficulty,
      tags: data.tags,
      category: data.category,
      dateAdded: new Date().toISOString(),
    };

    onAdd(problem);
    form.reset();
    setShowManualFields(false);
    onClose();

    toast({
      title: "Problem added!",
      description: `${problem.title} has been added to your list.`,
    });
  };

  const handleClose = () => {
    form.reset();
    setShowManualFields(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeetCode URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://leetcode.com/problems/two-sum/"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleUrlChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showManualFields && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Two Sum" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="practice">Practice More</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="array, hash-table, two-pointers"
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(tag => tag.length > 0);
                      form.setValue('tags', tags);
                    }}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Add Problem
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}