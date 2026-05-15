import { Card, Skeleton } from '@/components/ui';

// Placeholder shown while listings load — mirrors the AnimalCard layout.
export default function AnimalCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-56" rounded="rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-3 border-t border-surface-200">
          <Skeleton className="h-3 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" rounded="rounded-full" />
            <Skeleton className="h-9 w-9" rounded="rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
