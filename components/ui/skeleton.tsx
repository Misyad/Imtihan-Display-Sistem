'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function QuestionTableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
        >
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-24 h-4" />
          <Skeleton className="flex-1 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="p-4 bg-card rounded-xl border border-border space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
    </div>
  );
}

export function QuestionFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-full h-32" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-full h-32" />
      </div>
    </div>
  );
}
