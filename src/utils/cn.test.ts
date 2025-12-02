import { describe, it, expect } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('p-4', 'bg-red-500');
    expect(result).toBe('p-4 bg-red-500');
  });

  it('handles conditional classes', () => {
    const result = cn('p-4', true && 'bg-red-500', false && 'text-white');
    expect(result).toBe('p-4 bg-red-500');
  });

  it('resolves tailwind conflicts (merges padding)', () => {
    // p-4 should be overridden by p-2 if p-2 comes last or has higher specificity logic in tailwind-merge
    // tailwind-merge usually keeps the last one
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('handles complex combinations', () => {
    const isError = true;
    const result = cn(
      'flex items-center',
      isError ? 'text-red-500' : 'text-green-500',
      'p-4'
    );
    expect(result).toBe('flex items-center text-red-500 p-4');
  });
});
