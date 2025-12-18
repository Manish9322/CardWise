import { Skeleton } from '@/components/ui/skeleton';

export default function GuessCardSkeleton() {
  return (
    <div className="relative h-96 w-full max-w-full flex items-center justify-center">
      <div className="flex items-center justify-center p-6 w-full">
        <Skeleton className="h-32 w-full max-w-3xl rounded-lg" />
      </div>
    </div>
  );
}
