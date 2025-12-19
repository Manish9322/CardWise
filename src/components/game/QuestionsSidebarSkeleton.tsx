import { Skeleton } from '@/components/ui/skeleton';

export default function QuestionsSidebarSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="p-4 rounded-lg bg-muted/50">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6 mt-1" />
        </div>
      ))}
    </div>
  );
}
