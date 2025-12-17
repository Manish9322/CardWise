import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

export function ProfileOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header section skeleton */}
      <div className="mb-6">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-4 w-80 mt-2 rounded-md" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mt-1" />
              <Skeleton className="h-3 w-48 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <Skeleton className="h-5 w-48 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
