export function validateLeetCodeUrl(url: string): boolean {
  const leetcodePattern = /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/?$/;
  return leetcodePattern.test(url);
}

export function extractProblemSlug(url: string): string | null {
  const match = url.match(/\/problems\/([a-z0-9-]+)\/?$/);
  return match ? match[1] : null;
}

export function formatProblemTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function generateProblemId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCategoryColor(category: string): { dot: string; bg: string } {
  switch (category) {
    case 'todo':
      return { dot: 'bg-gray-400', bg: 'bg-gray-50' };
    case 'practice':
      return { dot: 'bg-amber-400', bg: 'bg-amber-50' };
    case 'completed':
      return { dot: 'bg-emerald-400', bg: 'bg-emerald-50' };
    default:
      return { dot: 'bg-gray-400', bg: 'bg-gray-50' };
  }
}
