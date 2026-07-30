'use client';

import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  value,
  onChange,
  className,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCategories = ['Semua', ...categories];

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
      >
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{value || 'Semua Kategori'}</span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onChange(category);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl',
                value === category && 'bg-primary/10 text-primary font-medium'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
